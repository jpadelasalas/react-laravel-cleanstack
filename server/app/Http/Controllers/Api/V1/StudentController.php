<?php

/**
 * API Version: v1
 * 
 * Controller responsible for managing student records.
 * 
 * This controller handles all CRUD operations for students and ensures 
 * consistent JSON API responses using standardized response helpers.
 */

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentRequest;
use App\Http\Resources\StudentResource;
use App\Repositories\Interfaces\StudentRepositoryInterface;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class StudentController extends Controller
{
    /**
     * Include ApiResponseTrait for standardized API success and error responses.
     */
    use ApiResponseTrait;

    /**
     * Student repository instance.
     *
     * @var \App\Repositories\Interfaces\StudentRepositoryInterface
     */
    protected StudentRepositoryInterface $repo;

    /**
     * Inject repository dependency.
     *
     * @param  \App\Repositories\Interfaces\StudentRepositoryInterface  $repo
     * @return void
     *
     * @note Ensure this interface is bound to its concrete repository implementation
     *       in a Service Provider (e.g., RepositoryServiceProvider).
     */
    public function __construct(StudentRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Display a listing of all students.
     *
     * Retrieves all student records from the repository layer and returns
     * them as a standardized JSON response using the StudentResource collection.
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * @example
     * GET /api/v1/students
     *
     * @note Use a Service layer for complex business logic.
     *       For simple CRUD, direct Repository calls are acceptable.
     */
    public function index(): JsonResponse
    {
        try {
            $students = $this->repo->getAll();

            return $this->successResponse(
                StudentResource::collection($students),
                'Students fetched successfully!'
            );
        } catch (\Throwable $th) {
            return $this->errorResponse(
                'Unable to fetch students',
                500,
                $th->getMessage()
            );
        }
    }

    /**
     * Store a newly created student in storage.
     *
     * Validates the request data and creates a new student record.
     * Returns the created student in a standardized JSON format.
     *
     * @param  \App\Http\Requests\StudentRequest  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @example
     * POST /api/v1/students
     */
    public function store(StudentRequest $request): JsonResponse
    {
        try {
            $student = $this->repo->create($request->validated());

            return $this->successResponse(
                new StudentResource($student),
                'Student added successfully!'
            );
        } catch (\Throwable $th) {
            return $this->errorResponse(
                'Unable to add student',
                500,
                $th->getMessage()
            );
        }
    }

    /**
     * Update the specified student in storage.
     *
     * Validates the incoming data and updates the existing student record.
     * Returns the updated student in standardized JSON format.
     *
     * @param  \App\Http\Requests\StudentRequest  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @example
     * PUT /api/v1/students/{id}
     */
    public function update(StudentRequest $request, string $id): JsonResponse
    {
        try {
            $student = $this->repo->update($id, $request->validated());

            return $this->successResponse(
                new StudentResource($student),
                'Student updated successfully!'
            );
        } catch (\Throwable $th) {
            return $this->errorResponse(
                'Unable to update student',
                500,
                $th->getMessage()
            );
        }
    }

    /**
     * Remove the specified student from storage.
     *
     * Deletes a student record by ID and returns a success message.
     * No resource data is returned for deletion.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @example
     * DELETE /api/v1/students/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            // Delete a course through the repository layer with request validation
            $this->repo->delete($id);

            // Return a successResponse if deleted successfully
            return $this->successResponse(
                null,
                'Student deleted successfully!'
            );
        } catch (\Throwable $th) {
            // Throw an errorResponse if there's an error.
            return $this->errorResponse(
                'Unable to delete student',
                500,
                $th->getMessage()
            );
        }
    }
}