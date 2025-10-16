<?php

namespace App\Repositories\Interfaces;

interface StudentRepositoryInterface
{
    public function getAll();
    public function getAllWithCourses();
    public function findById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function updateOrCreate(array $columnCondition, array $data);
    public function delete($id);

    // Relationships
    public function enrollInCourses($studentId, array $courseIds);
    public function removeFromCourses($studentId, array $courseIds);
    public function syncCourses($studentId, array $courseIds);
    public function getCourses($studentId);
}
