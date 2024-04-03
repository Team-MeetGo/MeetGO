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

export type RoomData = {
  created_at: string;
  feature: string;
  going_chat: boolean | null;
  leader_id: string | null;
  location: string | null;
  member_number: string | null;
  room_id: string;
  room_status: string | null;
  room_title: string | null;
} | null;
