import { Tables } from './database.types';

export type Message = {
  avatar: string;
  chatting_room_id: string;
  created_at: string;
  message: string;
  message_id: string;
  nickname: string;
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
