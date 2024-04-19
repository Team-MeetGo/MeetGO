'use client';
import { useRoomStore } from '@/store/roomStore';
import { useSearchRoomStore } from '@/store/searchRoomStore';
import { regionList } from '@/utils/MeetingRoomSelector';
import { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

function RegionSelection({ text }: { text: string }) {
  const conditionalRef = useRef(text);
  const [openModal, setOpenModal] = useState(false);
  const [region, setRegion] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setRoomRegion } = useRoomStore();
  const { setSelectRegion } = useSearchRoomStore();

  useEffect(() => {
    if (conditionalRef.current === 'selectRegion') {
      setSelectRegion(region);
    }
    if (conditionalRef.current === 'room') {
      setRoomRegion(region);
    }
    const outSideClick = (e: any) => {
      const { target } = e;
      if (openModal && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpenModal(false);
      }
    };
    document.addEventListener('mousedown', outSideClick);
  }, [region, openModal]);

  const handleSelect = (r: string) => {
    setRegion(r);
    setOpenModal(false);
  };

  return (
    <>
      <div className="relative z-50 bg-white" ref={dropdownRef}>
        <button
          className="bg-white w-[120px] h-[43px] rounded-lg border-black border-[1px] text-[16px]"
          type="button"
          onClick={() => setOpenModal((openModal) => !openModal)}
        >
          <div className="flex flex-row justify-center align-middle">
            {region ? region : '지역'}
            <IoIosArrowDown className="my-auto" />
          </div>
        </button>
        {openModal && (
          <div className="absolute top-full h-[180px] p-[8px] overflow-y-auto bg-white rounded-md shadow-md mt-1 w-full">
            {regionList.map((m) => (
              <li
                key={m}
                onClick={() => handleSelect(m)}
                className="px-[16px] py-[8px] cursor-pointer rounded-lg hover:bg-mainColor hover:text-white list-none	"
              >
                {m}
              </li>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default RegionSelection;
