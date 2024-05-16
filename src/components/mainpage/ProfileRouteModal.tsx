'use client';

import { useEffect } from 'react';
import { useModalStore } from '@/store/modalStore';
import { useRouter } from 'next/navigation';
import { useGetUserDataQuery } from '@/query/useQueries/useUserQuery';
import { useFirstLoginMutation } from '@/query/useMutation/useFirstLoginMutation';

const ProfileRouteModal = () => {
  const { data: user, isLoggedIn } = useGetUserDataQuery();
  const { openModal, closeModal } = useModalStore();
  const router = useRouter();
  const mutateFirstLogin = useFirstLoginMutation();

  useEffect(() => {
    if (isLoggedIn && user?.first_login) {
      openModal({
        type: 'confirm',
        name: 'Welcome🎉',
        text: '미팅을 위해 마이페이지에서\n프로필 설정 부탁드려요!',
        onFunc: () => {
          mutateFirstLogin(user.user_id);
          closeModal();
          router.push('/mypage');
        },
        onCancelFunc: () => {
          mutateFirstLogin(user.user_id);
          closeModal();
        }
      });
    }
  }, [isLoggedIn, user]);

  return <></>;
};

export default ProfileRouteModal;
