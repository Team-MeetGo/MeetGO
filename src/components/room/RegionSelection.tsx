'use client';
import { useRoomStore } from '@/store/roomStore';
import { useSearchRoomStore } from '@/store/searchRoomStore';
import { regionList } from '@/utils/MeetingRoomSelector';
import { Button, Dropdown, SelectItem, DropdownMenu, DropdownTrigger, Select } from '@nextui-org/react';
import { useEffect, useMemo, useRef, useState } from 'react';

function RegionSelection({ text }: { text: string }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['']));
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

  const handleRegion = (value: string) => {
    setSelectedKeys(new Set(value));
  };

  return (
    <>
      <div className="w-full">
        <Select
          label="지역"
          aria-label="region"
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={(value) => handleRegion(value as string)}
        >
          {regionList.map((region) => (
            <SelectItem key={region} value={region}>
              {region}
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  );
}

export default RegionSelection;
