<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
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
        $id = $this->route('id') ?? $this->route('course');

        return [
            'code' => 'required|string|unique:courses,code,' . $id, // unique:table,column,ignore,idColumn
            'name' => 'required|string|unique:courses,name,' . $id, // unique:table,column,ignore,idColumn
            'description' => 'required|string',
            'units' => 'required|numeric|min:0',
        ];
    }
}