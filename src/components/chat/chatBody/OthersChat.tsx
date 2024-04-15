import { useParticipantsQuery, useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { chatStore } from '(@/store/chatStore)';
import { Message } from '(@/types/chatTypes)';
import { getformattedDate, isItMe, isNextDay, showingDate } from '(@/utils)';
import AvatarDefault from '(@/utils/icons/AvatarDefault)';
import { Tooltip } from '@nextui-org/react';
import { FaCrown } from 'react-icons/fa6';
import Image from 'next/image';
import { UserTypeFromTable } from '(@/types/userTypes)';

const OthersChat = ({ msg, idx, lastDivRefs }: { msg: Message; idx: number; lastDivRefs: any }) => {
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
      {isNextDay(idx, messages) ? (
        <div className="flex justify-center my-[16px] bg-[#D4D4D8] mx-auto w-[150px] px-[16px] py-[6px] rounded-full text-white">
          <p className="font-extralight tracking-wide text-sm">{showingDate(msg.created_at)}</p>
        </div>
      ) : null}

      <div id={msg.message_id} ref={lastDivRefs.current[idx]} className="flex gap-[12px]">
        {isItMe(idx, messages) ? (
          !isNextDay(idx, messages) ? (
            <div className="w-[60px]"></div>
          ) : (
            <ParticipantsWrapper
              participants={participants}
              showThatUser={showThatUser}
              msg={msg}
              leaderId={leaderId}
            />
          )
        ) : (
          <ParticipantsWrapper participants={participants} showThatUser={showThatUser} msg={msg} leaderId={leaderId} />
        )}

        <div className="flex flex-col gap-1">
          {isItMe(idx, messages) ? (
            !isNextDay(idx, messages) ? null : (
              <div className="font-bold">{showThatUser(msg.send_from)?.nickname}</div>
            )
          ) : (
            <div className="font-bold">{showThatUser(msg.send_from)?.nickname}</div>
          )}

          <div className="flex flex-col gap-1.5">
            <div className="gap-2 mr-auto">
              <div className="border border-gray1 rounded-md py-1.5 px-[8px] font-light">{msg.message}</div>
            </div>
            {idx < messages.length - 1 && msg.send_from === messages[idx + 1].send_from ? null : (
              <div className="mt-auto text-xs text-gray-400">
                <p>{getformattedDate(msg.created_at)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OthersChat;

const ParticipantsWrapper = ({
  participants,
  showThatUser,
  msg,
  leaderId
}: {
  participants: UserTypeFromTable[];
  showThatUser: any;
  msg: Message;
  leaderId: string | undefined;
}) => {
  return (
    <Tooltip content={<div>{participants && showThatUser(msg.send_from)?.nickname}</div>}>
      <div className="relative my-auto flex h-[52px] w-[60px] rounded-full overflow-hidden flex justify-center items-center">
        <div className=" h-[52px] w-[52px] mr-auto">
          {showThatUser(msg.send_from)?.avatar ? (
            <Image
              src={showThatUser(msg.send_from)?.avatar as string}
              alt="Avatar"
              style={{ objectFit: 'cover' }}
              fill={true}
              sizes="500px"
              priority={true}
            />
          ) : (
            <AvatarDefault />
          )}
        </div>
        {leaderId === showThatUser(msg.send_from) ? (
          <div className="w-[24px] h-[24px] rounded-full absolute bottom-0 right-0 flex justify-center bg-purpleThird border border-gray1 font-extralight">
            <FaCrown className="my-auto fill-mainColor " />
          </div>
        ) : null}
      </div>
    </Tooltip>
  );
};
