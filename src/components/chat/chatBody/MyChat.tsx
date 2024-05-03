'use client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { chatStore } from '@/store/chatStore';
import { Message } from '@/types/chatTypes';
import { getformattedDate, isItMe, isNextDay } from '@/utils/utilFns';
import ChatDeleteDropDown from './ChatDeleteDropDown';
import { useMsgsQuery, useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import ChatImg from './ChatImg';
import MyInfoWrapper from './MyInfoWrapper';

const MyChat = ({ msg, idx, lastDivRefs }: { msg: Message; idx: number; lastDivRefs: any }) => {
  const { chatRoomId } = chatStore((state) => state);
  const messages = useMsgsQuery(chatRoomId as string);
  const { data: user } = useGetUserDataQuery();
  const {
    room: { leader_id }
  } = useRoomDataQuery(chatRoomId as string);

  return (
    <>
      <div id={msg.message_id} ref={lastDivRefs.current[idx]} className="flex gap-[8px] justify-end">
        <div className="w-80 flex flex-col gap-1">
          {messages && isItMe(idx, messages) ? (
            !isNextDay(idx, messages) ? null : (
              <h2 className="font-bold ml-auto">{user?.nickname}</h2>
            )
          ) : (
            <h2 className="font-bold ml-auto">{user?.nickname}</h2>
          )}

          <div className="flex gap-2 ml-auto">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 ml-auto">
                <div>
                  <ChatDeleteDropDown msg={msg} />
                </div>
                {msg.message?.length && (
                  <span className="rounded-md bg-mainColor py-1.5 px-[8px] text-right text-white font-extralight max-w-72 break-words">
                    {msg.message}
                  </span>
                )}
                <ChatImg msg={msg} />
              </div>

              {messages && idx < messages.length - 1 && msg.send_from === messages[idx + 1].send_from ? null : (
                <div className="mt-auto text-gray-400 ml-auto">
                  <p className="text-sm">{getformattedDate(msg.created_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {messages && isItMe(idx, messages) ? (
          !isNextDay(idx, messages) ? (
            <div className="w-16"></div>
          ) : (
            <MyInfoWrapper user={user} leaderId={leader_id} />
          )
        ) : (
          <MyInfoWrapper user={user} leaderId={leader_id} />
        )}
      </div>
    </>
  );
};

export default MyChat;
