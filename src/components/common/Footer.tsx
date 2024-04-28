import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa6';
import { GrMail } from 'react-icons/gr';

const Footer = () => {
  return (
    <footer className="w-full h-44 flex justify-center items-center px-3 mx-auto">
      <div className="w-full max-w-[1280px] flex justify-between gap-6">
        <section className="flex flex-col gap-1 text-gray1">
          <p className="flex flex-col leading-tight">
            <span className="text-2xs">
              상호: MeetGo | 대표: 황인정 | 개인정보관리책임자: 황인정 | TEL: 010-4344-3940
            </span>
            <span className="text-2xs">주소: 스파르타 코딩클럽 | 사업자등록번호: 000-77-00000 | 팀: 7조 MeetGo</span>
          </p>
          <p className="text-2xs">이용약관 개인정보처리방침 사업자정보확인</p>
          <p className="text-2xs">ⓒ 2024 MeetGo</p>
        </section>
        <section className="flex">
          <button>
            <GrMail />
          </button>
          <button>
            <FaFacebookF />
          </button>
          <button>
            <FaInstagram />
          </button>
          <button>
            <FaYoutube />
          </button>
          <button></button>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
