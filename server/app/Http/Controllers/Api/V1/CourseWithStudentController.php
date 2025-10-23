<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\EnrollByCourseRequest;
use App\Http\Resources\CourseResource;
use App\Http\Resources\StudentResource;
use App\Repositories\Interfaces\CourseRepositoryInterface;
use App\Repositories\Interfaces\StudentRepositoryInterface;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseWithStudentController extends Controller
{
    use ApiResponseTrait;

    public function __construct(protected CourseRepositoryInterface $courseRepo) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        try {
            //code...
            $courses = $this->courseRepo->getAll();

            return $this->successResponse(CourseResource::collection($courses), 'Course Fetch Successfully!', 201);
        } catch (\Throwable $th) {
            //throw $th;
            return $this->errorResponse('Error Fetching Course', 402, $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        try {
            //code...
            $enrolled = $this->courseRepo->getStudents($id);
            $unenrolled = $this->courseRepo->getStudentsUnenrolled($id);

            return $this->successResponse([
                'enrolled' => StudentResource::collection($enrolled),
                'unenrolled' => StudentResource::collection($unenrolled),
            ], null, 201);
        } catch (\Throwable $th) {
            //throw $th;
            return $this->errorResponse('Error Fetching Enrolled Students!', 402, $th->getMessage());
        }
    }

    public function store(EnrollByCourseRequest $request)
    {
        //
        try {
            //code...
            $validated = $request->validated();
            $this->courseRepo->enrollStudent($validated['selectedCourseId'], $validated['student']);

            return $this->successResponse(null, 'Students Enrolled Successfully!', 201);
        } catch (\Throwable $th) {
            //throw $th;
            return $this->errorResponse('Unable to enroll student.', 402, $th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $courseId, $studentId): JsonResponse
    {
        //
        try {
            //code...
            $this->courseRepo->dropStudent($courseId, $studentId);

            return $this->successResponse(null, 'Student Unenrolled Successfully!');
        } catch (\Throwable $th) {
            //throw $th;
            return $this->errorResponse(
                'Unable to unenroll student',
                500,
                $th->getMessage()
            );
        }
    }
}