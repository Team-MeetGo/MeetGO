import Link from 'next/link';

const LobbyBanner = () => {
  return (
    <section className="w-full h-14 bg-mainColor flex justify-center px-3">
      <div className="w-full max-w-[1080px] flex justify-between items-center gap-6">
        <div className="text-white">
          <p className="font-thin text-lg">
            <span className="text-lg">실시간 미팅후기가</span> 궁금하다면?
          </p>
        </div>
        <Link
          className="bg-white rounded-md max-w-52 px-7 h-9 text-secondMainColor text-base font-semibold my-auto flex justify-center items-center hover:bg-opacity-90 break-keep"
          href="/review/pageNumber/1"
        >
          후기보러 가기
        </Link>
      </div>
    </section>
  );
};

export default LobbyBanner;
