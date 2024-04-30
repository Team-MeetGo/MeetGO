'use client';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import Image from 'next/image';
import HeroBannerImg_01 from '../../../public/HeroBannerImg_01.png';
import HeroBannerImg_02 from '../../../public/HeroBannerImg_02.png';
import HeroBannerImg_03 from '../../../public/HeroBannerImg_03.png';
import HeroBannerImg_04 from '../../../public/HeroBannerImg_04.png';

export const RtBannerArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        fontSize: '40px',
        display: 'block',
        right: '20px',
        zIndex: '15',
        opacity: '1',
        color: 'White'
      }}
      onClick={onClick}
    />
  );
};
export const LtBannerArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        fontSize: '40px',
        display: 'block',
        left: '20px',
        zIndex: '15',
        opacity: '1',
        color: 'White'
      }}
      onClick={onClick}
    />
  );
};

const MainBanner = () => {
  const bannerImgArr = [HeroBannerImg_01, HeroBannerImg_02, HeroBannerImg_03, HeroBannerImg_04];

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
            <div className=" w-full max-w-[1080px] h-[18rem] relative" key={idx}>
              <Image
                src={img}
                alt="메인배너"
                fill={true}
                style={{ objectFit: 'cover', borderRadius: '3px', cursor: 'pointer' }}
                sizes="1980px"
                priority={true}
              />
              <p>아아아</p>
            </div>
          ))}
        </Slider>
        {/* <div className="flex flex-col gap-8 px-6 py-24 absolute">
          <h1 className="font-bold text-6xl text-mainColor">
            벚꽃 축제는
            <br />
            가고 싶어.
            <br />
            누구랑 가요..?
          </h1>
          <p className="font-medium text-lg">
            학교 이메일로 인증만 한다면
            <br />
            당신도 미팅의 주인공이 될 수 있어요!
          </p>
          <button className="bg-mainColor text-white font-bold text-xl px-8 py-4 rounded-lg self-start">
            지금 바로 인연 만들러 가기
          </button>
        </div> */}
      </div>
    </>
  );
};

export default MainBanner;
