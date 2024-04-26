interface ButtonProps {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className = '' }) => {
  return <button className={`px-[16px] py-[8px] font-semibold text-base rounded-lg ${className}`}>{children}</button>;
};

export default Button;
