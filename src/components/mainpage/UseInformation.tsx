import React from 'react';
import { IoMdHeart } from 'react-icons/io';
import Image from 'next/image';
import mainbanner from '../../../public/mainbanner.jpg';
import { stepArr } from '@/utils/data/mainPageData';

const UseInformation = () => {
  return (
    <section className="grid max-sm:grid-cols-1 max-lg:grid-cols-2 grid-cols-4 gap-4 mx-auto py-[16px] px-[24px] w-full max-w-[1080px] bg-gray4 rounded-lg">
      {stepArr.map((step) => (
        <div key={step.stepNum} className="flex flex-col gap-10">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-center w-14 h-5 bg-secondMainColor rounded-full text-2xs text-white">
              STEP {step.stepNum}
            </div>
            <h2 className="text-xl font-bold">{step.title}</h2>
          </div>
          <div className="">{step.src}</div>

          <div className="w-full max-w-60 px-[8px]">
            <p className="mx-auto break-keep text-base">{step.des}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default UseInformation;
