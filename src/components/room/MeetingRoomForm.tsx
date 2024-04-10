'use client';
import TagList from './MeetingRoomFeatureTags';
import { useTagStore } from '(@/store/roomStore)';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import { useAddRoom } from '(@/hooks/useMutation/useMeetingMutation)';
import { userStore } from '(@/store/userStore)';
import { useRouter } from 'next/navigation';

import type { NextMeetingRoomType } from '(@/types/roomTypes)';

function MeetingRoomForm() {
  const router = useRouter();
  const { tags, resetTags } = useTagStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = userStore((state) => state);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const cancelMakingMeetingRoom = () => {
    setTitle('');
    setLocation('');
    setMemberNumber('');
    resetTags();
  };

  const user_id = user?.user_id!;
  const nextMeetingRoom: NextMeetingRoomType = {
    feature: tags,
    leader_id: String(user_id),
    location,
    member_number: memberNumber,
    room_status: '모집중',
    room_title: title
  };
  const addRoomMutation = useAddRoom({ nextMeetingRoom, user_id });

  const addMeetingRoom = async (e: any) => {
    e.preventDefault();
    if (!title || !tags || !location || memberNumber === '인원수') {
      return alert('모든 항목은 필수입니다.');
    }
    const newRoom = await addRoomMutation.mutateAsync();
    alert('모임이 생성되었습니다.');
    resetTags();
    router.push(`/meetingRoom/${newRoom}`);
  };

  return (
    <>
      <Button onPress={onOpen} className="bg-violet-300 m-4">
        방 만들기
      </Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: 'easeOut'
              }
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: 'easeIn'
              }
            }
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">방 만들기</ModalHeader>
              <form onSubmit={(e) => addMeetingRoom(e)}>
                <ModalBody>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" maxLength={15} />
                  <TagList />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="place"
                    maxLength={15}
                  />
                  <select value={memberNumber} onChange={(e) => setMemberNumber(e.target.value)}>
                    <option> 인원수 </option>
                    <option> 2:2 </option>
                    <option> 3:3 </option>
                    <option> 4:4 </option>
                  </select>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose} onClick={() => cancelMakingMeetingRoom()}>
                    취소
                  </Button>
                  <Button type="submit" className="bg-violet-300" onPress={onClose}>
                    등록
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default MeetingRoomForm;
