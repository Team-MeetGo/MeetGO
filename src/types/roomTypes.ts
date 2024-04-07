import type { Database } from './database.types';

export type UserType = Database['public']['Tables']['users']['Row'];
export type ParticipantType = Database['public']['Tables']['participants']['Row'];
export type MeetingRoomType = Database['public']['Tables']['room']['Row'];
