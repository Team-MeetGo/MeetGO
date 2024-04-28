import Link from 'next/link';

interface LinkProps {
  children: React.ReactNode;
  className?: string;
  href: string;
}

export const StyleLink: React.FC<LinkProps> = ({ children, className = '', href }) => {
  return (
    <Link className={`px-[16px] py-[8px] font-semibold text-base rounded-lg ${className}`} href={href}>
      {children}
    </Link>
  );
};
