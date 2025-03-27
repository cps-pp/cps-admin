import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ className, onClick }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick(); 
    } else {
      navigate(-1); 
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`text-md inline-flex items-center justify-center rounded bg-slate-500 px-2 py-2 text-white hover:bg-opacity-90 ${className}`}
    >
      <svg
        className="w-5 h-5 text-gray-800 dark:text-white "
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m15 19-7-7 7-7"
        />
      </svg>
    </button>
  );
};

export default BackButton;
