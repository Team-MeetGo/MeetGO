import MeetingRoomForm from '@/components/room/MeetingRoomForm';
import RefreshButoon from '@/components/room/lobby/RefreshButton';

function MyRoomsTitle({ children }: { children: React.ReactNode }) {
  return (
    <article className="fixed z-50 bg-white w-full flex-col justify-center align-middle">
      <div className="flex flex-row justify-center align-middle">
        <section className="h-[366px] mt-[64px] border-b border-gray2 max-w-[1250px]">
          <div className="flex flex-row w-full justify-between pb-[24px]">
            <p className="text-[40px] font-semibold ml-[56px]">참여 중</p>
            <div className="flex flex-row align-middle justify-center gap-4 mr-[56px]">
              <RefreshButoon />
              <MeetingRoomForm />
            </div>
          </div>
          {children}
        </section>
      </div>
    </article>
  );
}

export default MyRoomsTitle;
