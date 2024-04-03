import { Message } from '(@/types/chatTypes)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { Dispatch, SetStateAction } from 'react';
import { CiMenuKebab } from 'react-icons/ci';

const ChatDeleteDropDown = ({
  msg,
  messages,
  setHasMore
}: {
  msg: Message;
  messages: Message[];
  setHasMore: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleDeleteMessage = async () => {
    const { error } = await clientSupabase.from('messages').delete().eq('message_id', msg.message_id);
    if (error) alert('채팅 삭제 중 오류가 발생하였습니다.');
    if (messages.length === 0) {
      setHasMore(false);
    }
  };
  return (
    <Dropdown>
      <DropdownTrigger>
        <button>
          <CiMenuKebab className="my-auto w-6 h-6 rotate-90" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="delete" className="text-danger" color="danger" onClick={handleDeleteMessage}>
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
export default ChatDeleteDropDown;
