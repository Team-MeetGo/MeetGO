import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { CiMenuKebab } from 'react-icons/ci';

const ChatDropDownMenu = () => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <button>
          <CiMenuKebab className="my-auto w-6 h-6 rotate-90" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ChatDropDownMenu;
