import type { Database } from '(@/types/database.types)';
import { Card, CardBody, CardFooter } from '@nextui-org/react';
import DeleteMeetingRoom from './DeleteMeetingRoom';
import EditMeetingRoom from './EditMeetingRoom';
import Link from 'next/link';

type MeetingRoom = Database['public']['Tables']['room']['Row'];

function MeetingRoom({ list }: { list: MeetingRoom[] }) {
  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 m-8">
      {list.map((room) => (
        <Card key={room.room_id} shadow="sm" isPressable>
          <CardBody className="overflow-visible p-0 m-8">
            <Link href={`/meetingRoom/${room.room_id}`}>
              <main>
                <div> {room.room_title} </div>
                <div> {room.feature} </div>
                <div> {room.location} </div>
                <div> {room.room_status} </div>
                <div> {room.member_number}</div>
              </main>
            </Link>
            <div className="flex flex-row gap-12">
              <DeleteMeetingRoom id={room.room_id} />
              <EditMeetingRoom room={room} />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default MeetingRoom;
