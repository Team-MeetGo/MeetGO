'use client';
import { useRoomStore } from '@/store/roomStore';
import { useSearchRoomStore } from '@/store/searchRoomStore';
import { regionList } from '@/utils/data/MeetingRoomSelector';
import { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

function RegionSelection({ text }: { text: string }) {
  const [openModal, setOpenModal] = useState(false);
  const [region, setRegion] = useState('전국');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const conditionalRef = useRef(text);

  const { setRoomRegion } = useRoomStore();
  const { setSelectRegion } = useSearchRoomStore();

  useEffect(() => {
    if (conditionalRef.current === 'selectRegion') {
      setSelectRegion(region);
    }
    if (conditionalRef.current === 'room') {
      setRoomRegion(region);
    }
    const outSideClickHandler = (e: any) => {
      const { target } = e;
      if (openModal && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpenModal(false);
      }
    };
    document.addEventListener('mousedown', outSideClickHandler);
  }, [region, openModal]);

  const regionSelectionHandler = (r: string) => {
    setRegion(r);
    setOpenModal(false);
  };

  return (
    <>
      <article className="relative bg-white" ref={dropdownRef}>
        <button
          className="bg-white w-[120px] h-[43px] rounded-lg border-gray2 border text-[16px]"
          type="button"
          onClick={() => setOpenModal((openModal) => !openModal)}
        >
          <figure className="flex flex-row justify-center align-middle gap-[8px]">
            {region}
            <IoIosArrowDown className="my-auto" />
          </figure>
        </button>
        {openModal && (
          <figure className="absolute top-full h-[180px] p-[8px] overflow-y-auto bg-white rounded-md shadow-md mt-1 w-full">
            {regionList.map((m) => (
              <li
                key={m}
                onClick={() => regionSelectionHandler(m)}
                className="px-[16px] py-[8px] cursor-pointer rounded-lg hover:bg-mainColor hover:text-white list-none	"
              >
                {m}
              </li>
            ))}
          </figure>
        )}
      </article>
    </>
  );
}

export default RegionSelection;
