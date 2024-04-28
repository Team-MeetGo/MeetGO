interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', onClick }) => {
  return (
    <button className={`px-[16px] py-[8px] font-semibold text-base rounded-lg ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
