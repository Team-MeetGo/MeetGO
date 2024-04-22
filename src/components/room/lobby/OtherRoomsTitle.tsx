import MemberNumberSelection from '@/components/room/MemberNumberSelection';
import RegionSelection from '@/components/room/RegionSelection';

function OtherRoomsTitle({ children }: { children: React.ReactNode }) {
  return (
    <article className="pt-[40px]">
      <div className="flex flex-col justify-start max-w-[1000px]">
        <p className="text-[40px]	font-semibold">모집 중</p>
        <div className="flex flex-row gap-x-[16px] mt-[24px] w-1/4">
          <RegionSelection text={'selectRegion'} />
          <MemberNumberSelection text={'selectMember'} />
        </div>
      </div>
      {children}
    </article>
  );
}

export default OtherRoomsTitle;
