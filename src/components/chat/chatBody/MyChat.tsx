'use client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { chatStore } from '@/store/chatStore';
import { Message } from '@/types/chatTypes';
import { getformattedDate, isItMe, isNextDay } from '@/utils';
import ChatDeleteDropDown from './ChatDeleteDropDown';
import { useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import ChatImg from './ChatImg';
import MyInfoWrapper from './MyInfoWrapper';

const MyChat = ({ msg, idx, msgRefs }: { msg: Message; idx: number; msgRefs: any }) => {
  const { messages, chatRoomId } = chatStore((state) => state);
  const { data: user } = useGetUserDataQuery();
  const room = useRoomDataQuery(chatRoomId as string);
  const leaderId = room?.roomData.leader_id;

  return (
    <div>
      <div id={msg.message_id} ref={msgRefs.current[idx]} className="flex gap-[8px] justify-end">
        <div className="w-80 flex flex-col gap-1">
          {isItMe(idx, messages) ? (
            !isNextDay(idx, messages) ? null : (
              <div className="font-bold ml-auto">{user?.nickname}</div>
            )
          ) : (
            <div className="font-bold ml-auto">{user?.nickname}</div>
          )}

          <div className="flex gap-2 ml-auto">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 ml-auto">
                <div>
                  <ChatDeleteDropDown msg={msg} />
                </div>
                {msg.message?.length ? (
                  <div className="rounded-md bg-mainColor py-1.5 px-[8px] text-right text-white font-extralight">
                    {msg.message}
                  </div>
                ) : null}
                <ChatImg msg={msg} />
              </div>

              {idx < messages.length - 1 && msg.send_from === messages[idx + 1].send_from ? null : (
                <div className="mt-auto text-gray-400 ml-auto">
                  <p className="text-sm">{getformattedDate(msg.created_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {isItMe(idx, messages) ? (
          !isNextDay(idx, messages) ? (
            <div className="w-[60px]"></div>
          ) : (
            <MyInfoWrapper user={user} leaderId={leaderId} />
          )
        ) : (
          <MyInfoWrapper user={user} leaderId={leaderId} />
        )}
      </div>
    </div>
  );
};

export default MyChat;
