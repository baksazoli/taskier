<?php

namespace Tests\Unit\Controllers;

use App\Http\Controllers\TaskController;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Tests\TestCase;
use Illuminate\Validation\ValidationException;
use Illuminate\Foundation\Testing\RefreshDatabase;


class TaskControllerTest extends TestCase
{
    use RefreshDatabase;
    
   /** @test */
    public function task_can_be_soft_deleted()
    {
        $task = Task::factory()->create();
        $taskId = $task->id;

        $task->delete();
        
        $this->assertNotNull(Task::withTrashed()->find($taskId)->deleted_at);
    }

    /** @test */
    public function it_creates_a_task_using_the_controller_method()
    {
        User::factory()->create();

        $controller = new \App\Http\Controllers\TaskController();

        $request = new \Illuminate\Http\Request([
            'description' => 'Test Task',
            'user_id' => 1,
            'estimated_time' => 30,
            'used_time' => 15
        ]);

        $response = $controller->store($request);

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertDatabaseHas('tasks', ['description' => 'Test Task']);
    }

    /** @test */
    public function it_marks_multiple_tasks_as_completed()
    {
        $tasks = Task::factory()->count(3)->create();
        $taskIds = $tasks->pluck('id')->toArray();

        $controller = new \App\Http\Controllers\TaskController();
        $controller->bulkComplete(new \Illuminate\Http\Request(['ids' => $taskIds]));

        foreach ($taskIds as $id) {
            $task = Task::find($id);
            $this->assertNotNull($task->completed_at);
        }
    }

    /** @test */
    public function it_soft_deletes_multiple_tasks()
    {
        $tasks = Task::factory()->count(3)->create();
        $taskIds = $tasks->pluck('id')->toArray();
        
        $controller = new \App\Http\Controllers\TaskController();

        $responseBeforeDeletion = $controller->index(new \Illuminate\Http\Request());
        $tasksBeforeDeletion = json_decode($responseBeforeDeletion->getContent(), true);
        
        $this->assertCount(3, $tasksBeforeDeletion);

        $controller->bulkDelete(new \Illuminate\Http\Request(['ids' => $taskIds]));

        foreach ($taskIds as $id) {
            $this->assertNotNull(Task::withTrashed()->find($id)->deleted_at);
        }

        $responseAfterDeletion = $controller->index(new \Illuminate\Http\Request());
        $tasksAfterDeletion = json_decode($responseAfterDeletion->getContent(), true);

        $this->assertCount(0, $tasksAfterDeletion);
    }
}