import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Button, Checkbox, Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { MdCancel } from 'react-icons/md';
import { LuImagePlus } from 'react-icons/lu';
import { useNewReviewMutation, useUploadImgsMutation } from '(@/query/review/reviewQueryFns)';
import { FaCheck } from 'react-icons/fa6';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';

const NewReview = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [showNickname, setShowNickname] = useState(true);
  const router = useRouter();

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
    if (imageUrls.length > 0) {
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
    } else {
      console.error('이미지 업로드에 실패했습니다.');
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="primary">
        새 리뷰 등록
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} placement="top-center" className="bg-[#F2EAFA]">
        <ModalContent className="w-full flex justify-center items-center" style={{ maxWidth: '1000px' }}>
          {(onClose) => (
            <form className="w-full flex flex-col mt-2 bg-[#F2EAFA]" onSubmit={handleSubmit}>
              <div className=" p-8 rounded-[30px]">
                <ModalBody>
                  <div className="flex gap-2 mt-[10px] mb-[10px] relative">
                    {files.length <= 4 && (
                      <div className="flex justify-center gap-2">
                        {files.map((file, index) => (
                          <div key={index} className="relative absolute w-[150px] h-[150px] aspect-square">
                            <Image
                              className="object-cover rounded-[20px]"
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
                          <div className="flex items-center justify-center pointer-events-none rounded-[20px] w-[150px] h-[150px] bg-gray-300">
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
                    className="outline-none text-lg border-1 rounded-[10px] resize-none border-[#8F5DF4] p-[8px] pl-4 mb-2"
                    maxLength={20}
                  />
                  <textarea
                    id="review_contents"
                    required
                    placeholder="내용을 입력해주세요.(200자 이내)"
                    className="outline-none text-lg resize-none border-1 rounded-[10px] p-[15px] border-[#8F5DF4]"
                    rows={6}
                    maxLength={200}
                  />
                  <Checkbox
                    defaultSelected={showNickname}
                    onChange={() => setShowNickname(!showNickname)}
                    className="text-black"
                    icon={<FaCheck />}
                  >
                    익명으로 게시
                  </Checkbox>
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={handleClose}
                      className="w-[50px] h-[50px] rounded-[10px] flex justify-center items-center bg-white text-[#A1A1AA] border-1 border-[#A1A1AA]"
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      className="w-[50px] h-[50px] rounded-[10px] flex justify-center items-center bg-[#8F5DF4] text-white"
                    >
                      등록
                    </Button>
                  </div>
                </ModalBody>
              </div>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewReview;
