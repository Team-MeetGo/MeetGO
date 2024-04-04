import { Dispatch, SetStateAction } from 'react';

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
      <div
        className="w-40 h-12 flex bg-indigo-500 p-2 mx-auto rounded-md cursor-pointer"
        onClick={handleNewMsgAlertScroll}
      >
        <h1 className="mx-auto my-auto font-bold text-lg text-white">{newAddedMsgNum} New Message</h1>
      </div>
    </div>
  );
};

export default NewChatAlert;
