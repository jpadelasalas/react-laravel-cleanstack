<?php

use App\Http\Controllers\Api\V1\StudentController;
use App\Http\Controllers\Api\V1\CourseController;
use App\Http\Controllers\Api\V1\CourseWithStudentController;
use App\Http\Controllers\Api\V1\StudentWithCourseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->group(function () {
    Route::apiResource('students', StudentController::class);
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('student-with-course', StudentWithCourseController::class);
    Route::apiResource('course-with-student', CourseWithStudentController::class);

    Route::delete(
        'student-with-course/{studentId}/{courseId}',
        [StudentWithCourseController::class, 'destroy']
    );
    Route::delete(
        'course-with-student/{courseId}/{studentId}',
        [CourseWithStudentController::class, 'destroy']
    );
});