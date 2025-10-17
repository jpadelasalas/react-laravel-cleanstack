<?php

namespace App\Services;

use App\Repositories\Interfaces\CourseRepositoryInterface;

class CourseService
{
    /**
     * Inject the repository interface dependency.
     * Make sure it is binded with StudentReposity in Service Provider.
     */
    public function __construct(protected CourseRepositoryInterface $repo) {}

    /**
     * Retrieve all student records.
     *
     * Acts as a business logic layer between the controller and repository.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCourses()
    {
        return $this->repo->getAll();
    }

    public function createCourse(array $data)
    {
        return $this->repo->create($data);
    }

    public function updateCourse($id, array $data)
    {
        return $this->repo->update($id, $data);
    }

    public function deleteCourse($id)
    {
        return $this->repo->delete($id);
    }
}