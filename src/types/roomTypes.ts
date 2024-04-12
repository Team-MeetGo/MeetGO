import type { Database, Tables } from './database.types';

export type UserType = Tables<'users'>;
export type ParticipantType = Tables<'participants'>;
export type MeetingRoomType = Tables<'room'>;
export type MeetingRoomTypes = MeetingRoomType[] | null | undefined;
export type UpdateRoomType = {
  title: string;
  favoriteArray: string[];
  location: string;
  memberNumber: string;
  room_id: string;
  region: string;
};
