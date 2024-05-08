const LobbyBanner = () => {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-[24px] flex flex-col gap-12">
      <article className="h-40 flex flex-col justify-center items-center gap-4 py-auto">
        <h3 className="text-[#6F7785] mr-auto">사람을 찾습니다. 이번 주말에 뭐하세요?</h3>
        <h1 className="text-4xl font-extrabold mr-auto">미팅하기</h1>
      </article>
    </section>
  );
};

export default LobbyBanner;
