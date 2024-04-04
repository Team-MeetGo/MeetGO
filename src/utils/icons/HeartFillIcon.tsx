import { AiFillHeart } from 'react-icons/ai';

type Props = {
  className?: string;
};

const HeartFillIcon = ({ className }: Props) => {
  return (
    <div>
      <AiFillHeart className={`text-red-500 ${className}`} style={{ color: '#F31236' }} />
    </div>
  );
};

export default HeartFillIcon;
