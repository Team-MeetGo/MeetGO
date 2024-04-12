import { useRouter } from 'next/navigation';
import { ButtonHTMLAttributes } from 'react';

interface RouteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  to: string;
}

const RouteButton: React.FC<RouteButtonProps> = ({ to, children, ...props }) => {
  const router = useRouter();
  const handleClickButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(to);
  };

  return (
    <button {...props} onClick={handleClickButton}>
      {children}
    </button>
  );
};

export default RouteButton;
