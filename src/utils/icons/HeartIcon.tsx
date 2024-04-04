import React from 'react';
import { AiOutlineHeart } from 'react-icons/ai';

type Props = {
  className?: string;
};

const HeartIcon = ({ className }: Props) => {
  return (
    <div>
      <AiOutlineHeart className={`${className}`} style={{ color: '#F31236' }} />
    </div>
  );
};

export default HeartIcon;
