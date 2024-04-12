'use client';
import { useAddRoom } from '(@/hooks/useMutation/useMeetingMutation)';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';
import { useRoomStore } from '(@/store/roomStore)';
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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MemberNumberSelection from './MemberNumberSelection';
import RegionSelection from './RegionSelection';

import type { NewRoomType } from '(@/types/roomTypes)';

function MeetingRoomForm() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { memberNumber, resetMemberNumber, roomRegion, resetRoomRegion } = useRoomStore((state) => state);
  const { data: user, isPending, isError, error } = useGetUserDataQuery();
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set([]));

  const cancelMakingMeetingRoom = () => {
    setTitle('');
    setLocation('');
    resetMemberNumber();
    resetRoomRegion();
    setSelected(new Set([]));
  };
  const favoriteArray = Array.from(selected);
  const user_id = user?.user_id!;
  const nextMeetingRoom: NewRoomType = {
    feature: favoriteArray,
    leader_id: String(user_id),
    location,
    region: String(roomRegion),
    member_number: String(memberNumber),
    room_status: '모집중',
    room_title: title
  };
  const addRoomMutation = useAddRoom({ nextMeetingRoom, user_id });

  const addMeetingRoom = async (e: any) => {
    e.preventDefault();
    if (!title || !selected || !location || memberNumber === '인원수' || !roomRegion) {
      return alert('모든 항목은 필수입니다.');
    }
    const data = await addRoomMutation.mutateAsync();
    alert('모임이 생성되었습니다.');
    setSelected(new Set([]));
    resetMemberNumber();
    resetRoomRegion();
    router.push(`/meetingRoom/${data}`);
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
      <Button onPress={onOpen} className="w-[92px] h-[51px] bg-mainColor text-white">
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
