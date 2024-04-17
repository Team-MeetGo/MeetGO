import { Tables } from './database.types';

export type Message = {
  chatting_room_id: string;
  created_at: string;
  message: string;
  message_id: string;
  send_from: string;
};

export type UserData =
  | {
      user_id: string;
      avatar: string | null;
      nickname: string | null;
    }[]
  | null;

export type RoomData = Tables<'room'>;

export type chatRoomPayloadType = Tables<'chatting_room'>;
