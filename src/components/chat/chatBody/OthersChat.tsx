import { useParticipantsQuery, useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { chatStore } from '@/store/chatStore';
import { Message } from '@/types/chatTypes';
import { getformattedDate, isItMe, isNextDay } from '@/utils';
import ChatImg from './ChatImg';
import ParticipantsInfoWrapper from './ParticipantsInfoWrapper';

const OthersChat = ({ msg, idx, msgRefs }: { msg: Message; idx: number; msgRefs: any }) => {
  const { chatRoomId, messages } = chatStore((state) => state);
  const room = useRoomDataQuery(chatRoomId as string);
  const roomId = room?.roomId;
  const leaderId = room?.roomData.leader_id;
  const participants = useParticipantsQuery(roomId as string);

  const showThatUser = (userId: string | null) => {
    const thatUserData = participants?.find((p) => p.user_id === userId);
    return thatUserData;
  };

  return (
    <div>
      <div id={msg.message_id} ref={msgRefs.current[idx]} className="flex gap-[12px]">
        {isItMe(idx, messages) ? (
          !isNextDay(idx, messages) ? (
            <div className="w-[60px]"></div>
          ) : (
            <ParticipantsInfoWrapper showThatUser={showThatUser} msg={msg} leaderId={leaderId} />
          )
        ) : (
          <ParticipantsInfoWrapper showThatUser={showThatUser} msg={msg} leaderId={leaderId} />
        )}

        <div className="flex flex-col gap-1">
          {isItMe(idx, messages) ? (
            !isNextDay(idx, messages) ? null : (
              <div className="font-bold">{showThatUser(msg.send_from)?.nickname}</div>
            )
          ) : (
            <div className="font-bold">{showThatUser(msg.send_from)?.nickname}</div>
          )}

          <div className="flex flex-col gap-2">
            <div className="gap-2 mr-auto">
              {msg.message?.length ? (
                <div className="rounded-md bg-mainColor py-1.5 px-[8px] text-right text-white font-extralight">
                  {msg.message}
                </div>
              ) : null}
              <ChatImg msg={msg} />
            </div>
            {idx < messages.length - 1 && msg.send_from === messages[idx + 1].send_from ? null : (
              <div className="mt-auto text-gray-400">
                <p className="text-sm">{getformattedDate(msg.created_at)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OthersChat;
