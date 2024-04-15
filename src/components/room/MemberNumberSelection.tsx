'use client';
import { useRoomStore } from '@/store/roomStore';
import { useSearchRoomStore } from '@/store/searchRoomStore';
import { member_number } from '@/utils/MeetingRoomSelector';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useMemo, useRef, useState } from 'react';

function MemberNumberSelection({ text }: { text: string }) {
  const [selectedMemberKeys, setSelectedMemberKeys] = useState(new Set(['']));
  const conditionalRef = useRef(text);
  const selectedMemberValue = useMemo(
    () => Array.from(selectedMemberKeys).join(', ').replaceAll('_', ' '),
    [selectedMemberKeys]
  );
  const { setMemberNumber } = useRoomStore();
  const { setSelectMemberNumber } = useSearchRoomStore();

  useEffect(() => {
    if (conditionalRef.current === 'selectMember') {
      setSelectMemberNumber(selectedMemberValue);
    }
    if (conditionalRef.current === 'member') {
      setMemberNumber(selectedMemberValue);
    }
  }, [selectedMemberValue]);

  const handleSelectMember = (value: string) => {
    setSelectedMemberKeys(new Set(value));
  };

  return (
    <>
      <div className="w-full">
        <Select
          label="인원"
          aria-label="members"
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedMemberKeys}
          onSelectionChange={(value) => handleSelectMember(value as string)}
        >
          {member_number.map((member) => (
            <SelectItem key={member} value={member}>
              {member}
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  );
}

export default MemberNumberSelection;
