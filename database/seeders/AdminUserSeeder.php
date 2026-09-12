<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@hijabstyle.test'],
            [
                'name' => 'Admin HijabStyle',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '081234567890',
                'email_verified_at' => now(),
            ]
        );

        // Contoh akun customer untuk testing
        User::updateOrCreate(
            ['email' => 'customer@hijabstyle.test'],
            [
                'name' => 'Siti Customer',
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'phone' => '081298765432',
                'email_verified_at' => now(),
            ]
        );
    }
}
