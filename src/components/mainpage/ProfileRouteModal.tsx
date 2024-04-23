'use client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { ValidationModal } from '@/components/common/ValidationModal';
import { useEffect } from 'react';
import { useModalStore } from '@/store/modalStore';
import { useRouter } from 'next/navigation';
import { useFirstLoginMutation } from '@/hooks/useMutation/useFirstLoginMutation';

const ProfileRouteModal = () => {
  const { data: user, isPending, isSuccess } = useGetUserDataQuery();
  const { openModal, closeModal } = useModalStore();
  const router = useRouter();
  const mutateFirstLogin = useFirstLoginMutation();

  useEffect(() => {
    if (isSuccess && user?.first_login) {
      openModal({
        type: 'confirm',
        name: 'Welcome!',
        text: '미팅을 위해 프로필 설정 부탁드려요.',
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
  }, [isSuccess, user]);

  return <>{user?.first_login && <ValidationModal />}</>;
};

export default ProfileRouteModal;
