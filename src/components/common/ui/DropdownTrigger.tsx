import React, { ReactElement } from 'react';

interface DropdownTriggerProps {
  children: ReactElement;
  onToggle: () => void;
}

export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({ children, onToggle }) => {
  return React.cloneElement(children, {
    onClick: onToggle
  });
};
