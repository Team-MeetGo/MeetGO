import { useParticipantsQuery, useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { chatStore } from '(@/store/chatStore)';
import { Message } from '(@/types/chatTypes)';
import { UsersType } from '(@/types/userTypes)';
import { getformattedDate } from '(@/utils)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Tooltip } from '@nextui-org/react';
import { useEffect, useState } from 'react';

const OthersChat = ({ msg }: { msg: Message }) => {
  const chatRoomId = chatStore((state) => state.chatRoomId);
  const room = useRoomDataQuery(chatRoomId as string);
  const roomId = room?.roomId;
  const users = useParticipantsQuery(roomId as string);

  const showThatUser = (userId: string | null) => {
    const thatUserData = users?.find((p) => p.user_id === userId);
    return thatUserData;
  };

  return (
    <div id={msg.message_id} className="flex gap-4">
      <Tooltip content={<div>{users && showThatUser(msg.send_from)?.nickname}</div>}>
        <div className="h-14 w-14 bg-indigo-600 rounded-full my-auto">
          <img src={msg.avatar} alt="유저 이미지"></img>
        </div>
      </Tooltip>

      <div className="w-80 h-24 flex flex-col gap-1">
        <div className="font-bold">{msg.nickname}</div>
        <div className="gap-2 mr-auto">
          <div className="border rounded-md py-3 px-5 h-full">{msg.message}</div>
        </div>

        <div className="mt-auto text-slate-100 text-xs">
          <p>{getformattedDate(msg.created_at)}</p>
        </div>
      </div>
    </div>
  );
};

export default OthersChat;
