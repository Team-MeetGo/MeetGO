'use client';
import { member_number, regionList } from '(@/utils/MeetingRoomSelector)';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useMemo, useState } from 'react';

function RegionSelection() {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['모든 지역']));
  const [selectedMemberKeys, setSelectedMemberKeys] = useState(new Set(['모든 인원']));

  const selectedValue = useMemo(() => Array.from(selectedKeys).join(', ').replaceAll('_', ' '), [selectedKeys]);
  console.log('selectedKeys', selectedKeys);
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" className="capitalize">
            {selectedValue}
          </Button>
        </DropdownTrigger>
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
      </Dropdown>

      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" className="capitalize">
            {selectedMemberKeys}
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

export default RegionSelection;
