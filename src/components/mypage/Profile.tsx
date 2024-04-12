'use client';

import { Suspense, useState } from 'react';
import SchoolForm from './SchoolForm';
import AvatarForm from './AvatarForm';
import MyPost from './MyPost';
import Favorite from './Favorite';
import MetPeople from './MetPeople';
import useInputChange from '(@/hooks/custom/useInputChange)';
import { Select, SelectItem } from '@nextui-org/react';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';
import { useProfileUpdateMutation } from '(@/hooks/useMutation/useProfileMutation)';
import { useQueryClient } from '@tanstack/react-query';
import { USER_DATA_QUERY_KEY } from '(@/query/user/userQueryKeys)';
import { UpdateProfileType } from '(@/types/userTypes)';

const Profile = () => {
  const queryClient = useQueryClient();
  const { data: user, isPending, isError, error } = useGetUserDataQuery();
  const [isEditing, setIsEditing] = useState(false);
  const inputNickname = useInputChange(user?.nickname ? user?.nickname : '');
  const inputIntro = useInputChange(user?.intro ? user?.intro : '');
  const inputKakaoId = useInputChange(user?.kakaoId ? user?.kakaoId : '');
  const inputGender = useInputChange(user?.gender ? user?.gender : '');

  const { mutate: updateProfileMutate } = useProfileUpdateMutation();

  const toggleEditing = () => {
    setIsEditing(true);
    if (user) {
      inputNickname.setValue(user?.nickname);
      inputIntro.setValue(user?.intro);
      inputKakaoId.setValue(user?.kakaoId);
      inputGender.setValue(user?.gender);
    }
  };

  const onCancelHandle = () => {
    setIsEditing(false);
  };

  // /** 프로필 업데이트하는 로직 */
  // const updateProfile = async () => {
  //   const userId = user?.user_id;
  //   if (!userId) return;
  //   /** 닉네임 중복 검사 로직 */
  //   const { data: nicknameData, error: nicknameError } = await clientSupabase
  //     .from('users')
  //     .select('nickname')
  //     .eq('nickname', inputNickname.value)
  //     .not('user_id', 'eq', user?.user_id);
  //   if (nicknameError) {
  //     console.error('Error fetching:', nicknameError);
  //     return;
  //   }
  //   if (nicknameData) {
  //     alert('이미 사용중인 닉네임입니다. 다른 닉네임을 입력해주세요.');
  //     return;
  //   }

  //   const { error } = await clientSupabase
  //     .from('users')
  //     .update({
  //       intro: inputIntro.value,
  //       kakaoId: inputKakaoId.value,
  //       nickname: inputNickname.value,
  //       gender: inputGender.value
  //     })
  //     .eq('user_id', userId);
  // };

  /** 수정하고 저장버튼 클릭시 실행될 로직(상태 업데이트 및 갱신) */
  const handleProfileUpdate = ({ userId, inputNickname, inputIntro, inputKakaoId, inputGender }: UpdateProfileType) => {
    updateProfileMutate(
      { userId, inputNickname, inputIntro, inputKakaoId, inputGender },
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
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">프로필</h1>
      <AvatarForm />
      {isEditing ? (
        <>
          <button
            className="border p-4"
            onClick={() =>
              handleProfileUpdate({
                userId: user!.user_id,
                inputNickname: inputNickname.value,
                inputIntro: inputIntro.value,
                inputKakaoId: inputKakaoId.value,
                inputGender: inputGender.value
              })
            }
          >
            저장하기
          </button>
          <button className="border p-4" onClick={onCancelHandle}>
            취소
          </button>
        </>
      ) : (
        <button className="border p-4" onClick={toggleEditing}>
          수정하기
        </button>
      )}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          {!isEditing ? (
            <p className="block text-base font-medium mb-1">{user?.nickname}</p>
          ) : (
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              id="nickname"
              placeholder="닉네임 입력 (최대 10자)"
              type="text"
              value={inputNickname.value}
              onChange={inputNickname.onChange}
            />
          )}
          <p className="block text-sm font-medium mb-1">{user?.login_email}</p>
          <p className="block text-sm font-medium mb-1">
            {user
              ? user?.gender === 'female'
                ? '여성'
                : user?.gender === 'male'
                ? '남성'
                : '성별을 골라주세요.'
              : '사용자 정보 없음'}
          </p>
          {isEditing && (
            <Select label="성별" className="max-w-xs" value={inputGender.value} onChange={inputGender.onChange}>
              <SelectItem key="female" value="female">
                여성
              </SelectItem>
              <SelectItem key="male" value="male">
                남성
              </SelectItem>
            </Select>
          )}
        </div>
      </div>
      <SchoolForm />
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">카카오톡ID</label>
        {!isEditing ? (
          <p className="block text-sm font-medium mb-1">{user?.kakaoId}</p>
        ) : (
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            id="kakaoId"
            placeholder=""
            type="text"
            value={inputKakaoId.value}
            onChange={inputKakaoId.onChange}
          />
        )}
      </div>
      <Favorite isEditing={isEditing} />
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1" htmlFor="introduction">
          자기소개(최대 15자)
        </label>
        {!isEditing ? (
          <p className="block text-sm font-medium mb-1">{user?.intro}</p>
        ) : (
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            id="introduction"
            placeholder="자기소개를 입력해주세요. 예)MBTI, 취미, 관심사 등"
            value={inputIntro.value}
            onChange={inputIntro.onChange}
          />
        )}
      </div>
      <MetPeople />
      <MyPost />
    </div>
  );
};

export default Profile;
