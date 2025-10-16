<?php

namespace App\Services;

use App\Repositories\Interfaces\StudentRepositoryInterface;

class StudentService
{
    /**
     * Inject the repository interface dependency.
     * Make sure it is binded with StudentReposity in Service Provider.
     */
    public function __construct(protected StudentRepositoryInterface $repo) {}

    /**
     * Retrieve all student records.
     *
     * Acts as a business logic layer between the controller and repository.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllStudents()
    {
        return $this->repo->getAll();
    }

    public function createStudent(array $data)
    {
        return $this->repo->create($data);
    }

    public function updateStudent($id, array $data)
    {
        return $this->repo->update($id, $data);
    }

    public function deleteStudent($id)
    {
        return $this->repo->delete($id);
    }
}