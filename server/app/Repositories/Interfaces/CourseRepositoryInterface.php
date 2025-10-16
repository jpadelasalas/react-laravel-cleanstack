<?php

namespace App\Repositories\Interfaces;

interface CourseRepositoryInterface
{
    public function getAll();
    public function findById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function updateOrCreate(array $columnCondition, array $data);
    public function delete($id);

    // Relationships
    public function getStudents($courseId);
}
