import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const ModalComponent = React.memo(
  ({ title, modalSize = "md", handleCloseModal, children, footer }) => {
    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 dark:bg-white/30 text-black">
        <div
          className={`bg-white rounded-lg shadow-lg w-11/12 ${
            sizeClasses[modalSize] || "max-w-md"
          } text-sm md:text-md`}
        >
          <header className="text-sm md:text-md lg:text-xl bg-blue-100 dark:bg-gray-800 text-black dark:text-white flex justify-between p-4 rounded-t-lg">
            <span className="font-semibold">{title}</span>
            <CloseIcon
              onClick={handleCloseModal}
              className="cursor-pointer hover:text-red-500 transition"
            />
          </header>
          {children}
          {footer}
        </div>
      </div>
    );
  }
);

export default ModalComponent;
