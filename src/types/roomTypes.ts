import type { Database, Tables } from './database.types';

export type UserType = Tables<'users'>;
export type ParticipantType = Tables<'participants'>;
export type MeetingRoomType = Tables<'room'>;
export type MeetingRoomTypes = MeetingRoomType[] | null | undefined;
export type ChattingRoomType = Tables<'chatting_room'>;
export type UserTypeNull = Tables<'users'> | null;

export type ParticipantsWithId = {
  user_id: string;
  users: UserType | null;
};

export type UpdateRoomType = {
  room_title: string;
  feature: string[];
  location: string;
  member_number: string;
  region: string;
  room_id: string;
};

export type NewRoomType = {
  room_title: string;
  leader_id: string;
  feature: string[];
  location: string;
  member_number: string;
  region: string;
  room_status: string;
};
