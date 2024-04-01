import type { Database } from '(@/types/database.types)';

type MeetingRoom = Database['public']['Tables']['room']['Row'];

function MeetingRoom({ list }: { list: MeetingRoom[] }) {
  return list.map((room) => (
    <main key={room.room_id} className="w-full h-32 border-red-600 border-8">
      <div> {room.room_title} </div>
      <div> {room.feature} </div>
      <div> {room.location} </div>
      <div> {room.room_status} </div>
      <div> {room.member_number}</div>
      {/* <DeleteMeetingRoom id={room.room_id} />
    <EditMeetingRoom /> */}
    </main>
  ));
}

export default MeetingRoom;
