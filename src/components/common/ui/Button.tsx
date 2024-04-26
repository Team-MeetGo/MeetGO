interface ButtonProps {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className = '' }) => {
  return <button className={`px-[24px] py-[14px] font-bold text-base rounded-lg ${className}`}>{children}</button>;
};

export default Button;
