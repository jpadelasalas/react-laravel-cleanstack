<?php

namespace App\Repositories;

use App\Models\Course;
use App\Models\Student;
use App\Repositories\Interfaces\CourseRepositoryInterface;
use Carbon\Carbon;

class CourseRepository implements CourseRepositoryInterface
{

    public function getAll()
    {
        return Course::all();
    }

    public function getAllWithStudent()
    {
        return Course::with('students')->get();
    }

    public function findById($id)
    {
        return Course::with('students')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Course::create($data);
    }

    public function update($id, array $data)
    {
        $course = Course::findOrFail($id);
        $course->update($data);
        return $course;
    }

    public function updateOrCreate(array $columnCondition, array $data)
    {
        return Course::updateOrCreate(
            $columnCondition,
            $data
        );
    }
    public function delete($id)
    {
        $course = Course::findOrFail($id);
        return $course->delete();
    }

    public function getStudents($courseId)
    {
        return Course::findOrFail($courseId)->students;
    }

    public function getStudentsUnenrolled($courseId)
    {
        $course = Course::findOrFail($courseId);

        return Student::select(['id', 'name', 'email'])->whereNotIn('id', $course->students->pluck('id'))->get();
    }

    public function dropStudent($courseId, $studentId)
    {
        $course = Course::findOrFail($courseId);

        $course->students()->detach($studentId);
        return $course->load('students');
    }

    public function enrollStudent($courseId, $studentId)
    {
        $course = Course::findOrFail($courseId);
        $enrollData = [];

        foreach ($studentId as $id) {
            $enrollData[$id] = ['enrolled_at' => Carbon::now()];
        }

        $course->students()->attach($enrollData);
        return $course->load('students');
    }
}