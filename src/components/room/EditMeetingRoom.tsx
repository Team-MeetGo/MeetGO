'use client';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import TagList from './MeetingRoomFeatureTags';
import { useRoomStore } from '(@/store/roomStore)';
import { useUpdateRoom } from '(@/hooks/useMutation/useMeetingMutation)';

import type { MeetingRoomType } from '(@/types/roomTypes)';

function EditMeetingRoom({ room }: { room: MeetingRoomType }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState(room.room_title);
  const [location, setLocation] = useState(room.location);
  const [memberNumber, setMemberNumber] = useState(room.member_number);
  const { tags, resetTags } = useRoomStore();
  const room_id = room.room_id;
  const roomUpdateMutation = useUpdateRoom({ title, tags, location, memberNumber, room_id });

  const editMeetingRoom = async () => {
    if (!title || !tags || !location || memberNumber === '인원수') {
      return alert('모든 항목은 필수입니다.');
    }
    roomUpdateMutation.mutateAsync();
  };

  const cancelMakingMeetingRoom = () => {
    setTitle('');
    setLocation('');
    setMemberNumber('');
    resetTags();
  };

  return (
    <>
      <Button onPress={onOpen} className="gap-0 p-0 m-0 h-4 w-4">
        수정
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
              <ModalHeader className="flex flex-col gap-1">방 내용 수정</ModalHeader>
              <form onSubmit={() => editMeetingRoom()}>
                <ModalBody>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" maxLength={15} />
                  <TagList />
                  feature :{tags}
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
                    수정
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

export default EditMeetingRoom;
