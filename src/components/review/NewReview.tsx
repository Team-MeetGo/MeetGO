'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Button, Checkbox, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import { MdCancel } from 'react-icons/md';
import { FaCheck, FaPlus } from 'react-icons/fa6';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useNewReviewMutation, useUploadImgsMutation } from '@/hooks/useMutation/useReviewMutations';
import { FaCamera } from 'react-icons/fa';

const NewReview = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [showNickname, setShowNickname] = useState(true);

  const { data: user } = useGetUserDataQuery();
  const userId = (user && user.user_id) || '';

  const show_nickname = showNickname;

  const handleClose = () => {
    setFiles([]);
    onClose();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const fileList = e.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      setFiles((prevFiles) => [...prevFiles, ...filesArray]);
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
    const fileList = e.dataTransfer?.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      setFiles(filesArray);
    }
  };

  const handleDeleteImage = (indexToRemove: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index != indexToRemove));
  };

  const addNewReviewMutation = useNewReviewMutation();
  const addUploadImgsMutation = useUploadImgsMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrls: string[] = [];
    for (const file of files) {
      const uuid = crypto.randomUUID();
      const filePath = `reviewImage/${uuid}`;

      try {
        const publicUrl = await addUploadImgsMutation.mutateAsync({
          filePath,
          file
        });

        imageUrls.push(publicUrl);
      } catch (error) {
        console.error('업로드 실패:', error);
      }
    }
    const reviewTitle = (document.getElementById('review_title') as HTMLInputElement)?.value;
    const reviewContents = (document.getElementById('review_contents') as HTMLInputElement)?.value;

    addNewReviewMutation.mutate({
      userId,
      reviewTitle,
      reviewContents,
      imageUrls,
      show_nickname
    });

    alert('리뷰가 등록되었습니다.');
    window.location.reload();
    console.error('이미지 업로드에 실패했습니다.');
  };

  return (
    <>
      <Button onPress={onOpen} color="primary" className="text-[16px] p-[16px] bg-mainColor w-[128px] h-[51px]">
        리뷰 작성하기
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} placement="top-center">
        <ModalContent
          className="w-full flex justify-center items-center"
          style={{ maxWidth: '764px', minHeight: '658px', margin: 'auto' }}
        >
          {(onClose) => (
            <>
              <ModalHeader className="flex w-full h-[112px] justify-center flex-col gap-1 p-[32px]">
                <p className="text-2xl font-semibold text-grayBlack">리뷰 작성하기</p>
                <p className="text-gray2 text-sm">미팅에 대한 후기를 남겨보세요</p>
              </ModalHeader>
              <form className="w-full px-[32px] pb-[32px] flex flex-col bg-white" onSubmit={handleSubmit}>
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
                                    handleDeleteImage(index);
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
                            multiple
                            onChange={handleChange}
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
                            {files.length < 4 && (
                              <div className="flex items-center justify-center pointer-events-none rounded-[8px] w-full h-full border-medium border-dashed border-[#AEB3B9] opacity-80">
                                <FaPlus className="text-[#AEB3B9] text-2xl" />
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <Checkbox
                      defaultSelected={!showNickname}
                      onChange={() => setShowNickname(!showNickname)}
                      className="text-black"
                      color="secondary"
                      radius="sm"
                      icon={<FaCheck />}
                    >
                      익명으로 작성하기
                    </Checkbox>
                    <div className="flex gap-2 justify-end mt-[40px]">
                      <button
                        onClick={handleClose}
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
};

export default NewReview;
