import { Message } from '(@/types/chatTypes)';
import { UserDataFromTable } from '(@/types/userTypes)';
import { getformattedDate } from '(@/utils)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Tooltip } from '@nextui-org/react';
import { useEffect, useState } from 'react';

const OthersChat = ({ msg }: { msg: Message }) => {
  const roomId = 'c9c15e2c-eae0-40d4-ad33-9a05ad4792b5';
  const [usersData, setUsersData] = useState<UserDataFromTable[] | null>();

  useEffect(() => {
    const fetchParticipants = async () => {
      const { data: userIds, error: userIdErr } = await clientSupabase
        .from('participants')
        .select('user_id')
        .eq('room_id', roomId);
      console.log('채팅방 멤버들', userIds);

      if (userIds) {
        const users = [];
        for (const id of userIds) {
          const { data, error: usersDataErr } = await clientSupabase
            .from('users')
            .select('*')
            .eq('user_id', String(id.user_id));
          console.log(data);
          if (data) users.push(...data);
        }
        console.log('users', users);
        setUsersData([...users]);
      }
    };
    fetchParticipants();
  }, []);

  const showThatUser = (userId: string | null) => {
    const thatUserData = usersData?.find((data) => data.user_id === userId);
    return thatUserData;
  };

  return (
    <div className="flex gap-4" key={msg.message_id}>
      <Tooltip content={<div>{showThatUser(msg.send_from)?.nickname}</div>}>
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
