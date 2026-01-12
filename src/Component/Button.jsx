import React from "react";

const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
}) => {
  const baseStyles =
    "px-5 py-2.5 rounded-lg font-medium transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-blue-500/30 hover:shadow-blue-500/50",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 focus:ring-gray-200",
    danger:
      "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-red-500/30 hover:shadow-red-500/50",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 shadow-none",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${
        variants[variant] || variants.primary
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
