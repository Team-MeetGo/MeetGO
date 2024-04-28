'use client';
import { useParticipantsQuery, useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { MSGS_QUERY_KEY } from '@/query/chat/chatQueryKeys';
import { chatStore } from '@/store/chatStore';
import { useModalStore } from '@/store/modalStore';
import { ROOMSTATUS } from '@/utils/constant';
import { clientSupabase } from '@/utils/supabase/client';
import { Avatar, AvatarGroup, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { IoIosSearch } from 'react-icons/io';
import ShowChatMember from '../chatBody/ShowChatMember';
import ChatPresence from './ChatPresence';

const ChatHeader = ({ chatRoomId }: { chatRoomId: string }) => {
  const { onlineUsers, setisRest, setSearchMode } = chatStore((state) => state);
  const { openModal, closeModal } = useModalStore();
  const { data: user } = useGetUserDataQuery();
  const room = useRoomDataQuery(chatRoomId);
  const participants = useParticipantsQuery(room?.room_id as string);
  const queryClient = useQueryClient();

  // 채팅방 isActive 상태를 false로 변경
  const updateIsActiveFalse = async () => {
    const { error: updateActiveErr } = await clientSupabase
      .from('chatting_room')
      .update({ isActive: false })
      .eq('chatting_room_id', chatRoomId);
    if (updateActiveErr) {
      alert('채팅방 비활성화에 실패하였습니다.');
      console.error(updateActiveErr.message);
    }
  };

  // participants 테이블에서 해당 룸에 대한 유저정보 삭제
  const getRidOfMe = async () => {
    if (user?.user_id === room?.leader_id) {
      const { error: updateLeaderErr } = await clientSupabase
        .from('room')
        .update({ leader_id: participants?.find((person) => person.user_id !== user?.user_id)?.user_id })
        .eq('room_id', String(room?.room_id));
      if (updateLeaderErr) console.error('fail to update leader of room', updateLeaderErr.message);
    }
    const { error: deleteErr } = await clientSupabase
      .from('participants')
      .update({ isDeleted: true })
      .eq('room_id', String(room?.room_id))
      .eq('user_id', user?.user_id!);
    if (deleteErr) {
      console.error(deleteErr.message);
      alert('채팅방 나가기에서 오류가 발생하였습니다.');
    }
  };

  // 남아있는 사람인지 나간사람인지 isRest 상태변경으로 화면 렌더링 바꾸는 함수
  const handleIsRest = async () => {
    const { data: restOf, error: getPartErr } = await clientSupabase
      .from('participants')
      .select('user_id')
      .eq('room_id', String(room?.room_id))
      .eq('isDeleted', false);
    if (getPartErr) {
      console.error(getPartErr.message);
      alert('참가자들 정보를 불러오는 데 실패했습니다.');
    } else {
      const restArr = restOf.map((r) => r.user_id);
      setisRest(restArr.includes(user?.user_id!) as boolean);
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
    if (imgStorageErr) {
      console.error('storage remove fail', imgStorageErr.message);
    } else {
      const filesToRemove = usersAllImgList.map((x) => `${chatRoomId}/${user?.user_id}/${x.name}`);

      if (filesToRemove && filesToRemove.length) {
        const { error: deleteFilesErr } = await clientSupabase.storage.from('chatImg').remove(filesToRemove);
        deleteFilesErr && console.error('fail to delete list of the folder', deleteFilesErr.message);
        const { error: deleteFolderErr } = await clientSupabase.storage
          .from('chatImg')
          .remove([`${chatRoomId}/${user?.user_id}`]);
        deleteFolderErr && console.error("fail to delete the user's folder of storage", deleteFolderErr.message);
      }
    }
  };

  // room_status 모집완료 -> 모집중으로 변경
  const updateRoomState = async () => {
    const { error } = await clientSupabase
      .from('room')
      .update({ room_status: ROOMSTATUS.RECRUITING })
      .eq('room_id', String(room?.room_id));
    if (error) console.error('참가자 방 나갈 시 room_status 모집중으로 변경 실패', error.message);
  };

  const getOutOfChatRoom = async () => {
    const message = `한명이라도 나가면 채팅방이 종료됩니다. 
    한 번 나가면 다시 입장하실 수 없습니다. 
    그래도 나가시겠습니까?`;

    openModal({
      type: 'confirm',
      name: '',
      text: message,
      onFunc: async () => {
        closeModal();
        await updateIsActiveFalse();
        await getRidOfMe();
        await handleIsRest();
        await updateRoomState();
        deleteLastMsg();
        deleteTheUserImgs();
        queryClient.removeQueries({ queryKey: [MSGS_QUERY_KEY, chatRoomId], exact: true });
      },
      onCancelFunc: () => {
        closeModal();
      }
    });
  };

  return (
    <div className="h-[116px] border-b flex pl-[32px] pr-[16px] py-[16px] justify-between ">
      <div className="flex gap-2">
        <div className="flex flex-col gap-[8px]">
          <h1 className="font-bold text-2xl h-[36px]">{room?.room_title}</h1>

          <div className="flex gap-[20px] items-center">
            <ChatPresence />
            <AvatarGroup isBordered max={8}>
              {participants?.map((person) => (
                <Popover key={person.user_id} showArrow placement="bottom">
                  <PopoverTrigger>
                    <Avatar
                      as="button"
                      src={person.avatar as string}
                      className={`w-[32px] h-[32px] ${
                        !onlineUsers.find((id) => id === person.user_id) ? 'bg-black opacity-30' : ''
                      }`}
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <ShowChatMember person={person} />
                  </PopoverContent>
                </Popover>
              ))}
            </AvatarGroup>
          </div>
        </div>
      </div>

      <div className="flex gap-2 h-[40px] my-auto">
        <button onClick={setSearchMode} className="text-[#A1A1AA]">
          <IoIosSearch />
        </button>
        <Link
          href="/meetingRoom"
          className="border border-[#D4D4D8] text-[#A1A1AA] p-[10px] flex items-center rounded-md"
        >
          로비로가기
        </Link>
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
