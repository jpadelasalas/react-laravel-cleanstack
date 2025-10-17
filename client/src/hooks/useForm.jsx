/**
 * useForm.js
 *
 * A custom React hook for managing form state, validation, and submission.
 *
 * Features:
 * - Tracks input values
 * - Runs custom validation
 * - Supports form reset and merging
 * - Provides handleSubmit wrapper for form submission
 *
 * @param {object} initialValues - The default values of the form fields.
 * @param {function} validate - A validation function that returns an object of errors.
 * @returns {object} - Form utilities (values, handlers, errors, etc.)
 */

import { useCallback, useReducer, useState } from "react";

// Reducer handles all form state mutations
const funcDispatch = (state, action) => {
  switch (action.type) {
    case "ADD_INPUT": // update one field
      return {
        ...state,
        [action.name]: action.value,
      };
    case "RESET_FORM": // reset to initial values
      return action.payload;
    case "MERGE_FORM": // merge partial data (useful for editing existing data)
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

/**
 * Custom form management hook.
 */
const useForm = (initialValues, validate) => {
  // State to hold form values
  const [values, dispatch] = useReducer(funcDispatch, initialValues);

  // State to hold validation errors
  const [isError, setIsError] = useState({});

  /**
   * Runs the validation function if provided.
   * @param {object} vals - Current form values.
   * @returns {object} - Validation errors.
   */
  const validateForm = useCallback(
    (vals) => (validate ? validate(vals) : {}),
    [validate]
  );

  /**
   * Handles input field change event.
   * @param {Event} e - Input change event.
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ type: "ADD_INPUT", name, value });
  }, []);

  /**
   * Dispatches new form values (useful when editing existing data).
   * @param {object} vals - New values to set.
   */
  const dispatchForm = useCallback((vals) => {
    dispatch({ type: "RESET_FORM", payload: vals });
    setIsError({});
  }, []);

  /**
   * Resets the form back to initial values.
   */
  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM", payload: initialValues });
    setIsError({});
  }, [initialValues]);

  /**
   * Merges new values into the form (without clearing existing ones).
   * @param {object} vals - Partial form data to merge.
   */
  const mergeForm = useCallback((vals) => {
    dispatch({ type: "MERGE_FORM", payload: vals });
    setIsError({});
  }, []);

  /**
   * Handles form submission with validation.
   * @param {function} callback - Function to call when form is valid.
   * @returns {function} - Form submit handler.
   */
  const handleSubmit = useCallback(
    (callback) => (e) => {
      e.preventDefault();
      const errors = validateForm(values);
      setIsError(errors);

      if (Object.keys(errors).length === 0) {
        callback(values);
        setIsError({});
      }
    },
    [validateForm, values]
  );

  return {
    values, // Current form values
    dispatch, // Dispatch function (for advanced control)
    handleChange, // Input change handler
    isError, // Validation error object
    handleSubmit, // Submit handler with validation
    dispatchForm, // Replace all values
    mergeForm, // Merge partial values
    resetForm, // Reset form to defaults
  };
};

export default useForm;
