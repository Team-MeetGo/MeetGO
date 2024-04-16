import React from 'react';
import { IoMdHeartEmpty } from 'react-icons/io';

type Props = {
  size?: string;
  className?: string;
};

const HeartIcon = ({ size = '1.1em', className }: Props) => {
  return (
    <div style={{ padding: 0, margin: 0 }}>
      <IoMdHeartEmpty className={className} size={size} style={{ color: '#000000' }} />
    </div>
  );
};

export default HeartIcon;
