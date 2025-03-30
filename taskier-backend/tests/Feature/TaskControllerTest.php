<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $tasks;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->tasks = Task::factory()->count(3)->create(['user_id' => $this->user->id]);
    }

    /** @test */
    public function it_can_retrieve_all_tasks()
    {
        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200)
            ->assertJsonCount(3)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'description',
                    'user_id',
                    'estimated_time',
                    'used_time',
                    'completed_at',
                    'created_at',
                    'updated_at',
                    'user' => [
                        'id',
                        'name'
                    ]
                ]
            ]);
    }

    /** @test */
    public function it_can_retrieve_all_tasks_except_the_deleted_ones()
    {
        $deletedTaskIds = $this->tasks->take(2)->pluck('id')->toArray();

        $this->deleteJson('/api/tasks/bulk/delete', ['ids' => $deletedTaskIds]);

        $response = $this->getJson('/api/tasks');

        $response->assertJsonCount(1);
        $response->assertJsonFragment(['id' => 3]);
    }

    /** @test */
    public function it_can_create_a_new_task()
    {
        $data = [
            'description' => 'New Task',
            'user_id' => $this->user->id,
            'estimated_time' => 60,
            'used_time' => 30
        ];

        $response = $this->postJson('/api/tasks', $data);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'description',
                'user_id',
                'estimated_time',
                'used_time',
                'created_at',
                'updated_at'
            ])
            ->assertJsonFragment(['description' => 'New Task']);

        $this->assertDatabaseHas('tasks', $data);
    }

    /** @test */
    public function it_requires_description_and_user_id_when_creating_task()
    {
        $response = $this->postJson('/api/tasks', []);

        $response->assertStatus(400)
            ->assertJsonValidationErrors(['description', 'user_id']);
    }

    /** @test */
    public function it_fails_to_create_task_with_invalid_user_id()
    {
        $response = $this->postJson('/api/tasks', [
            'description' => 'Invalid Task',
            'user_id' => 9999
        ]);

        $response->assertStatus(400)
            ->assertJsonValidationErrors(['user_id']);
    }

    /** @test */
    public function it_can_update_a_single_task()
    {
        $task = $this->tasks->first();
        $updateData = [
            'description' => 'Updated Task',
            'user_id' => $this->user->id,
            'estimated_time' => 120,
            'used_time' => 60
        ];

        $response = $this->patchJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Task updated successfully',
                'data' => [
                    'description' => 'Updated Task',
                    'estimated_time' => 120
                ]
            ]);

        $this->assertDatabaseHas('tasks', $updateData);
    }

    /** @test */
    public function it_can_bulk_complete_tasks()
    {
        $taskIds = $this->tasks->pluck('id')->toArray();

        $response = $this->patchJson('/api/tasks/bulk/complete', ['ids' => $taskIds]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Tasks updated successfully.']);

        foreach ($taskIds as $taskId) {
            $this->assertNotNull(Task::find($taskId)->completed_at);
        }
    }

    /** @test */
    public function it_fails_to_bulk_complete_with_invalid_task_ids()
    {
        $response = $this->patchJson('/api/tasks/bulk/complete', ['ids' => [9999]]);

        $response->assertStatus(400)
            ->assertJsonValidationErrors(['ids.0']);
    }

    /** @test */
    public function it_can_soft_delete_a_single_task()
    {
        $task = $this->tasks->first();

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Task deleted successfully.']);

        $this->assertSoftDeleted('tasks', ['id' => $task->id]);
    }

    /** @test */
    public function it_can_bulk_delete_tasks()
    {
        $taskIds = $this->tasks->pluck('id')->toArray();

        $response = $this->deleteJson('/api/tasks/bulk/delete', ['ids' => $taskIds]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Tasks deleted successfully.']);

        foreach ($taskIds as $taskId) {
            $this->assertSoftDeleted('tasks', ['id' => $taskId]);
        }
    }

    /** @test */
    public function it_fails_to_bulk_delete_with_invalid_task_ids()
    {
        $response = $this->deleteJson('/api/tasks/bulk/delete', ['ids' => [9999]]);

        $response->assertStatus(400)
            ->assertJsonValidationErrors(['ids.0']);
    }

    /** @test */
    public function it_returns_404_when_task_not_found()
    {
        $response = $this->patchJson('/api/tasks/9999', ['id' => 1, 'description' => 'Update API documentation', 'user_id' => 1]);
        $response->assertStatus(404);

        $response = $this->deleteJson('/api/tasks/9999');
        $response->assertStatus(404);
    }
}