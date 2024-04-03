import React from 'react';
import { AiOutlineHeart } from 'react-icons/ai';

type Props = {
  className?: string;
};

const HeartIcon = ({ className }: Props) => {
  return (
    <div>
      <AiOutlineHeart className={className || 'w-5 h-5'} style={{ color: 'red' }} />
    </div>
  );
};

export default HeartIcon;
