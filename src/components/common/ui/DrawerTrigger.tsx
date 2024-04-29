import React, { ReactElement } from 'react';

interface DrawerTriggerProps {
  children: ReactElement;
  onToggle: () => void;
}

export const DrawerTrigger: React.FC<DrawerTriggerProps> = ({ children, onToggle }) => {
  return React.cloneElement(children, {
    onClick: onToggle
  });
};
