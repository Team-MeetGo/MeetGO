import Image from 'next/image';
import MeetGoLogoPurple from '@/utils/icons/meetgo-logo-purple.png';

function HollowMaleMemberCard({ array }: { array: number[] }) {
  return (
    <>
      {array.map((h) => (
        <article key={h} className={`bg-purpleSecondary flex justify-center w-[506px] h-[166px] rounded-2xl`}>
          <Image
            className="w-[86px] h-[68px] object-center flex justify-center my-auto"
            sizes="86px"
            src={MeetGoLogoPurple}
            alt="참여하지 않은 인원"
          />
        </article>
      ))}
    </>
  );
}

export default HollowMaleMemberCard;
