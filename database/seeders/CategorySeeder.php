<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Segi Empat', 'description' => 'Hijab segi empat berbagai motif dan bahan.'],
            ['name' => 'Pashmina', 'description' => 'Hijab pashmina panjang, cocok untuk berbagai gaya.'],
            ['name' => 'Bergo', 'description' => 'Hijab instan bergo, praktis dan simpel dipakai.'],
            ['name' => 'Instan', 'description' => 'Hijab instan siap pakai tanpa peniti.'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                ]
            );
        }
    }
}
