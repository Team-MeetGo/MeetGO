import { ReactNode } from 'react';

interface DropdownMenuProps {
  isOpen: boolean;
  children: ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, children }) => {
  const menuAnimation = isOpen ? 'translate-x-0' : '-translate-x-full';
  const bgAnimation = isOpen ? 'opacity-100' : 'opacity-0';
  const bgVisibility = isOpen ? 'visibility-visible' : 'visibility-hidden';

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${bgAnimation} ${bgVisibility}`}
        style={{
          visibility: isOpen ? 'visible' : 'hidden',
          transitionDelay: isOpen ? '0s' : '300ms'
        }}
      />
      <div
        className={`fixed top-0 left-0 w-[250px] h-full bg-white z-50 shadow-lg p-4 transition-transform duration-300 ${menuAnimation}`}
        style={{
          visibility: isOpen ? 'visible' : 'hidden',
          transitionDelay: isOpen ? '0s' : '300ms'
        }}
      >
        {children}
      </div>
    </>
  );
};
