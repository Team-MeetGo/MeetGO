'use client';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import Image from 'next/image';
import { bannerImgArr } from '@/utils/data/mainPageData';
import Link from 'next/link';

export const RtBannerArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div className="max-sm:hidden">
      <div
        className={`${className} max-sm:hidden`}
        style={{
          fontSize: '40px',
          display: 'block',
          right: '20px',
          zIndex: '15',
          opacity: '1',
          color: 'White',
          lineHeight: 1
        }}
        onClick={onClick}
      />
    </div>
  );
};
export const LtBannerArrow = (props: any) => {
  const { className, style, onClick } = props;

  return (
    <div className="max-sm:hidden">
      <div
        className={className}
        style={{
          fontSize: '40px',
          display: 'block',
          left: '20px',
          zIndex: '15',
          opacity: '1',
          color: 'White',
          lineHeight: 1
        }}
        onClick={onClick}
      />
    </div>
  );
};

const MainBanner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <RtBannerArrow />,
    prevArrow: <LtBannerArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <>
      <div className="w-full max-w-[1080px] h-full max-h-[600px] p-[24px]">
        <Slider {...settings}>
          {bannerImgArr.map((img, idx) => (
            <div key={idx} className="relative">
              <div className="flex flex-col gap-6 z-30 sm:absolute text-white max-sm:text-mainColor top-16 left-20">
                <div className="font-extrabold text-4xl max-sm:text-2xl mb-[4px]">
                  <h1>{img.title1}</h1>
                  <h1>{img.title2}</h1>
                </div>
                <div className="text-xs leading-5">
                  <p>{img.sub1}</p>
                  <p>{img.sub2}</p>
                </div>

                <Link
                  href="/mypage"
                  className="bg-mainColor text-white rounded-lg px-7 max-sm:px-3 h-10 text-base max-sm:text-sm font-semibold my-auto flex justify-center items-center hover:bg-opacity-90 break-keep"
                >
                  지금 바로 대학생 인증하러 가기
                </Link>
              </div>
              <div className=" w-full max-w-[1080px] h-80 mb-[10px] relative max-sm:hidden">
                <Image
                  src={img.src}
                  alt="메인배너"
                  fill={true}
                  style={{ objectFit: 'cover', borderRadius: '3px', cursor: 'pointer', opacity: '0.9' }}
                  sizes="1980px"
                  priority={true}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default MainBanner;
