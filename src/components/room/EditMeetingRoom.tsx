'use client';
import { useUpdateRoom } from '@/hooks/useMutation/useMeetingMutation';
import { useRoomStore } from '@/store/roomStore';
import { favoriteOptions } from '@/utils/FavoriteData';
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure
} from '@nextui-org/react';
import { useState } from 'react';
import MemberNumberSelection from './MemberNumberSelection';
import RegionSelection from './RegionSelection';

import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import type { MeetingRoomType, UpdateRoomType } from '@/types/roomTypes';

function EditMeetingRoom({ room }: { room: MeetingRoomType }) {
  const { data: user } = useGetUserDataQuery();
  const user_id = user?.user_id;
  const { memberNumber, setMemberNumber, resetMemberNumber, roomRegion, setRoomRegion, resetRoomRegion } =
    useRoomStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState(room.room_title);
  const [location, setLocation] = useState(room.location);
  const [selected, setSelected] = useState<Set<string>>(new Set([]));
  const room_id = room.room_id;
  const favoriteArray = Array.from(selected);
  const editedMeetingRoom: UpdateRoomType = {
    room_title: title,
    feature: favoriteArray,
    location,
    member_number: String(memberNumber),
    room_id,
    region: String(roomRegion)
  };
  const roomUpdateMutation = useUpdateRoom({ editedMeetingRoom, user_id });

  const editMeetingRoom = async (e: any) => {
    e.preventDefault();
    if (!title || !selected || !location || memberNumber === '인원' || roomRegion === '지역') {
      alert('모든 항목은 필수입니다.');
      return;
    }
    await roomUpdateMutation.mutateAsync();
    setTitle('');
    setLocation('');
    resetMemberNumber();
    resetRoomRegion();
    setSelected(new Set([]));
  };

  const cancelMakingMeetingRoom = () => {
    setTitle('');
    setLocation('');
    resetMemberNumber();
    resetRoomRegion();
    setSelected(new Set([]));
  };

  const beforeData = () => {
    setMemberNumber(room.member_number);
    setRoomRegion(room.region);
    setSelected(new Set(room.feature));
  };

  const handleSelect = (value: string) => {
    if (selected.size > 5) {
      alert('최대 5개까지 선택 가능합니다.');
      return;
    }
    setSelected(new Set(value));
  };

  const handleDelete = (value: string) => {
    const newSelected = new Set(selected);
    newSelected.delete(value);
    setSelected(newSelected);
  };

  return (
    <>
      <Button
        onClick={() => {
          beforeData();
        }}
        onPress={onOpen}
        className="gap-0 p-0 m-0 h-[31px] w-[76px] bg-mainColor text-white text-[16px] rounded-xl"
      >
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
              <form onSubmit={(e: any) => editMeetingRoom(e)}>
                <ModalBody>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" maxLength={15} />
                  <div className="flex w-full max-w-xs flex-col gap-2">
                    <label>방의 컨셉을 골라주세요!</label>
                    <div className="flex whitespace-nowrap">
                      <Select
                        label="방의 특성(최대 5개)"
                        selectionMode="multiple"
                        variant="bordered"
                        selectedKeys={selected}
                        className="max-w-xs"
                        aria-label="방의 특성"
                        onSelectionChange={(value) => handleSelect(value as string)}
                      >
                        {favoriteOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="text-[14px] flex flex-row gap-[8px]">
                      {Array.from(selected).map((value) => (
                        <Chip
                          key={value}
                          color="default"
                          style={{ backgroundColor: '#F2EAFA', color: '#8F5DF4', borderRadius: '8px' }}
                          onClose={() => handleDelete(value)}
                        >
                          {value}
                        </Chip>
                      ))}
                    </div>
                  </div>
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
