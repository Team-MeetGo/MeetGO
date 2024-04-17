import { useParticipantsQuery, useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { chatStore } from '@/store/chatStore';
import { Message } from '@/types/chatTypes';
import { getformattedDate, showingDate, isItMe, isNextDay } from '@/utils';
import { Tooltip } from '@nextui-org/react';
import { FaCrown } from 'react-icons/fa6';
import Image from 'next/image';
import { UserTypeFromTable } from '@/types/userTypes';
import AvatarDefault from '@/utils/icons/AvatarDefault';

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
      <div id={msg.message_id} ref={lastDivRefs.current[idx]} className="flex gap-[12px]">
        {isItMe(idx, messages) ? (
          !isNextDay(idx, messages) ? (
            <div className="w-[60px]"></div>
          ) : (
            <ParticipantsInfoWrapper
              participants={participants}
              showThatUser={showThatUser}
              msg={msg}
              leaderId={leaderId}
            />
          )
        ) : (
          <ParticipantsInfoWrapper
            participants={participants}
            showThatUser={showThatUser}
            msg={msg}
            leaderId={leaderId}
          />
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
              {/* <div className="border border-gray1 rounded-md py-1.5 px-[8px] font-light">{msg.message}</div> */}
              {msg.message?.length ? (
                <div className="rounded-md bg-mainColor py-1.5 px-[8px] text-right text-white font-extralight">
                  {msg.message}
                </div>
              ) : null}

              {/* 다른 이름으로 저장하면 안뜨는 버그 */}
              {msg.imgs?.length ? (
                <div className="h-[100px] flex flex-wrap justify-start w-72">
                  {msg.imgs.map((url) => (
                    <div key={url} className="w-36 h-[100px] relative">
                      <Image
                        src={url}
                        alt="채팅 이미지"
                        fill={true}
                        style={{ objectFit: 'fill', borderRadius: '3px' }}
                        sizes="500px"
                        priority={true}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
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

const ParticipantsInfoWrapper = ({
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
