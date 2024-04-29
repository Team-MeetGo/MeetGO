import MeetingRoomForm from '@/components/room/MeetingRoomForm';
import RefreshButoon from '@/components/room/lobby/RefreshButton';

function MyRoomsTitle({ children }: { children: React.ReactNode }) {
  return (
    <article className="lg:w-[1112px] w-[22rem] flex flex-col items-center justify-content align-middle">
      <section className="lg:pt-[64px] pt-[2rem] border-b border-gray2 ">
        <div className="flex flex-row lg:w-full justify-between lg:pb-[24px] w-[22rem]">
          <p className="lg:text-[40px] text-[1.8rem] font-semibold lg:ml-[56px]">참여 중</p>
          <div className="flex flex-row align-middle justify-center gap-4 lg:mr-[56px]">
            <RefreshButoon />
            <MeetingRoomForm />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <section className="lg:w-[1112px] w-[22rem] flex lg:flex-row flex-col items-center justify-center lg:mb-[40px] mb-[2rem]">
            {children}
          </section>
        </div>
      </section>
    </article>
  );
}

export default MyRoomsTitle;
