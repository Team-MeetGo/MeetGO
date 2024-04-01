export type Message = {
  created_at: string;
  is_edit: boolean;
  message: string;
  message_id: string;
  send_from: string | null;
};
