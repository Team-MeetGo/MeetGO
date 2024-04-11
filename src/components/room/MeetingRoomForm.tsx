'use client';
import TagList from './MeetingRoomFeatureTags';
import { useRoomStore } from '(@/store/roomStore)';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import { useAddRoom } from '(@/hooks/useMutation/useMeetingMutation)';
import { userStore } from '(@/store/userStore)';
import { useRouter } from 'next/navigation';

import type { NextMeetingRoomType } from '(@/types/roomTypes)';
import RegionSelection from './RegionSelection';
import MemberNumberSelection from './MemberNumberSelection';

function MeetingRoomForm() {
  const router = useRouter();
  const { tags, resetTags } = useRoomStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = userStore((state) => state);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const { memberNumber, resetMemberNumber, roomRegion, resetRoomRegion } = useRoomStore((state) => state);
  const cancelMakingMeetingRoom = () => {
    setTitle('');
    setLocation('');
    resetMemberNumber();
    resetRoomRegion();
    resetTags();
  };

  const user_id = user?.user_id!;
  const nextMeetingRoom: NextMeetingRoomType = {
    feature: tags,
    leader_id: String(user_id),
    location,
    region: String(roomRegion),
    member_number: memberNumber,
    room_status: '모집중',
    room_title: title
  };
  const addRoomMutation = useAddRoom({ nextMeetingRoom, user_id });

  const addMeetingRoom = async (e: any) => {
    e.preventDefault();
    if (!title || !tags || !location || memberNumber === '인원수' || !roomRegion) {
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
                  <div className="flex flex-row gap-4">
                    <MemberNumberSelection text={'member'} />
                    <div className="w-20">
                      <RegionSelection text={'room'} />
                    </div>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="place"
                      maxLength={15}
                    />
                  </div>
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
