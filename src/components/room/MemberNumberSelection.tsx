'use client';
import { useRoomStore } from '@/store/roomStore';
import { useSearchRoomStore } from '@/store/searchRoomStore';
import { member_number } from '@/utils/MeetingRoomSelector';
import { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

function MemberNumberSelection({ text }: { text: string }) {
  const [member, setMember] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const conditionalRef = useRef(text);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { setMemberNumber } = useRoomStore();
  const { setSelectMemberNumber } = useSearchRoomStore();

  useEffect(() => {
    if (conditionalRef.current === 'selectMember') {
      setSelectMemberNumber(member);
    }
    if (conditionalRef.current === 'member') {
      setMemberNumber(member);
    }

    const outSideClickHandler = (e: any) => {
      const { target } = e;
      if (openModal && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpenModal(false);
      }
    };
    document.addEventListener('mousedown', outSideClickHandler);
  }, [member, openModal]);

  const memberNumberSelectionHandler = (member: string) => {
    setMember(member);
    setOpenModal(false);
  };

  return (
    <>
      <div className="relative bg-white z-50" ref={dropdownRef}>
        <button
          className="bg-white w-[120px] h-[43px] rounded-lg border-black border-[1px] text-[16px]"
          type="button"
          onClick={() => setOpenModal((openModal) => !openModal)}
        >
          <div className="flex flex-row justify-center align-middle">
            <IoIosArrowDown className="my-auto" />
          </div>
        </button>
        {openModal && (
          <ul className="absolute top-full p-[8px] bg-white rounded-md shadow-md mt-1 w-full">
            {member_number.map((m) => (
              <li
                key={m}
                onClick={() => memberNumberSelectionHandler(m)}
                className="px-[16px] py-[8px] cursor-pointer rounded-lg hover:bg-mainColor hover:text-white"
              >
                {m}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default MemberNumberSelection;
