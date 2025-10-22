<?php

namespace App\Services;

use App\Repositories\Interfaces\StudentRepositoryInterface;

class StudentWithCourseService
{

    public function __construct(protected StudentRepositoryInterface $studentRepo) {}

    public function getStudentWithCourse(string $id)
    {
        return $this->studentRepo->getStudentWithCourses($id);
    }
}