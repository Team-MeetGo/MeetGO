import { useAvatarUpdateMutation } from '(@/hooks/useMutation/useProfileMutation)';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';
import { USER_DATA_QUERY_KEY } from '(@/query/user/userQueryKeys)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Avatar, avatar } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IoCamera } from 'react-icons/io5';

const AvatarForm = () => {
  const { data: user, isPending } = useGetUserDataQuery();
  const [file, setFile] = useState(null as File | null);
  const [avatarView, setAvatarView] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateAvatarMutate } = useAvatarUpdateMutation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!file) {
      setAvatarView(null);
      console.log('파일이 선택되지 않았습니다.');
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

  /** 프로필 사진 업데이트 로직 */
  const handleAvatarUpdate = ({ userId, file }: { userId: string; file: File | null }) => {
    if (!file) {
      console.log('파일이 선택되지 않았습니다.');
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
    <div className="flex flex-col justify-center items-start gap-2 relative">
      {isEditing && <input type="file" onChange={onFileChange} accept="image/*" />}
      <div className="flex flex-col items-center gap-2">
        <div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center rounded-full relative">
          {avatarView ? (
            <Image
              src={avatarView}
              alt="Avatar Preview"
              style={{ objectFit: 'cover' }}
              fill={true}
              sizes="500px"
              priority={false}
            />
          ) : user?.avatar ? (
            <Image
              src={`${user.avatar}?${new Date().getTime()}`}
              alt="Avatar"
              style={{ objectFit: 'cover' }}
              fill={true}
              sizes="500px"
              priority={true}
            />
          ) : (
            <Avatar color="secondary" className="w-32 h-32" />
          )}
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <button className="text-xs" onClick={() => handleAvatarUpdate({ userId: user!.user_id, file })}>
              수정
            </button>
            <button className="text-xs" onClick={onFileCancel}>
              취소
            </button>
          </div>
        ) : (
          <button className="text-lg rounded-full bg-[#D4D4D8] p-1 right-0 absolute bottom-0" onClick={toggleEdit}>
            <IoCamera />
          </button>
        )}
      </div>
    </div>
  );
};

export default AvatarForm;
