'use client';

import { clientSupabase } from '(@/utils/supabase/client)';
import { ModalContent, ModalBody } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { FaPhotoVideo } from 'react-icons/fa';

const NewReview = () => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File>();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target?.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    if (e.type === 'dragenter') {
      setDragging(true);
    } else if (e.type === 'dragleave') {
      setDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert('사진을 등록해 주세요.');
      return;
    }
    const userId = '8fe87c99-842a-4fde-a0e8-918a0171e9a6';

    const uuid = crypto.randomUUID();
    const filePath = `reviewImage/${uuid}`;

    const reviewTitle = (document.getElementById('review_title') as HTMLInputElement)?.value;
    const reviewContents = (document.getElementById('review_contents') as HTMLInputElement)?.value;

    const uploadImage = async (filePath: string, file: File) => {
      const { data, error } = await clientSupabase.storage.from('reviewImage').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

      if (error) {
        console.error('업로드 오류', error.message);
        throw error;
      }

      return data;
    };
    const data = await uploadImage(filePath, file);
    const { data: imageUrl } = clientSupabase.storage.from('reviewImage').getPublicUrl(data.path);
    const ImgDbUrl = imageUrl.publicUrl;
    console.log(ImgDbUrl);

    const { data: insertedData, error: insertError } = await clientSupabase.from('review').insert([
      {
        review_title: reviewTitle,
        review_contents: reviewContents,
        image_url: ImgDbUrl,
        user_id: userId
      }
    ]);
    console.log('삽입된 데이터:', insertedData);

    if (insertError) {
      console.error('insert error', insertError);
      return;
    }

    alert('리뷰가 등록되었습니다.');
    window.location.reload();
  };
  return (
    <div className="fixed top-0 left-0 flex justify-center items-center">
      <form className="w-full flex flex-col mt-2" onSubmit={handleSubmit}>
        <ModalContent className="bg-white w-[800px] mb-[100px]  p-8 rounded-[30px]">
          <ModalBody>
            <div className="mt-[30px] mb-[30px]">
              <input
                className="hidden items-center justify-center"
                name="input"
                id="input-upload"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
              <label
                className={`w-full h-60 flex flex-col items-center justify-center rounded-[20px] ${
                  !file && 'border-2 rounded-[20px] border-gray-500 border-dashed'
                }`}
                htmlFor="input-upload"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {dragging && <div className="absolute inset-0 z-10 bg-sky-500/20 pointer-events-none" />}
                {!file && (
                  <div className="flex flex-col items-center pointer-events-none">
                    <FaPhotoVideo className="w-20 h-20 text-gray-300 mb-[10px]" />
                    <p>클릭하여 이미지를 등록해 주세요.</p>
                  </div>
                )}
                {file && (
                  <div className="relative w-full aspect-square">
                    <Image
                      className="object-cover rounded-[20px]"
                      src={URL.createObjectURL(file)}
                      alt="local file"
                      fill
                    />
                  </div>
                )}
              </label>
            </div>
            <textarea
              autoFocus
              id="review_title"
              required
              rows={1}
              placeholder="제목을 입력해주세요."
              className="outline-none text-lg border-2 rounded-[20px] resize-none p-[8px] pl-4 mb-2"
            />
            <textarea
              id="review_contents"
              required
              placeholder="내용을 입력해주세요.(200자 이내)"
              className="outline-none text-lg resize-none border-2 rounded-[30px] p-[15px]"
              rows={6}
              maxLength={200}
            />
            <button className="h-[50px] rounded-[15px] mt-[30px] flex justify-center items-center bg-purple-300">
              할 일 등록
            </button>
          </ModalBody>
        </ModalContent>
      </form>
    </div>
  );
};

export default NewReview;
