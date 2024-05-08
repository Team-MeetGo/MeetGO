import MeetingRoomForm from '@/components/room/lobby/MeetingRoomForm';
import RefreshButton from '@/components/room/lobby/RefreshButton';

function MyRoomsTitle({ children }: { children: React.ReactNode }) {
  return (
    <article className="max-w-[1280px] w-full flex flex-col items-center justify-content align-middle px-[24px]">
      <section className="pt-[1rem] border-gray2 w-full">
        <div className="flex flex-row items-center justify-content lg:w-full justify-between pb-[24px]">
          <p className="lg:text-xl font-semibold">참여중인 미팅룸</p>
          <section className="flex flex-row items-center justify-content gap-4">
            <RefreshButton />
            <MeetingRoomForm />
          </section>
        </div>
        <div className="flex flex-col justify-center">
          <section className="flex lg:flex-row flex-col items-center justify-center">{children}</section>
        </div>
      </section>
    </article>
  );
}

export default MyRoomsTitle;
