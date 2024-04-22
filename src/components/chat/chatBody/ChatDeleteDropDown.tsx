import { Message } from '@/types/chatTypes';
import { clientSupabase } from '@/utils/supabase/client';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { CiMenuKebab } from 'react-icons/ci';

const ChatDeleteDropDown = ({ msg }: { msg: Message }) => {
  const handleDeleteMessage = async (key: string) => {
    if (key === 'delete') {
      console.log('드롭다운 작동?');
      const { error: messageTableErr } = await clientSupabase
        .from('messages')
        .delete()
        .eq('message_id', msg?.message_id);
      messageTableErr && alert('채팅 삭제 중 오류가 발생하였습니다.');
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button>
          <CiMenuKebab className="my-auto w-6 h-6 rotate-90" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" onAction={(key) => handleDeleteMessage(String(key))}>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
export default ChatDeleteDropDown;
