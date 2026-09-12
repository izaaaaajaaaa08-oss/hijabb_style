<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductCatalogController extends Controller
{
    public function home(Request $request): Response
    {
        $categories = Category::withCount(['products' => function ($query) {
            $query->where('is_active', true);
        }])->get();

        $featuredProducts = Product::where('is_active', true)
            ->with(['category', 'primaryImage', 'variants'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->latest()
            ->take(8)
            ->get();

        $userWishlists = [];
        if ($request->user()) {
            $userWishlists = $request->user()->wishlists()->pluck('product_id')->toArray();
        }

        return Inertia::render('Guest/Home', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'userWishlists' => $userWishlists,
        ]);
    }

    public function index(Request $request): Response
    {
        $query = Product::where('is_active', true)
            ->with(['category', 'primaryImage', 'variants'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating');

        // Filter category
        if ($request->filled('category')) {
            $categorySlug = $request->input('category');
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter color
        if ($request->filled('color')) {
            $color = $request->input('color');
            $query->whereHas('variants', function ($q) use ($color) {
                $q->where('color', $color);
            });
        }

        // Filter min/max price
        if ($request->filled('min_price')) {
            $query->where('base_price', '>=', $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('base_price', '<=', $request->input('max_price'));
        }

        // Sorting
        $sort = $request->input('sort', 'latest');
        match ($sort) {
            'price_low' => $query->orderBy('base_price', 'asc'),
            'price_high' => $query->orderBy('base_price', 'desc'),
            'rating' => $query->orderByDesc('reviews_avg_rating'),
            default => $query->latest(),
        };

        $products = $query->paginate(12)->withQueryString();
        $categories = Category::withCount(['products' => function ($query) {
            $query->where('is_active', true);
        }])->get();

        $userWishlists = [];
        if ($request->user()) {
            $userWishlists = $request->user()->wishlists()->pluck('product_id')->toArray();
        }

        return Inertia::render('Guest/ProductList', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search', 'color', 'min_price', 'max_price', 'sort']),
            'userWishlists' => $userWishlists,
        ]);
    }

    public function show(Request $request, string $slug): Response
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'category',
                'images',
                'variants',
                'reviews.user',
            ])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->firstOrFail();

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->with(['category', 'primaryImage', 'variants'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->take(4)
            ->get();

        $isWishlisted = false;
        if ($request->user()) {
            $isWishlisted = $request->user()->wishlists()->where('product_id', $product->id)->exists();
        }

        return Inertia::render('Guest/ProductDetail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'isWishlisted' => $isWishlisted,
        ]);
    }
}
