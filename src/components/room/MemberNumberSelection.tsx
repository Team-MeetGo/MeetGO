'use client';
import { useRoomStore } from '(@/store/roomStore)';
import { useSearchRoomStore } from '(@/store/searchRoomStore)';
import { member_number } from '(@/utils/MeetingRoomSelector)';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useEffect, useMemo, useRef, useState } from 'react';

function MemberNumberSelection({ text }: { text: string }) {
  const [selectedMemberKeys, setSelectedMemberKeys] = useState(new Set(['인원']));
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

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" className="capitalize">
            {selectedMemberValue}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Single selection example"
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedMemberKeys}
          onSelectionChange={setSelectedMemberKeys}
        >
          {member_number.map((member) => (
            <DropdownItem key={member}>{member}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}

export default MemberNumberSelection;
