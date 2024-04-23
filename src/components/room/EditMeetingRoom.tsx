'use client';
import MemberNumberSelection from '@/components/room/MemberNumberSelection';
import RegionSelection from '@/components/room/RegionSelection';
import { useUpdateRoom } from '@/hooks/useMutation/useMeetingMutation';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
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

import type { MeetingRoomType, UpdateRoomType } from '@/types/roomTypes';
function EditMeetingRoom({
  room,
  dropdownRef,
  setOpen
}: {
  room: MeetingRoomType;
  dropdownRef: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: user } = useGetUserDataQuery();
  const userId = user?.user_id;
  const { memberNumber, setMemberNumber, roomRegion, setRoomRegion } = useRoomStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState(room.room_title);
  const [location, setLocation] = useState(room.location);
  const [selected, setSelected] = useState<Set<string>>(new Set([]));
  const roomId = room.room_id;
  const favoriteArray = Array.from(selected);
  //수정된 미팅룸 설정
  const editedMeetingRoom: UpdateRoomType = {
    room_title: title,
    feature: favoriteArray,
    location,
    member_number: String(memberNumber),
    room_id: roomId,
    region: String(roomRegion)
  };
  //미팅룸 업데이트
  const { mutate: roomUpdateMutation } = useUpdateRoom({ editedMeetingRoom, userId });
  const editMeetingRoom = async (e: any) => {
    e.preventDefault();
    setOpen(false);
    if (!title || !selected || !location) {
      alert('모든 항목은 필수입니다.');
    } else if (title && selected && location && roomRegion) {
      roomUpdateMutation();
    }
  };
  //수정전 데이터 불러오기
  const beforeData = () => {
    setMemberNumber(room.member_number);
    setRoomRegion(room.region);
    setSelected(new Set(room.feature));
  };
  //방 컨셉을 선택합니다.
  const handleSelect = (value: string) => {
    if (selected.size > 4) {
      alert('최대 4개까지 선택 가능합니다.');
      return;
    }
    setSelected(new Set(value));
  };
  //방 컨셉을 삭제합니다.
  const handleDelete = (value: string) => {
    const newSelected = new Set(selected);
    newSelected.delete(value);
    setSelected(newSelected);
  };
  return (
    <>
      <Button
        onClick={beforeData}
        onPress={onOpen}
        className="gap-0 p-0 m-0 h-[31px] w-[76px] bg-white hover:bg-mainColor hover:text-white text-[16px] rounded-xl"
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
            <div ref={dropdownRef}>
              <ModalHeader className="flex flex-col gap-1">방 내용 수정</ModalHeader>
              <form onSubmit={(e) => editMeetingRoom(e)}>
                <ModalBody>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" maxLength={15} />
                  <div className="flex flex-col gap-4">
                    <section className="flex flex-row gap-4">
                      <MemberNumberSelection text={'member'} />
                      <RegionSelection text={'room'} />
                    </section>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="자세한 주소 (15자 이내)"
                      maxLength={15}
                    />
                  </div>
                  <section className="flex w-full max-w-xs flex-col gap-2">
                    <label>방의 컨셉을 골라주세요!</label>
                    <figure className="flex whitespace-nowrap">
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
                    </figure>
                    <figure className="text-[14px] flex flex-row gap-[8px]">
                      {Array.from(selected).map((value) => (
                        <Chip
                          key={value}
                          className="bg-purpleSecondary text-mainColor rounded-[8px]"
                          onClose={() => handleDelete(value)}
                        >
                          {value}
                        </Chip>
                      ))}
                    </figure>
                  </section>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={() => setOpen(false)} color="danger" variant="light" onPress={onClose}>
                    취소
                  </Button>
                  <Button type="submit" className="bg-violet-300" onPress={onClose}>
                    수정
                  </Button>
                </ModalFooter>
              </form>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditMeetingRoom;
