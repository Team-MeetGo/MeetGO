import { useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { chatStore } from '@/store/chatStore';
import { UsersType } from '@/types/userTypes';
import { Avatar } from '@nextui-org/react';
import { FaCrown } from 'react-icons/fa6';
import { IoFemale, IoMale } from 'react-icons/io5';

const ShowChatMember = ({ person }: { person: UsersType }) => {
  const chatRoomId = chatStore((state) => state.chatRoomId);
  const { leader_id } = useRoomDataQuery(chatRoomId as string);
  return (
    <>
      <div className="w-72 h-80 flex flex-col rounded-md p-3 justify-evenly relative">
        <div className="w-full flex flex-col items-center justify-center gap-4 relative">
          <Avatar src={person.avatar as string} className="w-24 h-24" />
          <p className="text-xl font-medium">{person.nickname as string}</p>
          {person.user_id === leader_id && (
            <div className="absolute top-[-1.5rem] right-2/5">
              <FaCrown className="fill-mainColor w-8 h-8" />
            </div>
          )}
        </div>
        <div className="flex text-base justify-center items-center gap-0.5 mb-2">
          <p className="mb-2">{person.school_name}</p>
          <p>
            {person.gender === 'male' ? (
              <IoMale className="w-[16px] fill-blue mb-2" />
            ) : (
              <IoFemale className="w-[16px] fill-hotPink mb-2" />
            )}
          </p>
        </div>
        <div className="w-full flex gap-2 justify-center">
          {person.favorite?.map((fav) => (
            <div
              key={fav}
              className="p-1 w-20 h-7 rounded-xl color: text-mainColor bg-purpleSecondary flex items-center justify-center text-sm"
            >
              {fav}
            </div>
          ))}
        </div>
        <div className="flex text-base justify-center">
          <pre>{person.intro}</pre>
        </div>
      </div>
    </>
  );
};

export default ShowChatMember;
