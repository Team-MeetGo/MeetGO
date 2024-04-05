'use client';

import { signOut } from '(@/utils/api/authAPI)';

export default function Home() {
  return (
    <main>
      메인페이지 입니다.
      <div>
        <button onClick={signOut}>임시 로그아웃</button>
      </div>
    </main>
  );
}
