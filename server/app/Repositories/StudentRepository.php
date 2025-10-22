<?php

namespace App\Repositories;

use App\Models\Course;
use App\Models\Student;
use App\Repositories\Interfaces\StudentRepositoryInterface;
use Illuminate\Support\Carbon;

class StudentRepository implements StudentRepositoryInterface
{
    public function getAll()
    {
        return Student::all();
    }


    public function findById($id)
    {
        return Student::with('courses')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Student::create($data);
    }

    public function update($id, array $data)
    {
        $student = Student::findOrFail($id);
        $student->update($data);
        return $student;
    }

    public function updateOrCreate(array $columnCondition, array $data)
    {
        return Student::updateOrCreate(
            $columnCondition,
            $data
        );
    }

    public function delete($id)
    {
        $student = Student::findOrFail($id);
        return $student->delete();
    }

    // Relationship Logic
    public function enrollInCourses($studentId, array $courseIds)
    {
        $student = Student::findOrFail($studentId);
        $enrollData = [];

        foreach ($courseIds as $courseId) {
            $enrollData[$courseId] = ['enrolled_at' => Carbon::now()];
        }

        $student->courses()->attach($enrollData);
        return $student->load('courses');
    }

    public function removeFromCourses($studentId, $courseIds)
    {
        $student = Student::findOrFail($studentId);
        $student->courses()->detach($courseIds);
        return $student->load('courses');
    }

    public function syncCourses($studentId, array $courseIds)
    {
        $student = Student::findOrFail($studentId);
        $syncData = [];

        foreach ($courseIds as $courseId) {
            $syncData[$courseId] = ['enrolled_at' => Carbon::now()];
        }

        $student->courses()->sync($syncData);
        return $student->load('courses');
    }

    public function getCourses($studentId)
    {
        return Student::findOrFail($studentId)->courses;
    }

    public function getStudentWithCourses($id)
    {
        // Use plural if it is belongsToMany, singular if belongsTo based on the relationship
        return Student::with('courses')->findOrFail($id);
    }

    public function getUnenrolledCourses($id)
    {
        $student = Student::findOrFail($id);

        return Course::whereNotIn('id', $student->courses->pluck('id'))->get();
    }
}
