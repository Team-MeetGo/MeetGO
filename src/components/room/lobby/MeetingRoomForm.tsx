'use client';

import { useRoomStore } from '@/store/roomStore';
import { ROOMSTATUS, ROUTERADDRESS } from '@/utils/constant';
import { meetingRoomFeatureData } from '@/utils/data/MeetingRoomFeatureData';
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
import { customErrToast, customSuccessToast } from '../../common/customToast';
import MemberNumberSelection from '../MemberNumberSelection';
import RegionSelection from '../RegionSelection';

import type { NewRoomType } from '@/types/roomTypes';
import { useGetUserDataQuery } from '@/query/useQueries/useUserQuery';
import { useAddRoomMutation } from '@/query/useMutation/useMeetingMutation';
const MeetingRoomForm = () => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { memberNumber, resetMemberNumber, roomRegion, resetRoomRegion } = useRoomStore((state) => state);
  const { data: user } = useGetUserDataQuery();

  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set([]));
  const userId = user?.user_id!;
  const { mutateAsync: addRoomMutation } = useAddRoomMutation(userId);

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
    if (!title || !selected || !location || !roomRegion || !selected) {
      customErrToast('모든 항목은 필수입니다.');
    } else if (title && selected && location && roomRegion && selected) {
      const data = await addRoomMutation({ nextMeetingRoom, userId });
      customSuccessToast('모임이 생성되었습니다.');
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
      customErrToast('성별을 선택해주세요');
      return router.push('/mypage');
    } else {
      onOpen();
    }
  };
  return (
    <>
      <Button
        onPress={roomOpenHandler}
        className="lg:w-[144px] w-[5rem] lg:h-[44px] h-[3rem] text-[15px] bg-mainColor text-white"
      >
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
        <ModalContent className="my-auto">
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
                    <div className="flex whitespace-nowrap z-[3]">
                      <Select
                        label="방의 컨셉"
                        selectionMode="single"
                        variant="bordered"
                        selectedKeys={selected}
                        className="max-w-xs"
                        aria-label="방의 특성"
                        onSelectionChange={(value) => roomFeatureSelectHandler(value as string)}
                      >
                        {meetingRoomFeatureData.map((option: any) => (
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
};

export default MeetingRoomForm;
