'use client';
import { usePathname } from 'next/navigation';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa6';
import { GrMail } from 'react-icons/gr';

const Footer = () => {
  const iconArr = [<GrMail key="0" />, <FaFacebookF key="1" />, <FaInstagram key="2" />, <FaYoutube key="3" />];
  const pathname = usePathname();

  return (
    <>
      {pathname.startsWith('/chat') ? null : (
        <footer className="w-full h-36 flex justify-center items-center px-3 mx-auto">
          <div className="w-full max-w-[1280px] flex justify-between gap-6">
            <section className="flex flex-col gap-1 text-gray1">
              <p className="flex flex-col leading-tight">
                <span className="text-2xs">
                  상호: MeetGo | 대표: 황인정 | 개인정보관리책임자: 황인정 | TEL: 010-4344-3940
                </span>
                <span className="text-2xs">
                  주소: 스파르타 코딩클럽 | 사업자등록번호: 000-77-00000 | 팀: 7조 MeetGo
                </span>
              </p>
              <p className="text-2xs">이용약관 개인정보처리방침 사업자정보확인</p>
              <p className="text-2xs">ⓒ 2024 MeetGo</p>
            </section>
            <section className="flex gap-2">
              {iconArr.map((icon, idx) => (
                <button
                  key={idx}
                  className="w-6 h-6 bg-mainColor rounded-md text-white flex items-center justify-center"
                >
                  {icon}
                </button>
              ))}
            </section>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
