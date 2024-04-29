import MemberNumberSelection from '@/components/room/MemberNumberSelection';
import RegionSelection from '@/components/room/RegionSelection';

function OtherRoomsTitle({ children }: { children: React.ReactNode }) {
  return (
    <article className="lg:pt-[40px] pt-[2rem]">
      <div className="flex flex-col justify-start lg:max-w-[1000px] max-sm:w-[22rem]">
        <p className="lg:text-[40px] text-[1.8rem] font-semibold">모집 중</p>
        <div className="flex flex-row gap-x-[16px] lg:mt-[24px] mt-[1rem] w-1/4">
          <RegionSelection text={'selectRegion'} />
          <MemberNumberSelection text={'selectMember'} />
        </div>
      </div>
      {children}
    </article>
  );
}

export default OtherRoomsTitle;
