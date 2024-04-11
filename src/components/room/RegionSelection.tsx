'use client';
import { useRoomStore } from '(@/store/roomStore)';
import { useSearchRoomStore } from '(@/store/searchRoomStore)';
import { regionList } from '(@/utils/MeetingRoomSelector)';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useEffect, useMemo, useRef, useState } from 'react';

function RegionSelection({ text }: { text: string }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['지역']));
  const selectedValue = useMemo(() => Array.from(selectedKeys).join(', ').replaceAll('_', ' '), [selectedKeys]);
  const conditionalRef = useRef(text);
  const { setRoomRegion } = useRoomStore();
  const { setSelectRegion } = useSearchRoomStore();

  useEffect(() => {
    if ((conditionalRef.current = 'selectRegion')) {
      setSelectRegion(selectedValue);
    }
    if ((conditionalRef.current = 'room')) {
      setRoomRegion(selectedValue);
    }
  }, [selectedValue]);

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" className="capitalize">
            {selectedValue}
          </Button>
        </DropdownTrigger>
        <div className="max-h-40 overflow-y-scroll overflow-scroll flex-wrap">
          <DropdownMenu
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            {regionList.map((region) => (
              <DropdownItem key={region}>{region}</DropdownItem>
            ))}
          </DropdownMenu>
        </div>
      </Dropdown>
    </>
  );
}

export default RegionSelection;
