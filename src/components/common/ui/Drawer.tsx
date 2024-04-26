import { ReactNode } from 'react';

interface DrawerProps {
  children: ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ children }) => {
  return <div>{children}</div>;
};
