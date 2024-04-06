'use client';

export default function Home() {
  return (
    <main>
      메인페이지 입니다.
      <div></div>
      <button onClick={() => location.replace('/test')}>test</button>
    </main>
  );
}
