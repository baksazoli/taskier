<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Database\Seeders\TasksTableSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            ['name' => 'Alice Johnson', 'email' => 'alice@example.com'],
            ['name' => 'Bob Smith', 'email' => 'bob@example.com'],
            ['name' => 'Charlie Brown', 'email' => 'charlie@example.com'],
            ['name' => 'David White', 'email' => 'david@example.com'],
            ['name' => 'Emma Davis', 'email' => 'emma@example.com'],
            ['name' => 'Frank Wilson', 'email' => 'frank@example.com'],
            ['name' => 'Grace Hall', 'email' => 'grace@example.com'],
            ['name' => 'Henry Clark', 'email' => 'henry@example.com'],
            ['name' => 'Ivy Lewis', 'email' => 'ivy@example.com'],
            ['name' => 'Jack Walker', 'email' => 'jack@example.com'],
        ];

        foreach ($users as $userData) {
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->call([
            TasksTableSeeder::class
        ]);
    }
}
