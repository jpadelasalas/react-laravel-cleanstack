<?php

/**
 * API Version: v1
 * 
 * Controller responsible for managing course records.
 * 
 * This controller handles all CRUD operations for courses and ensures 
 * consistent JSON API responses using standardized response helpers.
 */

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\CourseRequest;
use App\Http\Resources\CourseResource;
use App\Repositories\Interfaces\CourseRepositoryInterface;
use App\Traits\ApiResponseTrait;

class CourseController extends Controller
{
    /**
     * Include ApiResponseTrait for standardized API success and error responses.
     */
    use ApiResponseTrait;

    /**
     * Inject repository dependency.
     *
     * @param  \App\Repositories\Interfaces\CourseRepositoryInterface  $repo
     * @return void
     *
     * @note Ensure this interface is bound to its concrete repository implementation
     *       in a Service Provider (e.g., RepositoryServiceProvider).
     */
    public function __construct(protected CourseRepositoryInterface $repo) {}

    /**
     * Display a listing of all courses.
     *
     * Retrieves all student records from the repository layer and returns
     * them as a standardized JSON response using the StudentResource collection.
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * @example
     * GET /api/v1/courses
     *
     * @note Use a Service layer for complex business logic.
     *       For simple CRUD, direct Repository calls are acceptable.
     */
    public function index(): JsonResponse
    {
        try {
            // Fetch all courses through the repository layer
            $courses = $this->repo->getAll();

            // Transform the collection using the resource for consistent API formatting
            // Use ::collection if you have array of multiple items
            return $this->successResponse(CourseResource::collection($courses), 'Courses fetched successfully!');
        } catch (\Throwable $th) {
            // Throw an errorResponse if there's an error.
            return $this->errorResponse('Unable to fetch course', 500, $th->getMessage());
        }
    }

    /**
     * Store a newly created course in storage.
     *
     * Validates the request data and creates a new course record.
     * Returns the created course in a standardized JSON format.
     *
     * @param  \App\Http\Requests\CourseRequest  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @example
     * POST /api/v1/courses
     */
    public function store(CourseRequest $request): JsonResponse
    {
        try {
            // Create a course through the repository layer with request validation
            $course = $this->repo->create($request->validated());

            // Transform the collection using the resource for consistent API formatting
            // Use ::collection if you have array of multiple items
            return $this->successResponse(new CourseResource($course), 'Course added successfully!');
        } catch (\Throwable $th) {
            // Throw an errorResponse if there's an error.
            return $this->errorResponse('Unable to add course', 500, $th->getMessage());
        }
    }

    /**
     * Update the specified course in storage.
     *
     * Validates the request data and updates the existing course record.
     * Returns the created course in a standardized JSON format.
     *
     * @param  \App\Http\Requests\CourseRequest  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @example
     * PUT /api/v1/students/{id}
     */
    public function update(CourseRequest $request, string $id)
    {
        try {
            // Update a course through the repository layer with request validation
            $course = $this->repo->update($id, $request->validated());

            // Transform the collection using the resource for consistent API formatting
            // Use ::collection if you have array of multiple items
            return $this->successResponse(new CourseResource($course), 'Course updated successfully!');
        } catch (\Throwable $th) {
            // Throw an errorResponse if there's an error.
            return $this->errorResponse('Unable to update course', 500, $th->getMessage());
        }
    }

    /**
     * Remove the specified course from storage.
     *
     * Deletes a course record by ID and returns a success message.
     * No resource data is returned for deletion.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @example
     * DELETE /api/v1/courses/{id}
     */
    public function destroy(string $id)
    {
        try {
            // Delete a course through the repository layer with request validation
            $this->repo->delete($id);

            // Return a successResponse if deleted successfully
            return $this->successResponse(
                $id,
                'Course deleted successfully!'
            );
        } catch (\Throwable $th) {
            // Throw an errorResponse if there's an error.
            return $this->errorResponse(
                'Unable to delete course',
                500,
                $th->getMessage()
            );
        }
    }
}
