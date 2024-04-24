'use client';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/store/modalStore';
import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import { useQueryClient } from '@tanstack/react-query';

export const ValidationModal = () => {
  const router = useRouter();
  const { isOpen, type, name, text, onFunc, onCancelFunc, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  if (!isOpen) return null;

  const loginSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [USER_DATA_QUERY_KEY]
    });
    location.replace('/');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white px-[50px] py-[30px] rounded-xl z-50 items-center flex flex-col gap-2">
        <h2 className=" text-xl font-semibold">{name}</h2>
        <pre className="text-[18px]">{text}</pre>
        <div>
          <form>
            <div>
              {type === 'confirm' ? (
                <>
                  <button className="text-[#8F5DF4] pt-2 px-2" onClick={onFunc}>
                    확인
                  </button>
                  <button className="pt-2 px-2" onClick={onCancelFunc}>
                    취소
                  </button>
                </>
              ) : (
                <button
                  className="pt-2 text-[#8F5DF4] m-auto w-full text-[16px] font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    if (type === 'alert' && text === '로그인 되었습니다.') {
                      closeModal();
                      loginSuccess();
                    } else if (type === 'alert' && text === '회원가입 되었습니다.') {
                      closeModal();
                      loginSuccess();
                    } else {
                      closeModal();
                    }
                  }}
                >
                  확인
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
