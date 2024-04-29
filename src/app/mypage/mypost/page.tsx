import MyPost from '@/components/mypage/MyPost';
import MypageLayout from '@/components/mypage/MypageLayout';
import React from 'react';

const page = () => {
  return (
    <MypageLayout>
      <MyPost />
    </MypageLayout>
  );
};

export default page;
