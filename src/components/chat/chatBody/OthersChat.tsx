import { useParticipantsQuery, useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { chatStore } from '@/store/chatStore';
import { Message } from '@/types/chatTypes';
import { getformattedDate, showingDate } from '@/utils';
import { Tooltip } from '@nextui-org/react';

const OthersChat = ({ msg, idx, lastDivRefs }: { msg: Message; idx: number; lastDivRefs: any }) => {
  const { chatRoomId, messages } = chatStore((state) => state);
  const room = useRoomDataQuery(chatRoomId as string);
  const roomId = room?.roomId;
  const participants = useParticipantsQuery(roomId as string);

  const showThatUser = (userId: string | null) => {
    const thatUserData = participants?.find((p) => p.user_id === userId);
    return thatUserData;
  };

  return (
    <div key={msg.message_id}>
      {idx >= 1 && new Date(msg.created_at).getDate() > new Date(messages[idx - 1].created_at).getDate() ? (
        <div className="mx-auto">
          <p>{showingDate(msg.created_at)}</p>
        </div>
      ) : null}

      <div id={msg.message_id} ref={lastDivRefs.current[idx]} className="flex gap-4">
        <Tooltip content={<div>{participants && showThatUser(msg.send_from)?.nickname}</div>}>
          <div className="h-14 w-14 bg-indigo-600 rounded-full my-auto">
            <img src={showThatUser(msg.send_from)?.avatar as string} alt="유저 이미지"></img>
          </div>
        </Tooltip>

        <div className="w-80 h-24 flex flex-col gap-1">
          <div className="font-bold">{msg.nickname}</div>
          <div className="gap-2 mr-auto">
            <div className="border border-gray1 rounded-md py-1.5 px-5 font-light">{msg.message}</div>
          </div>
          <div className="mt-auto text-gray-400 text-xs">
            <p>{getformattedDate(msg.created_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OthersChat;
