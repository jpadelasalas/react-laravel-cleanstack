import Swal from "sweetalert2";

export const alert = {
  loading: (title = "Loading...", text = "Please wait") =>
    Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    }),

  success: (title = "Success", text = "") =>
    Swal.fire({
      icon: "success",
      title,
      text,
      timer: 1500,
      showConfirmButton: false,
    }),

  error: (title = "Error", text = "") =>
    Swal.fire({
      icon: "error",
      title,
      text,
    }),
};
