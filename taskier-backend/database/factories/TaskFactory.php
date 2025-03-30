<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition()
    {
        return [
            'description' => $this->faker->sentence(),
            'user_id' => User::factory(),
            'estimated_time' => $this->faker->numberBetween(30, 120),
            'used_time' => $this->faker->numberBetween(0, 120),
            'completed_at' => $this->faker->dateTimeThisYear(),
        ];
    }
}
