'use client';
import MemberNumberSelection from '@/components/room/MemberNumberSelection';
import RegionSelection from '@/components/room/RegionSelection';
import { usePathname } from 'next/navigation';

function OtherRoomsTitle({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <article className="lg:pt-[40px] pt-[2rem]">
      <header className="flex flex-col justify-start lg:max-w-[1000px] max-sm:w-[22rem]">
        <section className="flex flex-row justify-start gap-[16px]">
          <p className="lg:text-[25px] text-[1rem] font-semibold">모집 중</p>
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
