import { Tables } from './database.types';

export type Message = {
  message_id: string;
  send_from: string | null;
  message: string;
  nickname: string;
  avatar: string;
  created_at: string;
};

export type UserData =
  | {
      user_id: string;
      avatar: string | null;
      nickname: string | null;
    }[]
  | null;

export type RoomData = Tables<'room'>;
