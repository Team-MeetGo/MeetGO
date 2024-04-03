import { FaArrowCircleDown } from 'react-icons/fa';

const ChatScroll = ({ handleScrollDown }: { handleScrollDown: () => void }) => {
  return (
    <div className="absolute bottom-28 w-full" id="스크롤 내리는 버튼">
      <FaArrowCircleDown
        className="w-12 h-12 mx-auto cursor-pointer hover:scale-105 transition-all ease-in-out"
        onClick={handleScrollDown}
      />
    </div>
  );
};

export default ChatScroll;
