'use client';
import { authValidation } from '@/utils/Validation';
import { clientSupabase } from '@/utils/supabase/client';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { customErrToast, customSuccessToast } from '../common/customToast';

const ForgotPasswordForm = () => {
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    clientSupabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowResetForm(true);
      }
    });
  }, []);

  const onResetPassword = async (e: any) => {
    e.preventDefault();
    if (!userId) return customErrToast('이메일을 입력해주세요.');
    if (!authValidation('userId', userId)) {
      customErrToast('유효하지 않은 이메일 주소입니다.');
      return;
    }
    try {
      const { data, error } = await clientSupabase.auth.resetPasswordForEmail(userId, {
        redirectTo: 'https://meet-go.vercel.app/forgotpassword'
      });
      if (!error) {
        customSuccessToast('비밀번호 재설정 이메일이 발송되었습니다.');
        setUserId('');
        router.push('/');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      customErrToast('비밀번호 재설정 중 오류가 발생했습니다.');
    }
  };

  const onUpdatePassword = async (e: any) => {
    e.preventDefault();
    const { data, error } = await clientSupabase.auth.updateUser({
      password: newPassword
    });
    if (!newPassword) return customErrToast('비밀번호를 입력해주세요.');
    if (!authValidation('password', newPassword)) {
      customErrToast('숫자, 문자, 특수문자 조합으로 8자이상 작성해 주세요.');
      return;
    }
    if (data) {
      customSuccessToast('패스워드가 성공적으로 변경되었습니다.');
      setNewPassword('');
      router.push('/');
    }
    if (error) customErrToast('패스워드 변경 중 오류가 발생했습니다.');
  };

  return (
    <div className="max-w-[450px] w-full p-[10px] m-auto">
      {showResetForm ? (
        <div>
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-4xl font-semibold">비밀번호 재설정</h1>
            <h2>비밀번호를 재설정할 수 있습니다.</h2>
          </div>
          <form className="mt-[24px]">
            <input
              className="p-5 border border-[#A1A1AA] placeholder:text-[#A1A1AA] placeholder:text-[14px] rounded-lg focus:outline-none focus:border-mainColor w-full"
              type="email"
              name="userId"
              placeholder="이메일을 입력해주세요."
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <input
              className="p-5 border border-[#A1A1AA] placeholder:text-[#A1A1AA] placeholder:text-[14px] rounded-lg focus:outline-none focus:border-mainColor w-full"
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요."
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Button
              className="duration-200 bg-mainColor text-white p-5 mt-[24px] rounded-lg font-semibold w-full py-[20px] h-auto text-base"
              type="submit"
              onClick={onUpdatePassword}
            >
              비밀번호 재설정
            </Button>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-4xl font-semibold">비밀번호 찾기</h1>
            <h2>가입하신 이메일로 비밀번호 재설정 URL을 전송해드립니다.</h2>
          </div>
          <form className="mt-[24px]">
            <input
              className="p-5 border border-[#A1A1AA] placeholder:text-[#A1A1AA] placeholder:text-[14px] rounded-lg focus:outline-none focus:border-mainColor w-full"
              type="email"
              name="userId"
              placeholder="이메일을 입력해주세요."
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <Button
              className="duration-200 bg-mainColor text-white p-5 mt-[24px] rounded-lg font-semibold w-full py-[20px] h-auto text-base"
              type="submit"
              onClick={onResetPassword}
            >
              비밀번호 재설정 메일 보내기
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
