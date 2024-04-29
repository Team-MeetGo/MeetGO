import Link from 'next/link';

const MypageBottomBanner = () => {
  return (
    <>
      <section className="w-full h-20 bg-mainColor flex justify-center items-center px-3">
        <div className="w-full max-w-[1080px] flex justify-between gap-6">
          <div className="text-white">
            <p className="font-thin text-lg">아직 미팅 안 해보셨어요?</p>
            <p className="text-lg">
              소중한 인연들을 <span className="font-thin text-lg">놓치지 마세요.</span>
            </p>
          </div>
          <Link
            className="bg-white rounded-xl max-w-52 px-7 h-12 text-secondMainColor text-base font-semibold my-auto flex justify-center items-center hover:bg-opacity-90 break-keep"
            href="/meetingRoom"
          >
            미팅하러 가기
          </Link>
        </div>
      </section>
    </>
  );
};

export default MypageBottomBanner;
