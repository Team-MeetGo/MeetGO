import { useParticipantsQuery, useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { chatStore } from '(@/store/chatStore)';
import { Message } from '(@/types/chatTypes)';
import { getformattedDate, showingDate } from '(@/utils)';
import AvatarDefault from '(@/utils/icons/AvatarDefault)';
import { Avatar, Tooltip } from '@nextui-org/react';
import { FaCrown } from 'react-icons/fa6';

const OthersChat = ({ msg, idx, lastDivRefs }: { msg: Message; idx: number; lastDivRefs: any }) => {
  const { chatRoomId, messages } = chatStore((state) => state);
  const room = useRoomDataQuery(chatRoomId as string);
  const roomId = room?.roomId;
  const leaderId = room?.roomData.leader_id;
  console.log(leaderId);
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

      <div id={msg.message_id} ref={lastDivRefs.current[idx]} className="flex gap-2">
        <Tooltip content={<div>{participants && showThatUser(msg.send_from)?.nickname}</div>}>
          <div className="relative my-auto flex h-[52px] w-[60px]">
            <div className=" h-[52px] w-[52px] mr-auto rounded-full overflow-hidden flex justify-center items-center">
              {showThatUser(msg.send_from)?.avatar ? (
                <img src={showThatUser(msg.send_from)?.avatar as string} alt="유저 이미지"></img>
              ) : (
                <AvatarDefault />
              )}
            </div>
            {leaderId === showThatUser(msg.send_from) ? (
              <div className="w-[24px] h-[24px] rounded-full absolute bottom-0 right-0 flex justify-center bg-purpleThird border border-gray1">
                <FaCrown className="my-auto fill-mainColor " />
              </div>
            ) : null}
          </div>
        </Tooltip>

        <div className="w-80 h-24 flex flex-col gap-1">
          <div className="font-bold">{showThatUser(msg.send_from)?.nickname}</div>

          <div className="flex flex-col gap-1.5">
            <div className="gap-2 mr-auto">
              <div className="border border-gray1 rounded-md py-1.5 px-5 font-light">{msg.message}</div>
            </div>
            <div className="mt-auto text-gray-400 text-xs">
              <p>{getformattedDate(msg.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OthersChat;
