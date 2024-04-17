'use client';
import { clientSupabase } from '@/utils/supabase/client';
import ChatPresence from './ChatPresence';
import { chatStore } from '@/store/chatStore';
import { IoIosSearch } from 'react-icons/io';
import { useParticipantsQuery, useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { Avatar, AvatarGroup } from '@nextui-org/react';

const ChatHeader = ({ chatRoomId }: { chatRoomId: string }) => {
  const { setMessages, setisRest, setSearchMode } = chatStore((state) => state);
  const { data: user } = useGetUserDataQuery();
  const room = useRoomDataQuery(chatRoomId);
  const roomId = room?.roomId;
  const roomData = room?.roomData;
  const participants = useParticipantsQuery(roomId as string);

  const handleSearchMode = () => {
    setSearchMode();
  };

  // 채팅방 isActive 상태를 false로 변경
  const updateChatRoomIsActive = async () => {
    const { error: updateActiveErr } = await clientSupabase
      .from('chatting_room')
      .update({ isActive: false })
      .eq('chatting_room_id', String(chatRoomId));
    if (updateActiveErr) {
      alert('채팅방 비활성화에 실패하였습니다.');
      console.error(updateActiveErr?.message);
    }
  };

  // participants 테이블에서 해당 룸에 대한 유저정보 삭제
  const getRidOfMe = async () => {
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

  // 남아있는 사람인지 나간사람인지 isRest 상태변경으로 화면 렌더링 바꾸는 함수
  const handleIsRest = async () => {
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

  // 마지막 메세지 삭제
  const deleteLastMsg = async () => {
    const { error } = await clientSupabase.from('remember_last_msg').delete().eq('chatting_room_id', chatRoomId);
    if (error) console.error('remember_last_msg table에 해당 채팅방 관련 정보 삭제 실패');
  };

  // 해당 유저가 남긴 채팅창의 이미지들 지우기
  const deleteTheUserImgs = async () => {
    const { error: imgStorageErr, data: usersAllImgList } = await clientSupabase.storage
      .from('chatImg')
      .list(`${chatRoomId}/${user?.user_id}`);
    imgStorageErr && console.error('storage remove fail', imgStorageErr.message);
    const filesToRemove = usersAllImgList?.map((x) => `${chatRoomId}/${user?.user_id}/${x.name}`);

    if (filesToRemove) {
      const { error: deleteFilesErr } = await clientSupabase.storage.from('chatImg').remove(filesToRemove);
      deleteFilesErr && console.error('fail to delete list of the folder', deleteFilesErr.message);
      const { error: deleteFolderErr } = await clientSupabase.storage
        .from('chatImg')
        .remove([`${chatRoomId}/${user?.user_id}`]);
      deleteFolderErr && console.error("fail to delete the user's folder of storage", deleteFolderErr.message);
    }
  };

  // room_status 모집완료 -> 모집중으로 변경
  const updateRoomState = async () => {
    const { error } = await clientSupabase.from('room').update({ room_status: '모집중' }).eq('room_id', String(roomId));
    if (error) console.error('참가자 방 나갈 시 room_status 모집중으로 변경 실패', error.message);
  };

  const getOutOfChatRoom = async () => {
    if (window.confirm('채팅창에서 한번 나가면 다시 입장할 수 없습니다. 그래도 나가시겠습니까?')) {
      await updateChatRoomIsActive();
      await getRidOfMe();
      await handleIsRest();
      await deleteLastMsg();
      await deleteTheUserImgs();
      await updateRoomState();
      setMessages([]);
    } else {
      return;
    }
  };

  return (
    <div className="h-[116px] border-b flex p-[16px] justify-between">
      <div className="flex gap-2">
        <div className="flex flex-col gap-[16px]">
          <p className="font-bold text-2xl h-[36px]">{roomData && roomData.room_title}</p>

          <div className="flex gap-[16px]">
            <div className="mt-[10px]">
              <ChatPresence />
            </div>
            <div>
              <AvatarGroup isBordered>
                {participants.map((person) => (
                  <Avatar key={person.user_id} src={person.avatar as string} className="w-[32px] h-[32px]" />
                ))}
              </AvatarGroup>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 h-[40px] my-auto">
        <button onClick={handleSearchMode} className="text-[#A1A1AA]">
          <IoIosSearch />
        </button>
        <button
          onClick={getOutOfChatRoom}
          className="border border-[#D4D4D8] text-[#A1A1AA] p-[10px] flex items-center rounded-md"
        >
          나가기
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
