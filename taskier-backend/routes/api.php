<?php

use Illuminate\Http\Request;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

// List all users
Route::get('users', [UserController::class, 'index'])->name('users.index');

// List all tasks
Route::get('tasks', [TaskController::class, 'index'])->name('tasks.index');

// Create a new task
Route::post('tasks', [TaskController::class, 'store'])->name('task.store');

// Update a task by ID
Route::patch('tasks/{id}', [TaskController::class, 'update'])->name('tasks.update');

// Delete a task
Route::delete('tasks/{id}', [TaskController::class, 'destroy'])->name('tasks.destroy');

// Update multiple tasks (set 'completed_at' to current time)
Route::patch('tasks/bulk/complete', [TaskController::class, 'bulkComplete'])->name('tasks.bulkComplete');

// Delete multiple tasks
Route::delete('tasks/bulk/delete', [TaskController::class, 'bulkDelete'])->name('tasks.bulkDelete');
