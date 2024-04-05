import { userStore } from '(@/store/userStore)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Avatar, avatar } from '@nextui-org/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const AvatarForm = () => {
  const { user, setUser } = userStore((state) => state);
  const [file, setFile] = useState(null as File | null);

  const onFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const uploadAvatar = async () => {
    const userId = user && user[0].user_id;
    if (!userId) return;
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `avatar.${fileExt}`; // 사용자별 폴더 내에 저장될 파일 이름
    const filePath = `${userId}/${fileName}`; // 'userId/avatarImg/' 폴더 안에 파일 저장

    // 파일을 Supabase Storage에 업로드
    let { error: uploadError } = await clientSupabase.storage.from('avatarImg').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return;
    }

    // 업로드한 파일의 URL을 가져옴
    const { data } = clientSupabase.storage.from('avatarImg').getPublicUrl(filePath);

    const publicURL = data.publicUrl;

    // 사용자 프로필을 업데이트하여 새 프로필 사진 URL을 참조하도록 함
    const { error } = await clientSupabase.from('users').update({ avatar: publicURL }).eq('user_id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
    } else {
      // 사용자 상태 업데이트 - 스토어를 업데이트 해야 됨
      if (user && user.length > 0) {
        setUser([{ ...user[0], avatar: publicURL }]);
        alert('프로필 사진이 업데이트되었습니다.');
      } else {
        console.error('User data is null or empty.');
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <input type="file" onChange={onFileChange} accept="image/*" />
      {user && user[0].avatar ? (
        <>
          <div className="w-[150px] h-[150px] overflow-hidden flex justify-center items-center rounded-full">
            <Image
              src={`${user[0].avatar}?${new Date().getTime()}`}
              alt="Avatar"
              className=""
              style={{ objectFit: 'cover' }}
              width={200}
              height={200}
              priority={true}
            />
          </div>
          <button className="text-xs" onClick={uploadAvatar}>
            사진 수정
          </button>
        </>
      ) : (
        <>
          <Avatar className="w-32 h-32" />
          <button className="text-xs" onClick={uploadAvatar}>
            사진 등록
          </button>
        </>
      )}
    </div>
  );
};

export default AvatarForm;
