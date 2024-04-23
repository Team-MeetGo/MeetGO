import MeetingRoomForm from '@/components/room/MeetingRoomForm';
import RefreshButoon from '@/components/room/lobby/RefreshButton';

function MyRoomsTitle({ children }: { children: React.ReactNode }) {
  return (
    <article className="w-[1112px] flex-col justify-center align-middle">
      <section className="mt-[64px] border-b border-gray2">
        <div className="flex flex-row w-full justify-between pb-[24px]">
          <p className="text-[40px] font-semibold ml-[56px]">참여 중</p>
          <div className="flex flex-row align-middle justify-center gap-4 mr-[56px]">
            <RefreshButoon />
            <MeetingRoomForm />
          </div>
        </div>
        <section className="w-100% flex flex-row items-center justify-content mb-[40px]">{children}</section>
      </section>
    </article>
  );
}

export default MyRoomsTitle;
