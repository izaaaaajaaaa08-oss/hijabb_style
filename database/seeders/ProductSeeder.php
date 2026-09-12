<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Segi Empat' => [
                ['name' => 'Hijab Segi Empat Voal Polos', 'price' => 45000],
                ['name' => 'Hijab Segi Empat Motif Bunga', 'price' => 55000],
            ],
            'Pashmina' => [
                ['name' => 'Pashmina Ceruty Babydoll', 'price' => 65000],
                ['name' => 'Pashmina Diamond Italiano', 'price' => 75000],
            ],
            'Bergo' => [
                ['name' => 'Bergo Instan Rabbani', 'price' => 60000],
                ['name' => 'Bergo Syar\'i 2 Layer', 'price' => 70000],
            ],
            'Instan' => [
                ['name' => 'Hijab Instan Jersey', 'price' => 50000],
                ['name' => 'Hijab Instan Antem Anteman', 'price' => 58000],
            ],
        ];

        $colors = ['Hitam', 'Maroon', 'Dusty Pink', 'Sage Green', 'Cream'];

        foreach ($data as $categoryName => $products) {
            $category = Category::where('name', $categoryName)->first();

            foreach ($products as $item) {
                $product = Product::updateOrCreate(
                    ['slug' => Str::slug($item['name'])],
                    [
                        'category_id' => $category->id,
                        'name' => $item['name'],
                        'description' => "{$item['name']} berkualitas premium, nyaman dipakai sehari-hari, tersedia berbagai warna.",
                        'base_price' => $item['price'],
                        'is_active' => true,
                    ]
                );

                // Buat 3 varian warna per produk
                foreach (array_slice($colors, 0, 3) as $index => $color) {
                    ProductVariant::updateOrCreate(
                        ['sku' => Str::upper(Str::slug($item['name'], '')) . '-' . Str::upper(substr($color, 0, 3))],
                        [
                            'product_id' => $product->id,
                            'color' => $color,
                            'size' => 'All Size',
                            'stock' => rand(0, 20),
                            'price_override' => null,
                            'sku' => Str::upper(Str::slug($item['name'], '')) . '-' . Str::upper(substr($color, 0, 3)),
                        ]
                    );
                }

                // Placeholder gambar (ganti path sesuai gambar asli nanti)
                ProductImage::updateOrCreate(
                    ['product_id' => $product->id, 'is_primary' => true],
                    ['image_path' => 'products/placeholder.jpg']
                );
            }
        }
    }
}
