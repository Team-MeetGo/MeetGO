'use client';

import { clientSupabase } from '(@/utils/supabase/client)';
import { Modal, ModalContent, ModalBody, Button, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FaPhotoVideo } from 'react-icons/fa';
import { ReviewDetailType } from './ReviewDetail';

type Props = {
  review_id: string;
};

export default function ReviewEditModal({ review_id }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File>();
  const [reviewDetail, setReviewDetail] = useState<ReviewDetailType | null>(null);
  const [editedTitle, setEditedTitle] = useState(reviewDetail?.review_title);
  const [editedContent, setEditedContent] = useState(reviewDetail?.review_contents);

  useEffect(() => {
    if (review_id && !reviewDetail) {
      getReviewDetail(review_id);
    }
  });

  useEffect(() => {
    if (reviewDetail) {
      setEditedTitle(reviewDetail.review_title);
      setEditedContent(reviewDetail.review_contents);
    }
  }, [reviewDetail]);

  async function getReviewDetail(review_id: string) {
    let { data: reviewDetail, error } = await clientSupabase
      .from('review')
      .select('review_title, review_contents, created_at, image_url, user_id')
      .eq('review_id', review_id);

    if (error) {
      console.error('리뷰 가져오는 중 에러 발생', error);
    }

    if (reviewDetail && reviewDetail.length > 0) {
      setReviewDetail(reviewDetail[0]);
    }
  }

  const handleClose = () => {
    if (window.confirm('리뷰 수정을 취소하시겠습니까?')) {
      setEditedTitle(reviewDetail?.review_title);
      setEditedContent(reviewDetail?.review_contents);
      onClose();
    }
  };

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

  const handleEditReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const istitleChanged = editedTitle !== reviewDetail?.review_title;
    const isContentChanged = editedContent !== reviewDetail?.review_contents;
    const isImageChanged = file !== undefined;

    if (!istitleChanged && !isContentChanged && !isImageChanged) {
      alert('수정 된 부분이 없습니다.');
      return;
    }

    const userId = '8fe87c99-842a-4fde-a0e8-918a0171e9a6';
    let ImgDbUrl = reviewDetail?.image_url;

    if (file) {
      const uuid = crypto.randomUUID();
      const filePath = `reviewImage/${uuid}`;

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
      ImgDbUrl = imageUrl.publicUrl;
    }

    // console.log(ImgDbUrl);

    if (!file && !reviewDetail?.image_url) {
      ImgDbUrl = '';
    }

    const { data: updateReview, error } = await clientSupabase
      .from('review')
      .update({ review_title: editedTitle, review_contents: editedContent, image_url: ImgDbUrl })
      .eq('review_id', review_id);

    if (error) {
      console.log('리뷰 수정 오류', error.message);
    }

    alert('리뷰가 수정되었습니다.');
    window.location.reload();
  };

  return (
    <>
      <Button onPress={onOpen} color="primary">
        수정
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} placement="top-center">
        <ModalContent className="w-full flex justify-center items-center">
          {(onClose) => (
            <form className="w-full flex flex-col mt-2" onSubmit={handleEditReview}>
              <div className="bg-white p-8 rounded-[30px]">
                <ModalBody>
                  <div className="mt-[10px] mb-[30px]">
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
                        <div className="relative w-full aspect-square">
                          {reviewDetail?.image_url ? (
                            <Image
                              src={reviewDetail?.image_url}
                              alt="reviewImage"
                              className="object-cover rounded-[20px]"
                              fill
                            />
                          ) : null}
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
                    required
                    rows={1}
                    value={editedTitle || ''}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="제목을 입력해주세요."
                    className="outline-none text-lg border-2 rounded-[20px] resize-none p-[8px] pl-4 mb-2"
                  />
                  <textarea
                    required
                    value={editedContent || ''}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="내용을 입력해주세요.(200자 이내)"
                    className="outline-none text-lg resize-none border-2 rounded-[30px] p-[15px]"
                    rows={6}
                    maxLength={200}
                  />
                  <button className="h-[50px] rounded-[15px] mt-[30px] flex justify-center items-center bg-purple-300">
                    할 일 등록
                  </button>
                </ModalBody>
              </div>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
