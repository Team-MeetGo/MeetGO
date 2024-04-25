'use client';
import { useAddRoomMutation } from '@/hooks/useMutation/useMeetingMutation';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useRoomStore } from '@/store/roomStore';
import { meetingRoomFeatureData } from '@/utils/MeetingRoomFeatureData';
import { ROOMSTATUS, ROUTERADDRESS } from '@/utils/constant';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MemberNumberSelection from './MemberNumberSelection';
import RegionSelection from './RegionSelection';

import type { NewRoomType } from '@/types/roomTypes';
function MeetingRoomForm() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { memberNumber, resetMemberNumber, roomRegion, resetRoomRegion } = useRoomStore((state) => state);
  const { data: user } = useGetUserDataQuery();

  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set([]));
  const { mutateAsync: addRoomMutation } = useAddRoomMutation();

  const userId = user?.user_id!;

  const favoriteArray = Array.from(selected);
  const nextMeetingRoom: NewRoomType = {
    feature: favoriteArray,
    leader_id: userId,
    location,
    region: String(roomRegion),
    member_number: String(memberNumber),
    room_status: ROOMSTATUS.RECRUITING,
    room_title: title
  };

  const addMeetingRoom = async (e: any) => {
    e.preventDefault();
    if (!title || !selected || !location || !roomRegion) {
      alert('모든 항목은 필수입니다.');
    } else if (title && selected && location && roomRegion) {
      const data = addRoomMutation({ nextMeetingRoom, userId });
      alert('모임이 생성되었습니다.');
      setSelected(new Set([]));
      resetMemberNumber();
      resetRoomRegion();
      router.push(`${ROUTERADDRESS.GOTOLOBBY}/${data}`);
    }
  };

  //방 컨셉을 선택합니다.
  const roomFeatureSelectHandler = (value: string) => {
    setSelected(new Set(value));
  };

  //방만들기 모달을 누릅니다.
  const roomOpenHandler = () => {
    if (!user?.gender) {
      alert('성별을 선택해주세요');
      return router.push('/mypage');
    } else {
      onOpen();
    }
  };
  return (
    <>
      <Button onPress={roomOpenHandler} className="w-[92px] h-[51px] bg-mainColor text-white">
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
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="방 제목 (15자 이내)"
                    maxLength={15}
                    className="border-gray2 border-b-2"
                  />
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4">
                      <MemberNumberSelection text={'member'} />
                      <div>
                        <RegionSelection text={'room'} />
                      </div>
                    </div>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="자세한 주소 (15자 이내)"
                      maxLength={15}
                      className="border-gray2 border-b-2"
                    />
                  </div>
                  <div className="flex w-full max-w-xs flex-col gap-2">
                    <label>방의 컨셉을 골라주세요!</label>
                    <div className="flex whitespace-nowrap">
                      <Select
                        label="방의 컨셉"
                        selectionMode="single"
                        variant="bordered"
                        selectedKeys={selected}
                        className="max-w-xs"
                        aria-label="방의 특성"
                        onSelectionChange={(value) => roomFeatureSelectHandler(value as string)}
                      >
                        {meetingRoomFeatureData.map((option) => (
                          <SelectItem key={option}>{option}</SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    취소
                  </Button>
                  <Button
                    type="submit"
                    className="bg-violet-300"
                    onPress={!title || !selected || !location || !roomRegion ? onOpen : onClose}
                  >
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
