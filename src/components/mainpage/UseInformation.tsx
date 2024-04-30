import React from 'react';
import Image from 'next/image';
import { stepArr } from '@/utils/data/mainPageData';

const UseInformation = () => {
  return (
    <section className="grid max-sm:grid-cols-1 max-lg:grid-cols-2 grid-cols-4 gap-2 mx-auto py-[16px] px-[80px] w-full max-w-[1080px] bg-gray4 rounded-lg">
      {stepArr.map((step) => (
        <div key={step.stepNum} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 px-[8px]">
            <div className="flex items-center justify-center w-14 h-5 bg-secondMainColor rounded-full text-2xs text-white">
              STEP {step.stepNum}
            </div>
            <h2 className="text-xl font-bold">{step.title}</h2>
          </div>
          <div className="relative w-52 h-40 flex justify-center">
            <Image
              src={step.src}
              alt="이용방법"
              fill={true}
              style={{ objectFit: 'cover', borderRadius: '20px' }}
              sizes="700px"
              priority={true}
            />
          </div>

          <div className="w-full max-w-60 px-[8px]">
            <p className="mx-auto break-keep text-base">{step.des}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default UseInformation;
