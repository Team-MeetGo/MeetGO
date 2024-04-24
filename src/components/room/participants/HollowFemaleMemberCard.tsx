import Image from 'next/image';
import MeetGoLogoPurple from '@/utils/icons/meetgo-logo-purple.png';

function HollowFemaleMemberCard({ array }: { array: number[] }) {
  return (
    <>
      {array.map((h) => (
        <article
          key={h}
          className={`border-purpleThird border-[2px] flex justify-center w-[506px] h-[166px] rounded-2xl`}
        >
          <Image
            className="w-[86px] h-[68px] object-center flex justify-center my-auto"
            src={MeetGoLogoPurple}
            alt="참여하지 않은 인원"
            height={80}
            width={80}
          />
        </article>
      ))}
    </>
  );
}

export default HollowFemaleMemberCard;
