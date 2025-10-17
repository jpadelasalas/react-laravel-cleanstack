<?php

/**
 * Version controlling of API
 */

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\CourseRequest;
use App\Http\Resources\CourseResource;
use App\Services\CourseService;

class CourseController extends Controller
{
    public function __construct(protected CourseService $course) {}
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        // Fetch all courses through the service layer
        $courses = $this->course->getAllCourses();

        return response()->json([
            'status' => 'success',
            'message' => 'Courses fetched successfully',
            'data' => CourseResource::collection($courses), // use ::collection if you have array of multiple items instead of manually looping
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CourseRequest $request)
    {
        //
        $create = $this->course->createCourse($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Course Added Successfully!',
            'data' => (new CourseResource($create)) // direct it in resource if you have array of single item
        ]);
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
    public function update(CourseRequest $request, string $id)
    {
        //
        $update = $this->course->updateCourse($id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Course Updated Successfully!',
            'data' => (new CourseResource($update)) // direct it in resource if you have array of single item
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $this->course->deleteCourse($id);

        return response()->json([
            'success' => true,
            'message' => 'Course Deleted Successfully!',
        ]);
    }
}