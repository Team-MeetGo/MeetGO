'use client';

import { Modal, ModalContent, ModalBody, Button, ModalHeader } from '@nextui-org/react';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';
import { LuImagePlus } from 'react-icons/lu';
import type { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import { useEditImgsMutation, useEditReviewMutation } from '@/hooks/useMutation/useReviewMutations';
import { useReviewDataQuery } from '@/hooks/useQueries/useReviewQuery';
import { FaCamera } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { customSuccessToast } from '../common/customToast';

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
    setEditedTitle(reviewDetail?.review_title || '');
    setEditedContent(reviewDetail?.review_contents || '');
    setPreviewImages(reviewDetail?.image_urls || []);
    setFiles([]);
    onClose();
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

    customSuccessToast('리뷰가 수정되었습니다.');
    onClose();
    window.location.reload();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} placement="top-center">
        <ModalContent
          className="w-full flex justify-center items-center"
          style={{ maxWidth: '764px', minHeight: '658px', margin: 'auto' }}
        >
          {(onClose) => (
            <>
              <ModalHeader className="flex w-full h-[112px] justify-center flex-col gap-1 p-[32px]">
                <p className="text-2xl font-semibold text-grayBlack">리뷰 수정하기</p>
                <p className="text-gray2 text-sm">미팅에 대한 후기를 남겨보세요</p>
              </ModalHeader>
              <form className="w-full px-[32px] pb-[32px] flex flex-col bg-white" onSubmit={handleEditReview}>
                <div className="rounded-[30px]">
                  <ModalBody className="p-0 gap-2">
                    <div className="flex">
                      <label className="text-sm">Title</label>
                      <p className="text-requiredRed text-sm">*</p>
                    </div>
                    <textarea
                      autoFocus
                      id="review_title"
                      required
                      rows={1}
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      placeholder="제목을 입력해주세요."
                      className="outline-none border rounded-[8px] resize-none border-borderSecondary py-[8px] pl-[12px] mb-[16px] max-w-[1050px] text-sm bg-boxSecondary"
                      maxLength={20}
                    />
                    <div className="flex">
                      <label className="text-sm">Content</label>
                      <p className="text-requiredRed text-sm">*</p>
                    </div>
                    <textarea
                      id="review_contents"
                      required
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      placeholder="내용을 입력해주세요.(200자 이내)"
                      className="outline-none text-sm resize-none border border-borderSecondary rounded-[8px] py-[8px] pl-[12px] max-w-[1050px] max-h-[280px] "
                      rows={8}
                      maxLength={200}
                    />
                    <div className="flex flex-col gap-2 my-[16px] relative">
                      <div className="flex items-center gap-2">
                        <FaCamera className="text-gray3" />
                        <label className="text-gray3 text-sm">첨부된 사진</label>
                      </div>
                      <div className="flex gap-2">
                        {previewImages.map((imageUrl, index) => (
                          <div key={index} className="relative w-20 h-20 aspect-square">
                            <Image
                              src={imageUrl}
                              alt={`Preview Image ${index}`}
                              className="object-cover rounded-[10px]"
                              fill={true}
                            />
                            <button
                              className="absolute top-0 right-0 p-1 rounded-full text-gray1"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteImage(index);
                              }}
                            >
                              <MdCancel />
                            </button>
                          </div>
                        ))}
                        {files.length <= 4 && (
                          <>
                            {files.map((file, index) => (
                              <div key={file.name} className="w-20 h-20 aspect-square relative">
                                <Image
                                  className="object-cover rounded-[10px]"
                                  src={URL.createObjectURL(file)}
                                  alt={`local file ${index}`}
                                  fill={true}
                                  sizes="200px"
                                />
                                <button
                                  className="absolute top-0 right-0 p-1 rounded-full text-gray1"
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
                          </>
                        )}
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
                            className={`flex items-center w-20 h-20 ${files.length === 0 && 'rounded-[8px]'}`}
                            htmlFor="input-upload"
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                          >
                            {dragging && <div className="inset-0 z-10 bg-sky-500/20 pointer-events-none" />}
                            {totalFiles < 4 && (
                              <div className="flex items-center justify-center pointer-events-none rounded-[8px] w-full h-full border-medium border-dashed border-[#AEB3B9] opacity-80">
                                <FaPlus className="text-[#AEB3B9] text-2xl" />
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end mt-[40px]">
                      <button
                        onClick={handleClose}
                        type="button"
                        className="rounded-[8px] bg-white text-grayBlack text-sm font-semibold border-1 border-[#E5E7EB] px-[12px] py-[6px] hover:opacity-70"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="rounded-[8px] bg-[#E5E7EB] text-[#9CA3AF] text-sm font-semibold px-[12px] py-[6px] hover:opacity-70"
                      >
                        등록하기
                      </button>
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
