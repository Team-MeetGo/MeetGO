'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Button, Checkbox, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import { MdCancel } from 'react-icons/md';
import { LuImagePlus } from 'react-icons/lu';
import { FaCheck } from 'react-icons/fa6';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useNewReviewMutation, useUploadImgsMutation } from '@/hooks/useMutation/useReviewMutations';

const NewReview = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [showNickname, setShowNickname] = useState(true);

  const { data: user } = useGetUserDataQuery();
  const userId = (user && user.user_id) || '';

  const show_nickname = showNickname;

  const handleClose = () => {
    if (window.confirm('리뷰 등록을 취소하시겠습니까?')) {
      setFiles([]);
      onClose();
    }
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
      <Modal isOpen={isOpen} onClose={handleClose} placement="top-center" className="bg-purpleSecondary">
        <ModalContent
          className="w-full flex justify-center items-center"
          style={{ maxWidth: '1000px', minHeight: '830px' }}
        >
          {(onClose) => (
            <>
              <ModalHeader className="flex w-full h-[112px] justify-center items-center flex-col gap-1 bg-purpleSecondary">
                <p className="w-full text-[40px]">리뷰 작성하기</p>
              </ModalHeader>
              <form className="w-full p-[32px] flex flex-col bg-white" onSubmit={handleSubmit}>
                <div className="rounded-[30px]">
                  <ModalBody>
                    <div className="flex gap-2 mb-[32px] relative">
                      {files.length <= 4 && (
                        <div className="flex justify-center gap-2">
                          {files.map((file, index) => (
                            <div key={file.name} className="relative absolute w-[140px] h-[140px] aspect-square">
                              <Image
                                className="object-cover rounded-[10px]"
                                src={URL.createObjectURL(file)}
                                alt={`local file ${index}`}
                                fill
                              />
                              <button
                                className="absolute top-0 right-0 p-2  rounded-full w-8 h-8"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteImage(index);
                                }}
                              >
                                <MdCancel />
                              </button>
                            </div>
                          ))}
                        </div>
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
                          className={`flex items-center ${files.length === 0 && 'rounded-[10px]'}`}
                          htmlFor="input-upload"
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        >
                          {dragging && <div className="inset-0 z-10 bg-sky-500/20 pointer-events-none" />}
                          {files.length < 4 && (
                            <div className="flex items-center justify-center pointer-events-none rounded-[10px] w-[140px] h-[140px] bg-gray-300">
                              <LuImagePlus className="w-20 h-20 text-[#A1A1AA]" />
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                    <textarea
                      autoFocus
                      id="review_title"
                      required
                      rows={1}
                      placeholder="제목을 입력해주세요."
                      className="outline-none border-1 rounded-[10px] resize-none border-mainColor pt-[16px] pb-[16px] pl-[24px] mb-2 max-w-[1050px] text-[30px]"
                      maxLength={20}
                    />
                    <textarea
                      id="review_contents"
                      required
                      placeholder="내용을 입력해주세요.(200자 이내)"
                      className="outline-none text-[16px] resize-none border-1 rounded-[10px] p-[15px] border-mainColor pt-[16px] pb-[16px] pl-[24px] max-w-[1050px] max-h-[280px]"
                      rows={8}
                      maxLength={200}
                    />
                    <Checkbox
                      defaultSelected={!showNickname}
                      onChange={() => setShowNickname(!showNickname)}
                      className="text-black"
                      color="secondary"
                      radius="sm"
                      icon={<FaCheck />}
                    >
                      익명으로 게시
                    </Checkbox>
                    <div className="flex gap-2 justify-end mt-[45px]">
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
                        등록
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
};

export default NewReview;
