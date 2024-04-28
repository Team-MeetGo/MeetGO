'use client';
import { ReactNode, useEffect, useState } from 'react';

interface DrawerMenuProps {
  isOpen: boolean;
  children: ReactNode;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({ isOpen, children }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      {shouldRender && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 min-h-screen transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onTransitionEnd={() => !isOpen && setShouldRender(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 w-[250px] min-h-screen bg-white z-50 shadow-lg p-4 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {children}
      </div>
    </>
  );
};
