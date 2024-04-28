const MainBottomBanner = () => {
  return (
    <section className="w-full h-28 bg-mainColor flex justify-center items-center px">
      <div className="w-4/6 flex justify-between">
        <div>
          <p>지금 대학생 이메일 인증하면,</p>
          <p>나를 설레게하는 캠퍼스 인연들을 만날 수 있어요</p>
        </div>
        <button>회원가입하러가기</button>
      </div>
      {/* <p className="text-[30px] text-white mr-[60px]">현재 많은 인연들이 기다리고 있어요!</p> */}
      {/* <Link
      className="bg-transparant border-1 rounded-xl border-white max-w-[267px] h-[60px] text-[18px] text-white pt-[13px] pb-[13px] pl-[60px] pr-[60px] hover:bg-white hover:text-mainColor font-bold"
      href="/meetingRoom"
    >
      로비로 바로가기
    </Link> */}
      {/* </div> */}
    </section>
  );
};

export default MainBottomBanner;
