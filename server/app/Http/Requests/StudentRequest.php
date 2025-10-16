<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('id') ?? $this->route('student');
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email,' . $id,
            'birthdate' => 'required|date',
            'address' => 'required|string|max:255',
        ];
    }
}
