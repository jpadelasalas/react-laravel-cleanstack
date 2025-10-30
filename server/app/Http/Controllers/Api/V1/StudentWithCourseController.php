<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\EnrollRequest;
use App\Http\Resources\CourseResource;
use App\Http\Resources\StudentResource;
use App\Http\Resources\StudentWithCourseResource;
use App\Repositories\Interfaces\StudentRepositoryInterface;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentWithCourseController extends Controller
{
    /**
     * Include ApiResponseTrait for standardized API success and error responses.
     */
    use ApiResponseTrait;

    /**
     * Inject repository dependency.
     *
     * @param  \App\Repositories\Interfaces\StudentRepositoryInterface  $repo
     * @return void
     *
     * @note Ensure this interface is bound to its concrete repository implementation
     *       in a Service Provider (e.g., RepositoryServiceProvider).
     */
    public function __construct(protected StudentRepositoryInterface $studentRepo) {}

    /**
     * Display a listing of all students.
     *
     * Retrieves all student records from the repository layer and returns
     * them as a standardized JSON response using the StudentResource collection.
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * @example
     * GET /api/v1/student-with-course
     *
     * @note Use a Service layer for complex business logic.
     *       For simple CRUD, direct Repository calls are acceptable.
     */
    public function index(): JsonResponse
    {
        try {
            $students = $this->studentRepo->getAll();

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
     * Enroll a student on course/s.
     *
     * @param  \App\Http\Requests\StudentRequest  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @example
     * POST /api/v1/student-with-course/{selectedStudentId}/{courseId}
     */
    public function store(EnrollRequest $request)
    {
        //
        try {
            //code...
            $validated = $request->validated();
            $data = $this->studentRepo->enrollInCourses($validated['selectedStudentId'], $validated['course']);

            return $this->successResponse(new StudentWithCourseResource($data), 'Student Enrolled Successfully!');
        } catch (\Throwable $th) {
            //throw $th;
            return $this->errorResponse(
                'Unable to enroll student',
                500,
                $th->getMessage()
            );
        }
    }

    /**
     * Display the specified student with course.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     *
     * @example
     * GET /api/v1/student-with-course/{id}
     */
    public function show(string $id): JsonResponse
    {
        try {
            $data = $this->studentRepo->getStudentWithCourses($id);
            $course = $this->studentRepo->getUnenrolledCourses($id);

            return $this->successResponse(
                [
                    'student' => new StudentWithCourseResource($data),
                    'course' => CourseResource::collection($course)
                ],
                'Data fetched successfully!'
            );
        } catch (\Throwable $th) {
            return $this->errorResponse(
                'Unable to fetch data',
                500,
                $th->getMessage()
            );
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove a course enrollment for a specific student.
     *
     * @param  string  $studentId
     * @param  string|array  $courseId
     * @return \Illuminate\Http\JsonResponse
     *
     * @example
     * DELETE /api/v1/student-with-course/{selectedStudentId}/{courseId}
     */
    public function destroy(string $studentId, $courseId): JsonResponse
    {
        //
        try {
            //code...
            $this->studentRepo->removeFromCourses($studentId, $courseId);

            return $this->successResponse($courseId, 'Student Unenrolled Successfully!');
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
