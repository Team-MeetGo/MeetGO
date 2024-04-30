const MainBanner = () => {
  return (
    <main className="max-w-[1080px] w-full flex items-start max-h-[524px]">
      <div className="flex flex-col gap-8 px-6 py-24">
        <h1 className="font-bold text-6xl text-mainColor">
          벚꽃 축제는
          <br />
          가고 싶어.
          <br />
          누구랑 가요..?
        </h1>
        <p className="font-medium text-lg">
          학교 이메일로 인증만 한다면
          <br />
          당신도 미팅의 주인공이 될 수 있어요!
        </p>
        <button className="bg-mainColor text-white font-bold text-xl px-8 py-4 rounded-lg self-start">
          지금 바로 인연 만들러 가기
        </button>
      </div>
    </main>
  );
};

export default MainBanner;
