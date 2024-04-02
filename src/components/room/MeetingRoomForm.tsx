'use client';
import { useTagStore } from '(@/store/zustand)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import TagList from './MeetingRoomFeatureTags';

import type { Database } from '(@/types/database.types)';
type NextMeetingRoomType = Database['public']['Tables']['room']['Insert'];

function MeetingRoomForm() {
  const { tags, resetTags } = useTagStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [memberNumber, setMemberNumber] = useState('');

  const nextMeetingRoom: NextMeetingRoomType = {
    feature: tags,
    going_chat: false,
    leader_id: '1a083af9-53f5-42b3-88e9-2f7d3a19a9b0', // 이후 로그인된 유저 아이디로 대체될 예정입니다.
    location,
    member_number: memberNumber,
    room_status: '모집중',
    room_title: title
  };

  const cancelMakingMeetingRoom = () => {
    setTitle('');
    setLocation('');
    setMemberNumber('');
    resetTags();
  };

  const addMeetingRoom = async () => {
    if (!title || !tags || !location || memberNumber === '인원수') {
      return alert('모든 항목은 필수입니다.');
    }

    const { data: insertMeetingRoom, error: insertMeetingRoomError } = await clientSupabase
      .from('room')
      .insert([nextMeetingRoom])
      .select();

    if (insertMeetingRoomError) {
      console.log(insertMeetingRoomError);
      return;
    }
    alert('모임이 생성되었습니다.');
  };
  console.log(...tags);
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
              <form onSubmit={() => addMeetingRoom()}>
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
