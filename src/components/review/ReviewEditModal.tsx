'use client';

import { Modal, ModalContent, ModalBody, Button, ModalHeader } from '@nextui-org/react';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';
import { LuImagePlus } from 'react-icons/lu';
import type { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import { useEditImgsMutation, useEditReviewMutation } from '@/hooks/useMutation/useReviewMutations';
import { useReviewDataQuery } from '@/hooks/useQueries/useReviewQuery';

type Props = {
  review_id: string;
  disclosure: UseDisclosureReturn;
};

export default function ReviewEditModal({ review_id, disclosure }: Props) {
  const { isOpen, onClose } = disclosure;
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const totalFiles = files.length + previewImages.length;

  const reviewDetail = useReviewDataQuery(review_id);

  useEffect(() => {
    if (reviewDetail) {
      setEditedTitle(reviewDetail.review_title || '');
      setEditedContent(reviewDetail.review_contents || '');
      setPreviewImages(reviewDetail.image_urls || []);
    }
  }, [reviewDetail]);

  const handleClose = () => {
    if (window.confirm('리뷰 수정을 취소하시겠습니까?')) {
      setEditedTitle(reviewDetail?.review_title || '');
      setEditedContent(reviewDetail?.review_contents || '');
      setPreviewImages(reviewDetail?.image_urls || []);
      setFiles([]);
      onClose();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newFiles = e.target?.files;
    if (newFiles) {
      setFiles([...files, ...Array.from(newFiles)]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
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
    const newFiles = e.dataTransfer?.files;
    if (newFiles) {
      setFiles(Array.from(newFiles));
    }
  };

  const handleDeleteImage = async (indexToRemove?: number) => {
    if (indexToRemove !== undefined) {
      const updatedImages = previewImages.filter((_, index) => index !== indexToRemove);
      setPreviewImages(updatedImages);
    }
  };

  const editReviewMutation = useEditReviewMutation();
  const editImgsMutation = useEditImgsMutation();

  const handleEditReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedImages = await Promise.all(
      files.map(async (file) => {
        const uuid = crypto.randomUUID();
        const filePath = `reviewImage/${uuid}`;
        try {
          const publicUrl = await editImgsMutation.mutateAsync({
            filePath,
            file
          });
          return publicUrl;
        } catch (error) {
          console.error('업로드 실패:', error);
          return null;
        }
      })
    );

    const updatedImageUrls = updatedImages.filter((url): url is string => url !== null);
    const allImages = [...previewImages, ...updatedImageUrls];

    editReviewMutation.mutate({ editedTitle, editedContent, allImages, review_id });

    alert('리뷰가 수정되었습니다.');
    onClose();
    window.location.reload();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} placement="top-center" className="bg-purpleSecondary">
        <ModalContent
          className="w-full flex justify-center items-center"
          style={{ maxWidth: '1116px', minHeight: '830px' }}
        >
          {(onClose) => (
            <>
              <ModalHeader className="flex w-full h-[112px] justify-center items-center flex-col gap-1 bg-purpleSecondary">
                <p className="w-full text-[40px]">리뷰 수정하기</p>
              </ModalHeader>
              <form className="w-full p-[32px] flex flex-col bg-white" onSubmit={handleEditReview}>
                <div className="rounded-[30px]">
                  <ModalBody>
                    <div className="flex mb-[32px] gap-2">
                      <div className="flex justify-center gap-2">
                        {previewImages.map((imageUrl, index) => (
                          <div key={index} className="relative w-[140px] h-[140px] aspect-square">
                            <Image
                              src={imageUrl}
                              alt={`Preview Image ${index}`}
                              className="object-cover rounded-[10px]"
                              fill
                            />
                            <button
                              className="absolute top-0 right-0 p-2 rounded-full w-8 h-8"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteImage(index);
                              }}
                            >
                              <MdCancel />
                            </button>
                          </div>
                        ))}
                        {files.map((file, index) => (
                          <div key={index} className="relative w-[140px] h-[140px] aspect-square">
                            <Image
                              className="object-cover rounded-[20px] w-[140px] h-[140px]"
                              src={URL.createObjectURL(file)}
                              alt="local file"
                              fill
                            />
                            <button
                              className="absolute top-0 right-0 p-2 rounded-full w-8 h-8"
                              onClick={(e) => {
                                e.preventDefault();
                                const updatedFiles = files.filter((_, i) => i !== index);
                                setFiles(updatedFiles);
                              }}
                            >
                              <MdCancel />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div>
                        <input
                          className="hidden items-center justify-center"
                          name="input"
                          id="input-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleChange}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          multiple
                        />
                        <label
                          className={`w-full flex items-center rounded-[10px] gap-2  ${
                            !files.length && previewImages.length === 0
                          }`}
                          htmlFor="input-upload"
                        >
                          {dragging && <div className="inset-0 z-10 bg-sky-500/20 pointer-events-none" />}

                          {totalFiles < 4 && (
                            <div className="flex items-center justify-center pointer-events-none rounded-[10px] w-[140px] h-[140px] bg-gray-300">
                              <LuImagePlus className="w-20 h-20 text-[#A1A1AA]" />
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                    <textarea
                      required
                      rows={1}
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      placeholder="제목을 입력해주세요."
                      className="outline-none max-w-[1050px] text-[30px] border-1 rounded-[10px] resize-none border-[#8F5DF4] p-[8px] pt-[16px] pb-[16px] pl-[24px] mb-2"
                    />
                    <textarea
                      required
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      placeholder="내용을 입력해주세요.(200자 이내)"
                      className="outline-none text-[16px] resize-none border-1 rounded-[10px] pt-[16px] pb-[16px] pl-[24px] border-mainColor max-w-[1050px] max-h-[280px]"
                      rows={8}
                      maxLength={200}
                    />
                    <div className="flex gap-2 justify-end mt-[64px]">
                      <Button
                        onClick={handleClose}
                        className="w-[50px] h-[50px] rounded-[10px] flex justify-center items-center bg-white text-[#A1A1AA] border-1 border-[#A1A1AA]"
                      >
                        취소
                      </Button>
                      <Button
                        type="submit"
                        className="w-[50px] h-[50px] rounded-[10px] flex justify-center items-center bg-mainColor text-white"
                      >
                        수정
                      </Button>
                    </div>
                  </ModalBody>
                </div>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
