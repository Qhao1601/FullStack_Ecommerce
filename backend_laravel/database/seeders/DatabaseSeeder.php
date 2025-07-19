<?php

namespace Database\Seeders;

use App\Models\Customer;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Customer::factory()->create([
            'name' => 'Nguyễn Quốc Hào Client',
            'email' => 'quochao16012k3client@gmail.com',
            'password' => 'password',
        ]);
    }
}
