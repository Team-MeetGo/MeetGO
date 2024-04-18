import { chatStore } from '@/store/chatStore';
import { FaArrowCircleDown } from 'react-icons/fa';

const ChatScroll = ({ handleScrollDown }: { handleScrollDown: () => void }) => {
  const imgs = chatStore((state) => state.imgs);
  return (
    <>
      {!imgs.length && (
        <div className="absolute bottom-28 w-full" id="스크롤 내리는 버튼">
          <FaArrowCircleDown
            className="w-12 h-12 text-[#E4D4F4] mx-auto cursor-pointer hover:scale-105 transition-all ease-in-out animate-bounce"
            onClick={handleScrollDown}
          />
        </div>
      )}
    </>
  );
};

export default ChatScroll;
