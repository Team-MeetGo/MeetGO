'use client';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

const MainBanner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <main className="max-w-[1000px] w-full flex items-start max-h-[524px]">
      <div className="flex flex-col gap-8 px-6 py-24">
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
      </div>
      <p className="text-mainColor">아아아</p>
      <div>
        <h2> Single Item</h2>
        <Slider {...settings}>
          <div>
            <h3>1</h3>
          </div>
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div>
        </Slider>
      </div>
    </main>
  );
};

export default MainBanner;
