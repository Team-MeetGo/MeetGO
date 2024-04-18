import { UsersType } from '@/types/userTypes';
import { Avatar } from '@nextui-org/react';
import { IoFemale, IoMale } from 'react-icons/io5';

const ShowChatMember = ({ person }: { person: UsersType }) => {
  return (
    <>
      <div className="w-72 h-80 flex flex-col rounded-md p-3 justify-evenly relative">
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <Avatar src={person.avatar as string} className="w-24 h-24" />
          <p className="text-xl font-medium">{person.nickname as string}</p>
        </div>
        <div className="flex text-base justify-center items-center gap-0.5">
          <p className="mb-2">{person.school_name}</p>
          <p>
            {person.gender === 'male' ? (
              <IoMale className="w-[16px] fill-blue" />
            ) : (
              <IoFemale className="w-[16px] fill-hotPink" />
            )}
          </p>
        </div>
        <div className="w-full flex gap-2 justify-center">
          {person.favorite?.map((fav) => (
            <div
              key={fav}
              className="p-1 w-16 h-7 rounded-xl color: text-mainColor bg-purpleSecondary flex items-center justify-center text-"
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
