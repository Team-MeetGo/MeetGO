import { supabase } from '(@/utils/supabase)';

const LobbyPage = async () => {
  const { data: meetingroom, error } = await supabase.from('room').select(`*`).eq('going_chat', false);
  if (error) return alert('error 발생!');

  return (
    <>
      <article>
        {/* <MeetingRoomForm /> */}
        {meetingroom?.map((room) => (
          <main key={room.room_id} className="w-full h-32 border-red-600 border-8">
            <div> {room.room_title} </div>
            <div> {room.feature} </div>
            <div> {room.location} </div>
            <div> {room.status} </div>
            <div> {room.member_number}</div>
            {/* <DeleteMeetingRoom id={room.room_id} />
            <EditMeetingRoom /> */}
          </main>
        ))}
      </article>
    </>
  );
};

export default LobbyPage;
