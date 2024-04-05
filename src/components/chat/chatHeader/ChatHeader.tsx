'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import ChatPresence from './ChatPresence';
import { chatStore } from '(@/store/chatStore)';
import { userStore } from '(@/store/userStore)';

const ChatHeader = () => {
  const { roomId, chatRoomId, roomData, setMessages, setisRest } = chatStore((state) => state);
  const user = userStore((state) => state.user);

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

  const getRidOfMe = async () => {
    // participants 테이블에서 해당 룸에 대한 유저정보 삭제
    if (user) {
      const { error: deleteErr } = await clientSupabase
        .from('participants')
        .delete()
        .eq('room_id', String(roomId))
        .eq('user_id', user[0].user_id);
      if (deleteErr) {
        console.error(deleteErr?.message);
        alert('채팅방 나가기에서 오류가 발생하였습니다.');
      }
    }
  };

  const handleIsRest = async () => {
    // OthersChat이랑 코드 겹침 나중에 마무리단계에서 따로 뺄 예정
    if (user) {
      const { data: restOf, error: getPartErr } = await clientSupabase
        .from('participants')
        .select('user_id')
        .eq('room_id', String(roomId));
      const restArr = restOf?.map((r) => r.user_id);
      setisRest(restArr?.includes(user[0].user_id) as boolean);
      if (getPartErr) {
        console.error(getPartErr.message);
        alert('참가자들 정보를 불러오는 데 실패했습니다.');
      }
    }
  };

  const getOutOfChatRoom = async () => {
    await UpdateIsActive();
    await getRidOfMe();
    await handleIsRest();
    setMessages([]);
  };

  return (
    <div className="h-20 border-b border-indigo-600 flex p-3 justify-between">
      <div className="font-bold text-2xl flex gap-2">
        {roomData && roomData[0]?.room_title}
        <div className="text-base font-normal">
          누가 들어와 있는지 들어갈 부분
          <ChatPresence />
        </div>
      </div>
      <div></div>
      <button onClick={getOutOfChatRoom}>죄송합니다 제 스타일은 아니신 것 같아요</button>
    </div>
  );
};

export default ChatHeader;
