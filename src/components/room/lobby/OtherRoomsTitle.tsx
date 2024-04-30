'use client';
import MemberNumberSelection from '@/components/room/MemberNumberSelection';
import RegionSelection from '@/components/room/RegionSelection';

function OtherRoomsTitle({ children }: { children: React.ReactNode }) {
  return (
    <article className="lg:w-[1280px] w-[22rem] flex flex-col items-center justify-content align-middle px-[24px]">
      <header className="pt-6 border-gray2 w-full">
        <section className="flex flex-row justify-start gap-[16px]">
          <p className="lg:text-xl text-[1rem] font-semibold">모집중</p>
        </section>
        <section>
          <div className="flex flex-row gap-x-[16px] lg:mt-[24px] mt-[1rem] w-1/4">
            <RegionSelection text={'selectRegion'} />
            <MemberNumberSelection text={'selectMember'} />
          </div>
        </section>
      </header>
      {children}
    </article>
  );
}

export default OtherRoomsTitle;
