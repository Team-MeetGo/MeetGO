import { Tables } from './database.types';

export type Message = Tables<'messages'>;

export type UserData =
  | {
      user_id: string;
      avatar: string | null;
      nickname: string | null;
    }[]
  | null;

export type RoomData = Tables<'room'>;

export type chatRoomType = Tables<'chatting_room'>;
