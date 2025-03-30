<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="users",
 *     description="User Management API"
 * )
 */
class UserController extends Controller
{
    /**
     * Retrieve all users.
     *
     * @OA\Get(
     *     path="/api/users",
     *     tags={"users"},
     *     summary="Get a list of users",
     *     description="Returns a list of all users in the system.",
     *     operationId="getUsers",
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="John Doe"),
     *                 @OA\Property(property="email", type="string", example="johndoe@example.com"),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2025-03-30T12:34:56Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2025-03-30T12:34:56Z")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal Server Error"
     *     )
     * )
     */
    public function index()
    {
        try {
            $users = User::all();
            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Internal Server Error',
                'message' => 'An unexpected error occurred'
            ], 500);
        }
    }
}
