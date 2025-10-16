<?php

namespace App\Repositories;

use App\Models\Course;
use App\Repositories\Interfaces\CourseRepositoryInterface;

class CourseRepository implements CourseRepositoryInterface
{
    public function getAll()
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
}
