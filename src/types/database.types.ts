export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      chatting_room: {
        Row: {
          chatting_room_id: string;
          created_at: string;
          isActive: boolean;
          meeting_location: string | null;
          meeting_time: string | null;
          room_id: string | null;
        };
        Insert: {
          chatting_room_id?: string;
          created_at?: string;
          isActive?: boolean;
          meeting_location?: string | null;
          meeting_time?: string | null;
          room_id?: string | null;
        };
        Update: {
          chatting_room_id?: string;
          created_at?: string;
          isActive?: boolean;
          meeting_location?: string | null;
          meeting_time?: string | null;
          room_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_chatting_room_id_fkey';
            columns: ['room_id'];
            isOneToOne: false;
            referencedRelation: 'room';
            referencedColumns: ['room_id'];
          }
        ];
      };
      messages: {
        Row: {
          avatar: string;
          chatting_room_id: string;
          created_at: string;
          message: string;
          message_id: string;
          nickname: string;
          send_from: string;
        };
        Insert: {
          avatar: string;
          chatting_room_id: string;
          created_at?: string;
          message: string;
          message_id?: string;
          nickname: string;
          send_from?: string;
        };
        Update: {
          avatar?: string;
          chatting_room_id?: string;
          created_at?: string;
          message?: string;
          message_id?: string;
          nickname?: string;
          send_from?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_messages_chatting_room_id_fkey';
            columns: ['chatting_room_id'];
            isOneToOne: false;
            referencedRelation: 'chatting_room';
            referencedColumns: ['chatting_room_id'];
          },
          {
            foreignKeyName: 'public_messages_send_from_fkey';
            columns: ['send_from'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      participants: {
        Row: {
          created_at: string;
          part_id: string;
          room_id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          part_id?: string;
          room_id?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          part_id?: string;
          room_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_participants_room_id_fkey';
            columns: ['room_id'];
            isOneToOne: false;
            referencedRelation: 'room';
            referencedColumns: ['room_id'];
          },
          {
            foreignKeyName: 'public_participants_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['user_id'];
          }
        ];
      };
      review: {
        Row: {
          created_at: string;
          image_url: string | null;
          like_user: string[] | null;
          review_contents: string | null;
          review_id: string;
          review_title: string | null;
          test_image_url: string[] | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          image_url?: string | null;
          like_user?: string[] | null;
          review_contents?: string | null;
          review_id?: string;
          review_title?: string | null;
          test_image_url?: string[] | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          image_url?: string | null;
          like_user?: string[] | null;
          review_contents?: string | null;
          review_id?: string;
          review_title?: string | null;
          test_image_url?: string[] | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      review_comment: {
        Row: {
          comment_content: string | null;
          comment_id: string;
          created_at: string;
          review_id: string | null;
          user_id: string | null;
        };
        Insert: {
          comment_content?: string | null;
          comment_id?: string;
          created_at?: string;
          review_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          comment_content?: string | null;
          comment_id?: string;
          created_at?: string;
          review_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_review_comment_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'review';
            referencedColumns: ['review_id'];
          },
          {
            foreignKeyName: 'public_review_comment_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['user_id'];
          }
        ];
      };
      review_like: {
        Row: {
          created_at: string;
          like_id: string;
          review_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          like_id?: string;
          review_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          like_id?: string;
          review_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_review_like_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'review';
            referencedColumns: ['review_id'];
          },
          {
            foreignKeyName: 'public_review_like_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['user_id'];
          }
        ];
      };
      room: {
        Row: {
          created_at: string;
          feature: string[] | null;
          going_chat: boolean | null;
          leader_id: string | null;
          location: string | null;
          member_number: string | null;
          room_id: string;
          room_status: string | null;
          room_title: string | null;
        };
        Insert: {
          created_at?: string;
          feature?: string[] | null;
          going_chat?: boolean | null;
          leader_id?: string | null;
          location?: string | null;
          member_number?: string | null;
          room_id?: string;
          room_status?: string | null;
          room_title?: string | null;
        };
        Update: {
          created_at?: string;
          feature?: string[] | null;
          going_chat?: boolean | null;
          leader_id?: string | null;
          location?: string | null;
          member_number?: string | null;
          room_id?: string;
          room_status?: string | null;
          room_title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_room_user_id_fkey';
            columns: ['leader_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['user_id'];
          }
        ];
      };
      test_review_comment: {
        Row: {
          comment_content: string | null;
          comment_id: string;
          created_at: string;
          review_id: string | null;
          user_id: string | null;
        };
        Insert: {
          comment_content?: string | null;
          comment_id?: string;
          created_at?: string;
          review_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          comment_content?: string | null;
          comment_id?: string;
          created_at?: string;
          review_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      test_review_like: {
        Row: {
          created_at: string;
          liked_id: string;
          review_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          liked_id?: string;
          review_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          liked_id?: string;
          review_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar: string | null;
          favorite: string | null;
          gender: string | null;
          intro: string | null;
          isValidate: boolean;
          kakaoId: string | null;
          login_email: string;
          nickname: string | null;
          school_email: string | null;
          school_name: string | null;
          user_id: string;
        };
        Insert: {
          avatar?: string | null;
          favorite?: string | null;
          gender?: string | null;
          intro?: string | null;
          isValidate?: boolean;
          kakaoId?: string | null;
          login_email: string;
          nickname?: string | null;
          school_email?: string | null;
          school_name?: string | null;
          user_id: string;
        };
        Update: {
          avatar?: string | null;
          favorite?: string | null;
          gender?: string | null;
          intro?: string | null;
          isValidate?: boolean;
          kakaoId?: string | null;
          login_email?: string;
          nickname?: string | null;
          school_email?: string | null;
          school_name?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'users_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;
