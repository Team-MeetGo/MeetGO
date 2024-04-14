import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';
import { chatStore } from '(@/store/chatStore)';
import { Message } from '(@/types/chatTypes)';
import { getformattedDate, showingDate } from '(@/utils)';
import { Avatar } from '@nextui-org/react';
import ChatDeleteDropDown from './ChatDeleteDropDown';
import AvatarDefault from '(@/utils/icons/AvatarDefault)';
import { useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { FaCrown } from 'react-icons/fa6';

const MyChat = ({ msg, idx, lastDivRefs }: { msg: Message; idx: number; lastDivRefs: any }) => {
  const { messages, chatRoomId } = chatStore((state) => state);
  const { data: user } = useGetUserDataQuery();
  const room = useRoomDataQuery(chatRoomId as string);
  const leaderId = room?.roomData.leader_id;

  return (
    <div>
      {idx >= 1 && new Date(msg.created_at).getDate() > new Date(messages[idx - 1].created_at).getDate() ? (
        <div className="flex justify-center" key={msg.message_id}>
          <p>{showingDate(msg.created_at)}</p>
        </div>
      ) : null}

      <div id={msg.message_id} ref={lastDivRefs.current[idx]} className="flex gap-2 justify-end">
        <div className="w-80 h-24 flex flex-col gap-1">
          <div className="font-bold ml-auto">{msg.nickname}</div>
          <div className="flex gap-2 ml-auto">
            <div>
              <ChatDeleteDropDown msg={msg} />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="rounded-md bg-mainColor py-1.5 px-5 text-right text-white font-extralight">
                {msg.message}
              </div>
              <div className="mt-auto text-xs text-gray-400 ml-auto">
                <p>{getformattedDate(msg.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative my-auto flex h-[52px] w-[60px]">
          <div className=" h-[52px] w-[52px] ml-auto rounded-full overflow-hidden flex justify-center items-center">
            {user?.avatar ? <img src={user?.avatar as string} alt="유저 이미지"></img> : <AvatarDefault />}
          </div>
          {leaderId === user?.user_id ? (
            <div className="w-[24px] h-[24px] rounded-full absolute bottom-0 left-0 flex justify-center bg-purpleThird border border-gray1">
              <FaCrown className="my-auto fill-mainColor" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MyChat;
