import { AiFillHeart } from 'react-icons/ai';

type Props = {
  className?: string;
};

const HeartFillIcon = ({ className }: Props) => {
  return (
    <div>
      <AiFillHeart className={className || 'w-5 h-5'} style={{ color: 'red' }} />
    </div>
  );
};

export default HeartFillIcon;
