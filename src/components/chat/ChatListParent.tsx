import { serverSupabase } from '(@/utils/supabase/server)';
import { User } from '@supabase/supabase-js';
import ChatList from './ChatList';

const ChatListParent = async ({ user }: { user: User | null }) => {
  const supabase = serverSupabase();
  const { data } = await supabase.from('messages').select('*');

  return (
    <>
      <ChatList serverMsg={data ?? []} user={user} />
    </>
  );
};

export default ChatListParent;
