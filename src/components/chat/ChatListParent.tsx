import { serverSupabase } from '(@/utils/supabase/server)';
import ChatList from './ChatList';

const ChatListParent = async () => {
  const supabase = serverSupabase();

  const { data } = await supabase.from('messages').select('*');
  console.log('data =>', data);
  return (
    <>
      {/* <ChatStore serverMsg={data ?? []} /> */}
      <ChatList serverMsg={data ?? []} />
    </>
  );
};

export default ChatListParent;
