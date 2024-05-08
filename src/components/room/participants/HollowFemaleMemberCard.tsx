import Image from 'next/image';
import MeetGoLogoPurple from '@/utils/icons/meetgo-logo-purple.png';

function HollowFemaleMemberCard({ array }: { array: number[] }) {
  return (
    <>
      {array.map((h) => (
        <article
          key={h}
          className={`border-purpleThird border-[2px] flex justify-center lg:w-[490px] max-sm:w-[20rem] lg:h-[166px] max-sm:h-[8rem] rounded-2xl`}
        >
          <Image
            className="w-[86px] h-[68px] object-center flex justify-center my-auto"
            src={MeetGoLogoPurple}
            alt="참여하지 않은 인원"
            height={80}
            width={80}
            sizes="86px"
          />
        </article>
      ))}
    </>
  );
}

export default HollowFemaleMemberCard;
