import { ReactNode } from 'react';

interface DropdownProps {
  children: ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({ children }) => {
  return <div>{children}</div>;
};
