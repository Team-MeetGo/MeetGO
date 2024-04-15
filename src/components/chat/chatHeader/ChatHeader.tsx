'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import ChatPresence from './ChatPresence';
import { chatStore } from '(@/store/chatStore)';
import { IoIosSearch } from 'react-icons/io';
import { useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';

const ChatHeader = ({ chatRoomId }: { chatRoomId: string }) => {
  const { setMessages, setisRest, setSearchMode } = chatStore((state) => state);
  const { data: user } = useGetUserDataQuery();
  const room = useRoomDataQuery(chatRoomId);
  const roomId = room?.roomId;
  const roomData = room?.roomData;

  const UpdateIsActive = async () => {
    // 채팅방 isActive 상태를 false로 변경
    const { error: updateActiveErr } = await clientSupabase
      .from('chatting_room')
      .update({ isActive: false })
      .eq('chatting_room_id', String(chatRoomId));
    if (updateActiveErr) {
      alert('채팅방 비활성화에 실패하였습니다.');
      console.error(updateActiveErr?.message);
    }
  };

  const handleSearchMode = () => {
    setSearchMode();
  };

  const getRidOfMe = async () => {
    // participants 테이블에서 해당 룸에 대한 유저정보 삭제
    const { error: deleteErr } = await clientSupabase
      .from('participants')
      .delete()
      .eq('room_id', String(roomId))
      .eq('user_id', user?.user_id!);
    if (deleteErr) {
      console.error(deleteErr?.message);
      alert('채팅방 나가기에서 오류가 발생하였습니다.');
    }
  };

  const handleIsRest = async () => {
    // OthersChat이랑 코드 겹침 나중에 마무리단계에서 따로 뺄 예정
    const { data: restOf, error: getPartErr } = await clientSupabase
      .from('participants')
      .select('user_id')
      .eq('room_id', String(roomId));
    const restArr = restOf?.map((r) => r.user_id);
    setisRest(restArr?.includes(user?.user_id!) as boolean);
    if (getPartErr) {
      console.error(getPartErr.message);
      alert('참가자들 정보를 불러오는 데 실패했습니다.');
    }
  };

  const getOutOfChatRoom = async () => {
    if (window.confirm('채팅창에서 한번 나가면 다시 입장할 수 없습니다. 그래도 나가시겠습니까?')) {
      await UpdateIsActive();
      await getRidOfMe();
      await handleIsRest();
      setMessages([]);
    } else {
      return;
    }
  };

  return (
    <div className="h-20 border-b flex p-3 justify-between">
      <div className="font-bold text-2xl flex gap-2">
        {roomData && roomData.room_title}
        <div className="text-base font-normal">
          누가 들어와 있는지 들어갈 부분
          <ChatPresence />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSearchMode}>
          <IoIosSearch />
        </button>

        <button onClick={getOutOfChatRoom}>나가기</button>
      </div>
    </div>
  );
};

export default ChatHeader;
