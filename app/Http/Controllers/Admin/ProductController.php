<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with(['category', 'primaryImage', 'variants']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        $products = $query->latest()->paginate(10)->withQueryString();
        $categories = Category::all();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create(): Response
    {
        $categories = Category::all();

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'required|string',
            'base_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'variants' => 'required|array|min:1',
            'variants.*.color' => 'required|string|max:100',
            'variants.*.size' => 'nullable|string|max:50',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.price_override' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        DB::transaction(function () use ($request) {
            $product = Product::create([
                'category_id' => $request->category_id,
                'name' => $request->name,
                'slug' => Str::slug($request->name),
                'description' => $request->description,
                'base_price' => $request->base_price,
                'is_active' => $request->boolean('is_active', true),
            ]);

            foreach ($request->variants as $var) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'color' => $var['color'],
                    'size' => $var['size'] ?? 'All Size',
                    'stock' => $var['stock'],
                    'price_override' => !empty($var['price_override']) ? $var['price_override'] : null,
                    'sku' => Str::upper(Str::slug($product->name, '')) . '-' . Str::upper(substr($var['color'], 0, 3)) . '-' . rand(100, 999),
                ]);
            }

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . Str::slug($product->name) . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('products'), $filename);

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => 'products/' . $filename,
                    'is_primary' => true,
                ]);
            } else {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => 'products/placeholder.jpg',
                    'is_primary' => true,
                ]);
            }
        });

        return redirect()->route('admin.products.index')->with('success', 'Produk hijab baru berhasil ditambahkan!');
    }

    public function edit(Product $product): Response
    {
        $product->load(['category', 'images', 'variants']);
        $categories = Category::all();

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255|unique:products,name,' . $product->id,
            'description' => 'required|string',
            'base_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'variants' => 'required|array|min:1',
            'variants.*.color' => 'required|string|max:100',
            'variants.*.size' => 'nullable|string|max:50',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.price_override' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        DB::transaction(function () use ($request, $product) {
            $product->update([
                'category_id' => $request->category_id,
                'name' => $request->name,
                'slug' => Str::slug($request->name),
                'description' => $request->description,
                'base_price' => $request->base_price,
                'is_active' => $request->boolean('is_active', true),
            ]);

            // Simple variant synchronization
            $product->variants()->delete();
            foreach ($request->variants as $var) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'color' => $var['color'],
                    'size' => $var['size'] ?? 'All Size',
                    'stock' => $var['stock'],
                    'price_override' => !empty($var['price_override']) ? $var['price_override'] : null,
                    'sku' => Str::upper(Str::slug($product->name, '')) . '-' . Str::upper(substr($var['color'], 0, 3)) . '-' . rand(100, 999),
                ]);
            }

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . Str::slug($product->name) . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('products'), $filename);

                $product->images()->delete();
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => 'products/' . $filename,
                    'is_primary' => true,
                ]);
            }
        });

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil diperbarui!');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('success', 'Produk berhasil dihapus.');
    }
}
