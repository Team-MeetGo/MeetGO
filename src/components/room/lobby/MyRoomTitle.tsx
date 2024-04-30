import MeetingRoomForm from '@/components/room/MeetingRoomForm';
import RefreshButton from '@/components/room/lobby/RefreshButton';

function MyRoomsTitle({ children }: { children: React.ReactNode }) {
  return (
    <article className="lg:w-[1000px] w-[22rem] flex flex-col items-center justify-content align-middle">
      <section className="border-b border-gray2 ">
        <div className="flex flex-row items-center justify-content lg:w-full justify-between pb-[24px] w-[22rem]">
          <p className="lg:text-[25px] text-[1rem] font-semibold">참여 중</p>
          <div className="flex flex-row items-center justify-content gap-4">
            <RefreshButton />
            <MeetingRoomForm />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <section className="lg:w-[1000px] w-[22rem] flex lg:flex-row flex-col items-center justify-center">
            {children}
          </section>
        </div>
      </section>
    </article>
  );
}

export default MyRoomsTitle;
