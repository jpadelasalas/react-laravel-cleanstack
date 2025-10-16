<?php

namespace App\Repositories;

use App\Models\Student;
use App\Repositories\Interfaces\StudentRepositoryInterface;
use Illuminate\Support\Carbon;

class StudentRepository implements StudentRepositoryInterface
{
    public function getAll()
    {
        return Student::all();
    }

    public function getAllWithCourses()
    {
        return Student::with('courses')->get();
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
}