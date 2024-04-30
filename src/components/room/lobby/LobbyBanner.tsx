import React from 'react';

function LobbyBanner() {
  return (
    <div className="w-full max-w-[1080px] mx-auto px-[24px] flex flex-col gap-12">
      <header className="h-40 flex flex-col justify-center items-center gap-4 py-auto">
        <p className="text-[#6F7785] mr-auto">사람을 찾습니다. 이번 주말에 뭐하세요?</p>
        <h1 className="text-4xl font-extrabold mr-auto">미팅하기</h1>
      </header>
    </div>
  );
}

export default LobbyBanner;
