'use client';
import useInputChange from '@/hooks/custom/useInputChange';
import { useProfileUpdateMutation } from '@/hooks/useMutation/useProfileMutation';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import { useModalStore } from '@/store/modalStore';
import { useFavoriteStore } from '@/store/userStore';
import { UpdateProfileType } from '@/types/userTypes';
import { deleteUser } from '@/utils/api/authAPI';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import AvatarForm from './AvatarForm';
import SchoolForm from './SchoolForm';
import Favorite from './Favorite';
import { FaCheckSquare } from 'react-icons/fa';

const ProfileSetting = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetUserDataQuery();
  const [isEditing, setIsEditing] = useState(false);
  const { selected } = useFavoriteStore();
  const { openModal, closeModal } = useModalStore();

  const inputNickname = useInputChange('');
  const inputEmail = useInputChange('');
  const inputIntro = useInputChange('');
  const inputKakaoId = useInputChange('');
  const inputGender = useInputChange('');
  const inputSchoolName = useInputChange('');
  const inputSchoolEmail = useInputChange('');

  const { mutate: updateProfileMutate } = useProfileUpdateMutation();

  useEffect(() => {
    if (user) {
      inputNickname.setValue(user.nickname);
      inputEmail.setValue(user.login_email);
      inputIntro.setValue(user.intro);
      inputKakaoId.setValue(user.kakaoId);
      inputGender.setValue(user.gender);
      inputSchoolName.setValue(user.school_name);
      inputSchoolEmail.setValue(user.school_email);
    }
  }, []);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onCancelHandle = () => {
    setIsEditing(false);
    inputNickname.setValue(user?.nickname);
    inputEmail.setValue(user?.login_email);
    inputIntro.setValue(user?.intro);
    inputKakaoId.setValue(user?.kakaoId);
    inputGender.setValue(user?.gender);
    inputSchoolName.setValue(user?.school_name);
    inputSchoolEmail.setValue(user?.school_email);
  };

  /** 수정하고 저장버튼 클릭시 실행될 로직(상태 업데이트 및 갱신) */
  const handleProfileUpdate = ({ userId, inputNickname, inputIntro, inputKakaoId, inputGender }: UpdateProfileType) => {
    updateProfileMutate(
      { userId, inputNickname, inputIntro, inputKakaoId, inputGender, favorite: Array.from(selected) },
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

  const handleDeleteUser = (userId: string) => {
    openModal({
      type: 'confirm',
      name: '회원탈퇴',
      text: '정말 탈퇴하시겠습니까?',
      onFunc: () => {
        deleteUser(userId);
        closeModal();
        location.replace('/');
      },
      onCancelFunc: () => {
        closeModal();
      }
    });
  };

  const profileInfo = [
    {
      title: '닉네임',
      required: '*',
      name: 'nickname',
      input: inputNickname,
      content: user?.nickname,
      editable: true,
      maxLength: 10
    },
    {
      title: '계정 이메일',
      required: '*',
      name: 'loginEmail',
      input: inputEmail,
      content: user?.login_email,
      editable: false
    },
    {
      title: '성별',
      required: '*',
      name: 'gender',
      input: inputGender,
      content: user?.gender,
      editable: user?.gender ? false : true,
      type: 'select',
      selectbox: (
        <>
          <form className="flex gap-2">
            <label>
              <input type="radio" name="gender" value="female" className="mr-1" onChange={inputGender.onChange} />
              여성
            </label>
            <label>
              <input type="radio" name="gender" value="male" className="mr-1" onChange={inputGender.onChange} />
              남성
            </label>
          </form>
        </>
      )
    },
    {
      title: '학교명',
      required: '*',
      name: 'schoolName',
      input: inputSchoolName,
      content: user?.school_name,
      editable: user?.school_name ? false : true
    },
    {
      title: '학교 이메일',
      required: '*',
      name: 'schoolEmail',
      input: inputSchoolEmail,
      content: user?.school_email,
      editable: user?.school_email ? false : true,
      icon: user?.school_email && <FaCheckSquare className="text-[#00C77E]" />
    },
    {
      title: '카카오톡ID',
      required: '*',
      name: 'kakaoId',
      input: inputKakaoId,
      content: user?.kakaoId,
      editable: true,
      maxLength: 20
    }
  ];

  const optionProfileInfo = [
    {
      title: '이상형',
      content: user?.favorite,
      type: 'select',
      component: <Favorite isEditing={isEditing} />
    },
    {
      title: '자기소개',
      content: user?.intro,
      editable: true,
      name: 'intro',
      input: inputIntro,
      maxLength: 15,
      type: 'input',
      placeholder: '자기소개를 입력해주세요. (15자 이내)'
    }
  ];

  return (
    <main className="flex flex-col gap-12">
      <div>
        <p className="font-semibold">회원정보</p>
        <p className="text-sm text-[#4B5563] mb-6">필수 회원정보를 모두 설정해주세요.</p>
        <div className="flex flex-col gap-6 items-start">
          <div>
            <AvatarForm />
          </div>
          {profileInfo.map((info, index) => (
            <div key={index} className="text-[#4B5563] w-full relative">
              <span className="text-sm font-semibold">{info.title}</span>
              <span className="text-sm font-semibold text-requiredRed">{info.required}</span>

              <div className="flex items-center gap-2 mt-2">
                {info.type === 'select' && isEditing && info.editable ? (
                  <>{info.selectbox}</>
                ) : (
                  <>
                    <input
                      disabled={!isEditing || !info.editable}
                      className="flex flex-col items-start text-sm text-[#9CA3AF] max-w-[342px] w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-mainColor relative"
                      name={info.name}
                      value={info.input.value}
                      maxLength={info.maxLength}
                      onChange={info.input.onChange}
                    />
                    {info.icon}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-[470px] w-full h-[1px] bg-[#E5E7EB]"></div>
      <div>
        <p className="font-semibold">추가정보</p>
        <p className="text-sm text-[#4B5563] mb-6">추가정보를 입력해주세요.</p>
        <div className="flex flex-col gap-6 items-start">
          {optionProfileInfo.map((info, index) => (
            <div key={index} className="text-[#4B5563] w-full flex flex-col gap-2">
              <span className="text-sm font-semibold">{info.title}</span>
              {info.type === 'input' ? (
                <input
                  disabled={!isEditing || !info.editable}
                  className="flex flex-col items-start text-sm text-[#9CA3AF] max-w-[342px] w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-mainColor"
                  name={info.name}
                  maxLength={info.maxLength}
                  placeholder={info.placeholder}
                  value={info.input?.value}
                  onChange={info.input?.onChange}
                />
              ) : (
                info.component
              )}
            </div>
          ))}
        </div>
        <button
          className="underline max-w-24 mt-[48px] opacity-50"
          onClick={() => handleDeleteUser(user?.user_id ?? '')}
        >
          회원탈퇴하기
        </button>
      </div>

      {/* <div className={`${isEditing ? 'items-start' : 'items-center'} flex gap-6 w-full`}>
        <p className="block text-lg font-semibold w-[100px]">성별</p>
        <div className="flex flex-col gap-2">
          <p className="block text-base font-medium">
            {user
              ? user.gender === 'female'
                ? '여성'
                : user.gender === 'male'
                ? '남성'
                : '성별을 골라주세요.'
              : '사용자 정보 없음'}
          </p>
          {isEditing && !user?.gender && (
            <Select
              label="성별"
              className="min-w-36 max-w-xs"
              value={inputGender.value}
              onChange={inputGender.onChange}
            >
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
      <Favorite isEditing={isEditing} /> */}
      <div className="flex justify-center gap-2">
        {isEditing ? (
          <>
            <button
              className="border rounded-xl px-[32px] py-[12px] text-[18px] font-medium"
              onClick={() =>
                handleProfileUpdate({
                  userId: user?.user_id ?? '',
                  inputNickname: inputNickname.value,
                  inputIntro: inputIntro.value,
                  inputKakaoId: inputKakaoId.value,
                  inputGender: inputGender.value,
                  favorite: Array.from(selected)
                })
              }
            >
              저장하기
            </button>
            <button
              className="border rounded-xl px-[32px] py-[12px] text-[18px] font-medium bg-gray4"
              onClick={onCancelHandle}
            >
              취소
            </button>
          </>
        ) : (
          <button
            className="bg-mainColor rounded-xl px-[32px] py-[12px] text-[18px] text-white font-medium"
            onClick={toggleEditing}
          >
            수정하기
          </button>
        )}
      </div>
    </main>
  );
};

export default ProfileSetting;
