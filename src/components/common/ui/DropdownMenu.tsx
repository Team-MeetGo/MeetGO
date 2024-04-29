'use client';
import React, { ReactNode, useEffect, useState, useRef } from 'react';

interface DropdownMenuProps {
  isOpen: boolean;
  children: ReactNode;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, children, buttonRef }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      // isOpen 상태일 때만 위치 조정
      const { bottom, left } = buttonRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const buttonLeftPosition = screenWidth - left; // 화면의 오른쪽 끝에서 버튼의 왼쪽까지의 거리

      dropdownRef.current.style.top = `${bottom}px`; // 트리거 버튼 아래로 위치를 조정
      dropdownRef.current.style.left = `${buttonLeftPosition}px`; // 트리거 버튼의 왼쪽 정렬을 유지
      dropdownRef.current.style.right = `auto`; // right 스타일을 덮어씌워서 기본값으로 설정
    }
  }, [isOpen]);

  return (
    <>
      {shouldRender && (
        <div
          ref={dropdownRef}
          className={`absolute bg-white z-20 shadow-lg p-2 transition-transform duration-300 origin-top flex flex-col items-start w-28 ${
            isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
          }`}
          style={{ transformOrigin: 'top right' }} // 오른쪽 위에서 왼쪽 아래로 펼쳐지는 애니메이션
        >
          {children}
        </div>
      )}
    </>
  );
};
