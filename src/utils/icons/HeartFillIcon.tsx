import { IoMdHeart } from 'react-icons/io';

type Props = {
  size?: string;
  className?: string;
};

const HeartFillIcon = ({ size = '1.1em', className }: Props) => {
  return (
    <div>
      <IoMdHeart className={className} size={size} style={{ color: '#F31236' }} />
    </div>
  );
};

export default HeartFillIcon;
