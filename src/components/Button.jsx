
const ButtonBox = ({ variant, icon, children, className, ...props }) => {
  const getButtonClasses = () => {
    switch (variant) {
      case "add":
        return "text-primary border  hover:bg-primary hover:text-white";
      case "delete":
        return "text-meta-1 border border-meta-1 hover:bg-meta-1 hover:text-white";
      case "save":
        return "bg-green-600 text-white  hover:bg-green-700 active:bg-green-800";
      case "cancel":
        return "bg-red-600 text-white  hover:bg-red-700 active:bg-red-800";
      default:
        return "text-white  hover:bg-gray-200";
    }
  };

  return (
    <button
      className={`flex items-center gap-2 px-6 py-2 rounded transition duration-200 text-md  ${getButtonClasses()} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default ButtonBox;
