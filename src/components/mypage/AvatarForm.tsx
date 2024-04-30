'use client';

import { useAvatarUpdateMutation } from '@/hooks/useMutation/useProfileMutation';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import { Avatar } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IoCamera } from 'react-icons/io5';

const AvatarForm = () => {
  const { data: user } = useGetUserDataQuery();
  const [file, setFile] = useState(null as File | null);
  const [avatarView, setAvatarView] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateAvatarMutate } = useAvatarUpdateMutation();
  const queryClient = useQueryClient();

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
    setIsEditing((prev) => !prev);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      setFile(null);
      setAvatarView(null);
    }
  };

  /** 프로필 사진 업데이트 로직 */
  const handleAvatarUpdate = ({ userId, file }: { userId: string; file: File | null }) => {
    if (!file) {
      console.error('파일이 선택되지 않았습니다.');
      return;
    }
    updateAvatarMutate(
      { userId, file },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [USER_DATA_QUERY_KEY]
          });
          setIsEditing(false);
        }
      }
    );
  };

  return (
    <>
      <div className="flex flex-col justify-center items-start">
        <div className="flex flex-col items-center gap-2 relative">
          <div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center rounded-full relative">
            <label htmlFor="file_upload" className="px-3 py-2 border rounded-lg text-sm cursor-pointer">
              {avatarView ? (
                <Image
                  src={avatarView}
                  alt="Avatar Preview"
                  style={{ objectFit: 'cover' }}
                  fill={true}
                  sizes="450px"
                  priority={false}
                />
              ) : user?.avatar ? (
                <Image
                  src={`${user.avatar}?${new Date().getTime()}`}
                  alt="Avatar"
                  style={{ objectFit: 'cover' }}
                  fill={true}
                  sizes="450px"
                  priority={true}
                />
              ) : (
                <Avatar
                  classNames={{
                    base: 'bg-mainColor',
                    icon: 'text-white'
                  }}
                  className="w-20 h-20"
                />
              )}
            </label>
          </div>
          {isEditing ? (
            <div className="flex flex-col gap-1 items-center">
              <input
                type="file"
                id="file_upload"
                onChange={onFileChange}
                accept="image/*"
                className="w-0 h-0 opacity-0"
              />
              <div className="flex gap-1">
                <button
                  className="text-xs bg-purpleThird px-2 py-1 rounded-lg"
                  onClick={() => handleAvatarUpdate({ userId: user!.user_id, file })}
                >
                  저장
                </button>
                <button className="text-xs border px-2 py-1 rounded-lg bg-gray-100" onClick={onFileCancel}>
                  취소
                </button>
              </div>
            </div>
          ) : (
            <button className="text-lg rounded-full bg-[#D4D4D8] p-1 right-0 absolute bottom-0" onClick={toggleEdit}>
              <IoCamera />
            </button>
          )}
        </div>
        <p className="text-sm text-[#A1A1AA] mt-4">프로필 사진의 권장 크기는 100MB입니다.</p>
        <p className="text-sm text-[#A1A1AA]">지원하는 파일 형식 : jpg, png, gif</p>
      </div>
    </>
  );
};

export default AvatarForm;
