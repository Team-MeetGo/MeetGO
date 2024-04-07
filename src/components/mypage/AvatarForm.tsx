import { userStore } from '(@/store/userStore)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Avatar, avatar } from '@nextui-org/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const AvatarForm = () => {
  const { user, setUser } = userStore((state) => state);
  const [file, setFile] = useState(null as File | null);
  const [avatarView, setAvatarView] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!file) {
      setAvatarView(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarView(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [file]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const onFileCancel = () => {
    setFile(null);
    setAvatarView(null);
    setIsEditing(!isEditing);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFile(null);
      setAvatarView(null);
    }
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
        setIsEditing(!isEditing);
      } else {
        console.error('User data is null or empty.');
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      {isEditing && <input type="file" onChange={onFileChange} accept="image/*" />}
      <div className="w-[150px] h-[150px] overflow-hidden flex justify-center items-center rounded-full relative">
        {avatarView ? (
          <Image
            src={avatarView}
            alt="Avatar Preview"
            style={{ objectFit: 'cover' }}
            fill={true}
            sizes="200px"
            priority={false}
          />
        ) : user && user[0].avatar ? (
          <Image
            src={`${user[0].avatar}?${new Date().getTime()}`}
            alt="Avatar"
            style={{ objectFit: 'cover' }}
            fill={true}
            sizes="200px"
            priority={true}
          />
        ) : (
          <Avatar color="secondary" className="w-32 h-32" />
        )}
      </div>
      {isEditing ? (
        <>
          <button className="text-xs" onClick={uploadAvatar}>
            수정
          </button>
          <button className="text-xs" onClick={onFileCancel}>
            취소
          </button>
        </>
      ) : (
        <button className="text-xs" onClick={toggleEdit}>
          사진 등록하기
        </button>
      )}
    </div>
  );
};

export default AvatarForm;
