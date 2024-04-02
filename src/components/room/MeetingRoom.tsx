import type { Database } from '(@/types/database.types)';
import { Card, CardBody, CardFooter } from '@nextui-org/react';
import DeleteMeetingRoom from './DeleteMeetingRoom';
import EditMeetingRoom from './EditMeetingRoom';

type MeetingRoom = Database['public']['Tables']['room']['Row'];

function MeetingRoom({ list }: { list: MeetingRoom[] }) {
  return list.map((room) => (
    <div key={room.room_id} className="gap-2 grid grid-cols-3 sm:grid-cols-4 m-8">
      <Card shadow="sm" isPressable>
        <CardBody className="overflow-visible p-0 m-8">
          <main>
            <div> {room.room_title} </div>
            <div> {room.feature} </div>
            <div> {room.location} </div>
            <div> {room.room_status} </div>
            <div> {room.member_number}</div>
            <div className="flex flex-row gap-12">
              <DeleteMeetingRoom id={room.room_id} />
              <EditMeetingRoom room={room} />
            </div>
          </main>
        </CardBody>
      </Card>
    </div>
  ));
}

export default MeetingRoom;
