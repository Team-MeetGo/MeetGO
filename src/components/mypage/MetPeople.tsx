import { userStore } from '(@/store/userStore)';

const MetPeople = () => {
  const { user, setUser } = userStore((state) => state);

  // 내 user[0].user_id가 들어가있던 room_id를 가져와서
  // 그 room_id에 있는 user list (user_id)를 가져오고
  // 거기서 나와 성별이 다른 사람들을 가져와서
  // 그 유저들의 정보를 가져와서 보여준다.

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">스쳐간 인연 리스트</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-2" />
          <p className="text-sm">닉네임</p>
          <button className="text-xs">카톡ID요청하기</button>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-2" />
          <p className="text-sm">닉네임</p>
          <button className="text-xs">카톡ID요청하기</button>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-2" />
          <p className="text-sm">닉네임</p>
          <button className="text-xs">카톡ID요청하기</button>
        </div>
      </div>
    </div>
  );
};

export default MetPeople;
