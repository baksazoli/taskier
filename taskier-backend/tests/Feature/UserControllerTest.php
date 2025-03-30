<?php

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_retrieve_all_users()
    {
        $tasks = User::factory(3)->create();

        $response = $this->getJson(route('users.index'));

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }
}