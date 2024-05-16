import { chatStore } from '@/store/chatStore';
import { Message } from '@/types/chatTypes';
import { getformattedDate, isItMe, isNextDay } from '@/utils/utilFns';
import ChatImg from './ChatImg';
import ParticipantsInfoWrapper from './ParticipantsInfoWrapper';
import { useMsgsQuery, useParticipantsQuery, useRoomDataQuery } from '@/query/useQueries/useChattingQuery';

const OthersChat = ({ msg, idx, lastDivRefs }: { msg: Message; idx: number; lastDivRefs: any }) => {
  const { chatRoomId } = chatStore((state) => state);
  const messages = useMsgsQuery(chatRoomId as string);
  const {
    room: { room_id, leader_id }
  } = useRoomDataQuery(chatRoomId as string);
  const participants = useParticipantsQuery(room_id);

  const showThatUser = (userId: string) => {
    const thatUserData = participants.find((p) => p.users.user_id === userId);
    return thatUserData;
  };

  return (
    <>
      <div id={msg.message_id} ref={lastDivRefs.current[idx]} className="flex gap-[12px]">
        {messages && isItMe(idx, messages) ? (
          !isNextDay(idx, messages) ? (
            <div className="w-16"></div>
          ) : (
            <ParticipantsInfoWrapper showThatUser={showThatUser} msg={msg} leaderId={leader_id} />
          )
        ) : (
          <ParticipantsInfoWrapper showThatUser={showThatUser} msg={msg} leaderId={leader_id} />
        )}

        <div className="flex flex-col gap-1">
          {messages && isItMe(idx, messages) ? (
            !isNextDay(idx, messages) ? null : (
              <h2 className="font-bold">{showThatUser(msg.send_from)?.users.nickname}</h2>
            )
          ) : (
            <h2 className="font-bold">{showThatUser(msg.send_from)?.users.nickname}</h2>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex gap-2 mr-auto">
              {msg.message?.length && (
                <span className="rounded-md bg-mainColor py-1.5 px-[8px] text-left text-white font-extralight max-w-72 break-words">
                  {msg.message}
                </span>
              )}
              <ChatImg msg={msg} />
            </div>
            {messages && idx < messages.length - 1 && msg.send_from === messages[idx + 1].send_from ? null : (
              <div className="mt-auto text-gray-400">
                <p className="text-sm">{getformattedDate(msg.created_at)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OthersChat;
