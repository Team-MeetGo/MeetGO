import { useRouter } from 'next/navigation';
import { useModalStore } from '(@/store/modalStore)';

export const ValidationModal = () => {
  const router = useRouter();
  const { isOpen, type, name, text, onFunc, closeModal } = useModalStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white px-[50px] py-[30px] rounded-xl z-50">
        <h2>{name}</h2>
        <pre className="text-[18px]">{text}</pre>
        <div>
          <form>
            <div>
              {type === 'confirm' ? (
                <>
                  <button className="text-[#8F5DF4]" onClick={onFunc}>
                    확인
                  </button>
                  <button onClick={() => closeModal()}>취소</button>
                </>
              ) : (
                <button
                  className="pt-2 text-[#8F5DF4] m-auto w-full text-[16px] font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    if (type === 'alert' && text === '로그인 되었습니다.') {
                      closeModal();
                      router.replace('/');
                    } else if (type === 'alert' && text === '회원가입 되었습니다.') {
                      closeModal();
                      router.replace('/');
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
