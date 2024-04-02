'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';

import type { Database } from '(@/types/database.types)';
import TagList from './MeetingRoomFeatureTags';
import { useTagStore } from '(@/store/zustand)';
type MeetingRoom = Database['public']['Tables']['room']['Row'];

function EditMeetingRoom({ room }: { room: MeetingRoom }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState(room.room_title);
  const [location, setLocation] = useState(room.location);
  const [memberNumber, setMemberNumber] = useState(room.member_number);
  const { tags, resetTags } = useTagStore();

  const editMeetingRoom = async () => {
    if (!title || !tags || !location || memberNumber === '인원수') {
      return alert('모든 항목은 필수입니다.');
    }
    const { data, error } = await clientSupabase
      .from('room')
      .update({ room_title: title, feature: tags, location: location, member_number: memberNumber })
      .eq('room_id', room.room_id)
      .select();
  };

  const cancelMakingMeetingRoom = () => {
    setTitle('');
    setLocation('');
    setMemberNumber('');
    resetTags();
  };

  return (
    <>
      <Button onPress={onOpen} className="bg-purple-400">
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
