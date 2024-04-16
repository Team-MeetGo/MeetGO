import { Dispatch, SetStateAction } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const NewChatAlert = ({
  newAddedMsgNum,
  handleScrollDown,
  setNewAddedMsgNum
}: {
  newAddedMsgNum: number;
  handleScrollDown: () => void;
  setNewAddedMsgNum: Dispatch<SetStateAction<number>>;
}) => {
  const handleNewMsgAlertScroll = () => {
    handleScrollDown();
    setNewAddedMsgNum(0);
  };

  return (
    <div className="absolute bottom-28 w-full">
      <div className="flex mx-auto w-full cursor-pointer" onClick={handleNewMsgAlertScroll}>
        <div className="flex gap-[6px] mx-auto my-auto px-[16px] py-[14px] bg-[#F2EAFA] rounded-lg font-bold text-lg text-mainColor font-semibold">
          <div className="my-auto">
            <FaChevronDown />
          </div>
          <h1>{newAddedMsgNum} New Message</h1>
        </div>
      </div>
    </div>
  );
};

export default NewChatAlert;
