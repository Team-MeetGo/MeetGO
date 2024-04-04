import Image from 'next/image';
import React, { useState } from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';

interface Props {
  images: string[];
}

const ImageGallery = ({ images }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="w-[300px] h-full relative">
      {images.map((imageUrl: string, index: number) => (
        <div key={index} className={`${index === currentIndex ? 'block' : 'hidden'}`}>
          <Image src={imageUrl} alt={`reviewImage_${index}`} className="w-full h-auto" height={300} width={300} />
        </div>
      ))}
      {images.length > 1 && (
        <>
          <button className="absolute top-1/2 left-4 transform -translate-y-1/2" onClick={prevImage}>
            <GrPrevious />
          </button>
          <button className="absolute top-1/2 right-4 transform -translate-y-1/2" onClick={nextImage}>
            <GrNext />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageGallery;
