import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Button, Checkbox, Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/react';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';
import { MdCancel } from 'react-icons/md';
import { userStore } from '(@/store/userStore)';
import { LuImagePlus } from 'react-icons/lu';
import { useNewReviewMutation } from '(@/query/review/reviewQueryFns)';

const NewReview = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [showNickname, setShowNickname] = useState(true);
  const router = useRouter();

  const { user, setUser } = userStore((state) => state);
  const userId = (user && user[0].user_id) as string;
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrls: string[] = [];
    for (const file of files) {
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
      imageUrls.push(imageUrl.publicUrl);
    }

    const reviewTitle = (document.getElementById('review_title') as HTMLInputElement)?.value;
    const reviewContents = (document.getElementById('review_contents') as HTMLInputElement)?.value;

    addNewReviewMutation.mutate({ userId, reviewTitle, reviewContents, imageUrls, show_nickname });

    // const { data: insertedData, error: insertError } = await clientSupabase.from('review').insert([
    //   {
    //     review_title: reviewTitle,
    //     review_contents: reviewContents,
    //     image_urls: imageUrls,
    //     user_id: userId,
    //     show_nickname
    //   }
    // ]);

    // if (insertError) {
    //   console.error('insert error', insertError);
    //   return;
    // }

    alert('리뷰가 등록되었습니다.');
    window.location.reload();
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
                  <Checkbox
                    defaultSelected={showNickname}
                    onChange={() => setShowNickname(!showNickname)}
                    className="text-black"
                  >
                    닉네임 표시
                  </Checkbox>
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
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={handleClose}
                      className="w-[50px] h-[50px] rounded-[10px] mt-[30px] flex justify-center items-center bg-white text-[#A1A1AA] border-1 border-[#A1A1AA]"
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      className="w-[50px] h-[50px] rounded-[10px] mt-[30px] flex justify-center items-center bg-[#8F5DF4] text-white"
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
