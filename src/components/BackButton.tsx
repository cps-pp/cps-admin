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
      className={`text-md inline-flex items-center justify-center rounded bg-slate-500 px-4 py-2 text-white hover:bg-opacity-90 ${className}`}
    >
      ກັບຄືນ
    </button>
  );
};

export default BackButton;
