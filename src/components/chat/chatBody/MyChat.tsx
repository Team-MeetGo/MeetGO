import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { chatStore } from '@/store/chatStore';
import { Message } from '@/types/chatTypes';
import { getformattedDate, showingDate } from '@/utils';
import ChatDeleteDropDown from './ChatDeleteDropDown';

const MyChat = ({ msg, idx, lastDivRefs }: { msg: Message; idx: number; lastDivRefs: any }) => {
  const { messages } = chatStore((state) => state);
  const { data: user } = useGetUserDataQuery();

  return (
    <>
      {idx >= 1 && new Date(msg.created_at).getDate() > new Date(messages[idx - 1].created_at).getDate() ? (
        <div className="mx-auto" key={msg.message_id}>
          <p>{showingDate(msg.created_at)}</p>
        </div>
      ) : null}

      <div id={msg.message_id} ref={lastDivRefs.current[idx]} className="flex gap-4 ml-auto">
        <div className="w-80 h-24 flex flex-col gap-1">
          <div className="font-bold ml-auto">{msg.nickname}</div>
          <div className="flex gap-2 ml-auto">
            <ChatDeleteDropDown msg={msg} />
            <div className="rounded-md bg-mainColor py-1.5 px-5 h-full text-right text-white font-extralight">
              {msg.message}
            </div>
          </div>
          <div className="mt-auto text-xs text-gray-400 ml-auto">
            <p>{getformattedDate(msg.created_at)}</p>
          </div>
        </div>
        <div className="h-14 w-14 bg-indigo-600 rounded-full my-auto">
          <img src={user?.avatar as string} alt="유저 이미지"></img>
        </div>
      </div>
    </>
  );
};

export default MyChat;
