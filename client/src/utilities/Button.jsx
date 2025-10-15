import React from "react";

const Button = React.memo(({ buttonName, onClick, className }) => {
  return (
    <button className={className} onClick={onClick}>
      {buttonName}
    </button>
  );
});

export default Button;
