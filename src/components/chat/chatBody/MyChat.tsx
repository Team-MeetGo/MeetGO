'use client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { chatStore } from '@/store/chatStore';
import { Message } from '@/types/chatTypes';
import { getformattedDate, isItMe, isNextDay } from '@/utils';
import ChatDeleteDropDown from './ChatDeleteDropDown';
import AvatarDefault from '@/utils/icons/AvatarDefault';
import { useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { FaCrown } from 'react-icons/fa6';
import Image from 'next/image';
import { UserTypeFromTable } from '@/types/userTypes';
import { Avatar } from '@nextui-org/react';

const MyChat = ({ msg, idx, lastDivRefs }: { msg: Message; idx: number; lastDivRefs: any }) => {
  const { messages, chatRoomId } = chatStore((state) => state);
  const { data: user } = useGetUserDataQuery();
  const room = useRoomDataQuery(chatRoomId as string);
  const leaderId = room?.roomData.leader_id;

  return (
    <div>
      <div id={msg.message_id} ref={lastDivRefs.current[idx]} className="flex gap-[8px] justify-end">
        <div className="w-80 flex flex-col gap-1">
          {isItMe(idx, messages) ? (
            !isNextDay(idx, messages) ? null : (
              <div className="font-bold ml-auto">{user?.nickname}</div>
            )
          ) : (
            <div className="font-bold ml-auto">{user?.nickname}</div>
          )}

          <div className="flex gap-2 ml-auto">
            <div className="flex flex-col">
              <div className="flex gap-2 ml-auto">
                <div>
                  <ChatDeleteDropDown msg={msg} />
                </div>
                {msg.message?.length ? (
                  <div className="rounded-md bg-mainColor py-1.5 px-[8px] text-right text-white font-extralight">
                    {msg.message}
                  </div>
                ) : null}

                {/* 다른 이름으로 저장하면 안뜨는 버그 */}
                {msg.imgs?.length ? (
                  <div className="h-[100px] flex flex-wrap justify-end">
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
                <div className="mt-auto text-xs text-gray-400 ml-auto">
                  <p>{getformattedDate(msg.created_at)}</p>
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

const MyInfoWrapper = ({
  user,
  leaderId
}: {
  user: UserTypeFromTable | null | undefined;
  leaderId: string | undefined;
}) => {
  return (
    <div className="relative my-auto flex h-[60px] w-[60px] ">
      <div className="h-16 w-16 ml-auto flex justify-center items-center">
        {user?.avatar ? (
          <Avatar src={user.avatar as string} alt="Avatar" size="lg" className="transition-transform object-cover" />
        ) : (
          <AvatarDefault />
        )}
      </div>
      {leaderId === user?.user_id ? (
        <div className="w-6 h-6 rounded-full absolute bottom-0 left-0 flex justify-center bg-purpleThird border border-gray1">
          <FaCrown className="my-auto fill-mainColor" />
        </div>
      ) : null}
    </div>
  );
};
