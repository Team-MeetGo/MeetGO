'use client';
import { favoriteOptions } from '(@/utils/FavoriteData)';
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
import { useUpdateRoom } from '(@/hooks/useMutation/useMeetingMutation)';

import type { MeetingRoomType, UpdateRoomType } from '(@/types/roomTypes)';
import RegionSelection from './RegionSelection';
import MemberNumberSelection from './MemberNumberSelection';
import { useRoomStore } from '(@/store/roomStore)';

function EditMeetingRoom({ room }: { room: MeetingRoomType }) {
  const { memberNumber, setMemberNumber, resetMemberNumber, roomRegion, setRoomRegion, resetRoomRegion } =
    useRoomStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState(room.room_title);
  const [location, setLocation] = useState(room.location);
  const [selected, setSelected] = useState<Set<string>>(new Set([]));
  const room_id = room.room_id;
  const favoriteArray = Array.from(selected);
  const editedMeetingRoom: UpdateRoomType = {
    title,
    favoriteArray,
    location,
    memberNumber: String(memberNumber),
    room_id,
    region: String(roomRegion)
  };
  const roomUpdateMutation = useUpdateRoom();

  const editMeetingRoom = async () => {
    if (!title || !selected || !location || memberNumber === '인원' || roomRegion === '지역') {
      alert('모든 항목은 필수입니다.');
    } else {
      await roomUpdateMutation.mutate(editedMeetingRoom);
      setTitle('');
      setLocation('');
      resetMemberNumber();
      resetRoomRegion();
      setSelected(new Set([]));
    }
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

  const handleSelect = (value: string[]) => {
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
        className="gap-0 p-0 m-0 h-4 w-4"
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
              <form onSubmit={() => editMeetingRoom()}>
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
                        onSelectionChange={(value) => handleSelect(value as string[])}
                      >
                        {favoriteOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(selected).map((value) => (
                        <Chip
                          key={value}
                          color="default"
                          style={{ backgroundColor: favoriteOptions.find((option) => option.value === value)?.color }}
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
