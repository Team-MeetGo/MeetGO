import { chatStore } from '(@/store/chatStore)';
import { Message } from '(@/types/chatTypes)';
import { UsersType } from '(@/types/userTypes)';
import { getformattedDate } from '(@/utils)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Tooltip } from '@nextui-org/react';
import { useEffect, useState } from 'react';

const OthersChat = ({ msg }: { msg: Message }) => {
  const roomId = chatStore((state) => state.roomId);
  const [usersData, setUsersData] = useState<UsersType[] | null>();

  useEffect(() => {
    const fetchParticipants = async () => {
      const { data: userIds, error: userIdErr } = await clientSupabase
        .from('participants')
        .select('user_id')
        .eq('room_id', String(roomId));
      console.log('채팅방 멤버들', userIds); // 남은 애들

      if (userIds) {
        const users = [];
        for (const id of userIds) {
          const { data, error: usersDataErr } = await clientSupabase
            .from('users')
            .select('*')
            .eq('user_id', String(id.user_id));
          if (data) users.push(...data);
        }
        setUsersData([...users]);
      }
    };
    roomId && fetchParticipants();
  }, [roomId]);

  const showThatUser = (userId: string | null) => {
    const thatUserData = usersData?.find((p) => p.user_id === userId);
    return thatUserData;
  };

  return (
    <div className="flex gap-4" key={msg.message_id}>
      <Tooltip content={<div>{usersData && showThatUser(msg.send_from)?.nickname}</div>}>
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
