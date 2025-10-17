<?php

/**
 * Version controlling of API
 */

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentRequest;
use App\Http\Resources\StudentResource;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;

class StudentController extends Controller
{
    /**
     * Inject the StudentService dependency.
     *
     * This constructor enables the controller to access 
     * business logic methods defined in the StudentService class.
     */
    public function __construct(protected StudentService $studentService) {}

    /**
     * Display a listing of all students.
     *
     * This method retrieves all students from the database
     * via the StudentService and returns them as a standardized
     * JSON response using the StudentResource.
     */
    public function index(): JsonResponse
    {
        // Fetch all students through the service layer
        $students = $this->studentService->getAllStudents();

        // Transform the collection using the resource for consistent API formatting
        return response()->json([
            'status' => 'success',
            'message' => 'Students fetched successfully',
            'data' => StudentResource::collection($students), // use ::collection if you have array of multiple items
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StudentRequest $request)
    {
        // Create a student through the service layer with request validation
        $this->studentService->createStudent($request->validated());

        // Transform the collection using the resource for consistent API formatting
        return response()->json([
            'status' => 'success',
            'message' => 'Students added successfully',
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StudentRequest $request, string $id)
    {
        // Update a student through the service layer with request validation
        $this->studentService->updateStudent($id, $request->validated());

        // Transform the collection using the resource for consistent API formatting
        return response()->json([
            'status' => 'success',
            'message' => 'Students updated successfully',
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Update a student through the service layer with request validation
        $this->studentService->deleteStudent($id);

        // Transform the collection using the resource for consistent API formatting
        return response()->json([
            'status' => 'success',
            'message' => 'Students deleted successfully',
        ], 200);
    }
}
