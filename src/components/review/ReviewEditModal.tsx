// 'use client';

// import { clientSupabase } from '(@/utils/supabase/client)';
// import { Modal, ModalContent, ModalBody, Button, useDisclosure } from '@nextui-org/react';
// import Image from 'next/image';
// import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
// import { ReviewDetailType } from './ReviewDetail';
// import { MdCancel } from 'react-icons/md';
// import { LuImagePlus } from 'react-icons/lu';
// import type { UseDisclosureReturn } from '@nextui-org/use-disclosure';

// type Props = {
//   review_id: string;
//   disclosure: UseDisclosureReturn;
// };

// export default function ReviewEditModal({ review_id, disclosure }: Props) {
//   // const { isOpen, onOpen, onClose } = useDisclosure();
//   const { isOpen, onClose } = disclosure;
//   // const [isOpen, setIsOpen] = useState(false);
//   const [dragging, setDragging] = useState(false);
//   const [files, setFiles] = useState<File[]>([]);
//   const [reviewDetail, setReviewDetail] = useState<ReviewDetailType | null>(null);
//   const [editedTitle, setEditedTitle] = useState<string>('');
//   const [editedContent, setEditedContent] = useState<string>('');
//   const [previewImages, setPreviewImages] = useState<string[]>([]);

//   const totalFiles = files.length + previewImages.length;

//   useEffect(() => {
//     if (review_id && !reviewDetail) {
//       getReviewDetail(review_id);
//     }
//   }, []);

//   useEffect(() => {
//     if (reviewDetail) {
//       setEditedTitle(reviewDetail.review_title || '');
//       setEditedContent(reviewDetail.review_contents || '');
//       setPreviewImages(reviewDetail.image_urls || []);
//     }
//   }, [reviewDetail]);

//   async function getReviewDetail(review_id: string) {
//     let { data: reviewDetail, error } = await clientSupabase
//       .from('review')
//       .select('review_title, review_contents, created_at, user_id, image_urls, show_nickname')
//       .eq('review_id', review_id);

//     if (error) {
//       console.error('리뷰 가져오는 중 에러 발생', error);
//     }

//     if (reviewDetail && reviewDetail.length > 0) {
//       setReviewDetail(reviewDetail[0]);
//     }
//   }

//   const handleClose = () => {
//     if (window.confirm('리뷰 수정을 취소하시겠습니까?')) {
//       setEditedTitle(reviewDetail?.review_title || '');
//       setEditedContent(reviewDetail?.review_contents || '');
//       setPreviewImages(reviewDetail?.image_urls || []);
//       setFiles([]);
//       onClose();
//       // setIsOpen(false);
//     }
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const newFiles = e.target?.files;
//     if (newFiles) {
//       setFiles([...files, ...Array.from(newFiles)]);
//     }
//   };

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     if (e.type === 'dragenter') {
//       setDragging(true);
//     } else if (e.type === 'dragleave') {
//       setDragging(false);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragging(false);
//     const newFiles = e.dataTransfer?.files;
//     if (newFiles) {
//       setFiles(Array.from(newFiles));
//     }
//   };

//   const handleDeleteImage = async (indexToRemove?: number) => {
//     if (indexToRemove !== undefined) {
//       const updatedImages = previewImages.filter((_, index) => index !== indexToRemove);
//       setPreviewImages(updatedImages);
//     }
//   };

//   const handleEditReview = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const updatedImages = await Promise.all(
//       files.map(async (file) => {
//         const uuid = crypto.randomUUID();
//         const filePath = `reviewImage/${uuid}`;
//         const { data, error } = await clientSupabase.storage.from('reviewImage').upload(filePath, file, {
//           cacheControl: '3600',
//           upsert: true
//         });

//         if (error) {
//           console.error('업로드 오류', error.message);
//           throw error;
//         }

//         const { data: imageUrl } = await clientSupabase.storage.from('reviewImage').getPublicUrl(data.path);
//         return imageUrl.publicUrl;
//       })
//     );

//     const allImages = [...previewImages, ...updatedImages];

//     const { data: updateReview, error } = await clientSupabase
//       .from('review')
//       .update({ review_title: editedTitle, review_contents: editedContent, image_urls: allImages })
//       .eq('review_id', review_id);

//     if (error) {
//       console.log('리뷰 수정 오류', error.message);
//     } else {
//       alert('리뷰가 수정되었습니다.');
//       onClose();
//       // setIsOpen(false);
//       window.location.reload();
//     }
//   };

//   return (
//     <>
//       {/* <Button className="bg-transparent" onClick={onOpen}>
//         수정
//       </Button> */}
//       <Modal isOpen={isOpen} onClose={handleClose} placement="top-center" className="bg-[#F2EAFA]">
//         <ModalContent className="w-full flex justify-center items-center" style={{ maxWidth: '1000px' }}>
//           {(onClose) => (
//             <form className="w-full flex flex-col mt-2" onSubmit={handleEditReview}>
//               <div className="p-8 rounded-[30px]">
//                 <ModalBody>
//                   <div className="flex mt-[10px] mb-[10px] gap-2">
//                     <div className="flex gap-2">
//                       {previewImages.map((imageUrl, index) => (
//                         <div key={index} className="relative absolute w-[150px] h-[150px] aspect-square">
//                           <Image
//                             src={imageUrl}
//                             alt={`Preview Image ${index}`}
//                             className="object-cover rounded-[20px]"
//                             fill
//                           />
//                           <button
//                             className="absolute top-0 right-0 p-2 rounded-full w-8 h-8"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               handleDeleteImage(index);
//                             }}
//                           >
//                             <MdCancel />
//                           </button>
//                         </div>
//                       ))}
//                       {files.map((file, index) => (
//                         <div key={index} className="relative w-[150px] h-[150px] aspect-square">
//                           <Image
//                             className="object-cover rounded-[20px] w-[150px] h-[150px]"
//                             src={URL.createObjectURL(file)}
//                             alt="local file"
//                             fill
//                           />
//                           <button
//                             className="absolute top-0 right-0 p-2 rounded-full w-8 h-8"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               const updatedFiles = files.filter((_, i) => i !== index);
//                               setFiles(updatedFiles);
//                             }}
//                           >
//                             <MdCancel />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                     <input
//                       className="hidden items-center justify-center"
//                       name="input"
//                       id="input-upload"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleChange}
//                       onDragEnter={handleDrag}
//                       onDragLeave={handleDrag}
//                       onDragOver={handleDragOver}
//                       onDrop={handleDrop}
//                       multiple
//                     />
//                     <label
//                       className={`w-full flex items-center rounded-[20px] gap-2  ${
//                         !files.length && previewImages.length === 0
//                       }`}
//                       htmlFor="input-upload"
//                     >
//                       {dragging && <div className="inset-0 z-10 bg-sky-500/20 pointer-events-none" />}

//                       {totalFiles < 4 && (
//                         <div className="flex items-center justify-center pointer-events-none rounded-[20px] w-[150px] h-[150px] bg-gray-300">
//                           <LuImagePlus className="w-20 h-20 text-[#A1A1AA]" />
//                         </div>
//                       )}
//                     </label>
//                   </div>
//                   <textarea
//                     required
//                     rows={1}
//                     value={editedTitle}
//                     onChange={(e) => setEditedTitle(e.target.value)}
//                     placeholder="제목을 입력해주세요."
//                     className="outline-none text-lg border-1 rounded-[10px] resize-none border-[#8F5DF4] p-[8px] pl-4 mb-2"
//                   />
//                   <textarea
//                     required
//                     value={editedContent}
//                     onChange={(e) => setEditedContent(e.target.value)}
//                     placeholder="내용을 입력해주세요.(200자 이내)"
//                     className="outline-none text-lg resize-none border-1 rounded-[10px] p-[15px] border-[#8F5DF4]"
//                     rows={6}
//                     maxLength={200}
//                   />
//                   <div className="flex gap-2 justify-end">
//                     <Button
//                       onClick={handleClose}
//                       className="w-[50px] h-[50px] rounded-[10px] mt-[30px] flex justify-center items-center bg-white text-[#A1A1AA] border-1 border-[#A1A1AA]"
//                     >
//                       취소
//                     </Button>
//                     <Button
//                       type="submit"
//                       className="w-[50px] h-[50px] rounded-[10px] mt-[30px] flex justify-center items-center bg-[#8F5DF4] text-white"
//                     >
//                       수정
//                     </Button>
//                   </div>
//                 </ModalBody>
//               </div>
//             </form>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }

'use client';

import { clientSupabase } from '(@/utils/supabase/client)';
import { Modal, ModalContent, ModalBody, Button, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ReviewDetailType } from './ReviewDetail';
import { MdCancel } from 'react-icons/md';
import { LuImagePlus } from 'react-icons/lu';
import type { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import { useQuery } from '@tanstack/react-query';
import { REVIEW_QUERY_KEY } from '(@/query/review/reviewQueryKeys)';
import { fetchReviewData, useEditImgsMutation, useEditReviewMutation } from '(@/query/review/reviewQueryFns)';

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

  const useReviewDataQuery = (review_id: string) => {
    const { data: reviewDetail } = useQuery({
      queryKey: [REVIEW_QUERY_KEY, review_id],
      queryFn: async () => await fetchReviewData(review_id)
    });
    return reviewDetail;
  };

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

    const uploadResults = await Promise.all(
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

    const updatedImageUrls = uploadResults.filter((url) => url !== null);

    if (updatedImageUrls.length > 0) {
      const reviewTitle = document.getElementById('review_title')?.value;
      const reviewContents = document.getElementById('review_contents')?.value;

      addNewReviewMutation.mutate({
        userId,
        reviewTitle,
        reviewContents,
        imageUrls: updatedImageUrls,
        show_nickname
      });

      alert('리뷰가 업데이트되었습니다.');
      window.location.reload();
    } else {
      console.error('이미지 업로드에 실패했습니다.');
    }

    const allImages = [...previewImages, ...updatedImages];

    editReviewMutation.mutate({ editedTitle, editedContent, allImages, review_id });

    alert('리뷰가 수정되었습니다.');
    onClose();
    window.location.reload();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} placement="top-center" className="bg-[#F2EAFA]">
        <ModalContent className="w-full flex justify-center items-center" style={{ maxWidth: '1000px' }}>
          {(onClose) => (
            <form className="w-full flex flex-col mt-2" onSubmit={handleEditReview}>
              <div className="p-8 rounded-[30px]">
                <ModalBody>
                  <div className="flex mt-[10px] mb-[10px] gap-2">
                    <div className="flex gap-2">
                      {previewImages.map((imageUrl, index) => (
                        <div key={index} className="relative absolute w-[150px] h-[150px] aspect-square">
                          <Image
                            src={imageUrl}
                            alt={`Preview Image ${index}`}
                            className="object-cover rounded-[20px]"
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
                        <div key={index} className="relative w-[150px] h-[150px] aspect-square">
                          <Image
                            className="object-cover rounded-[20px] w-[150px] h-[150px]"
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
                      className={`w-full flex items-center rounded-[20px] gap-2  ${
                        !files.length && previewImages.length === 0
                      }`}
                      htmlFor="input-upload"
                    >
                      {dragging && <div className="inset-0 z-10 bg-sky-500/20 pointer-events-none" />}

                      {totalFiles < 4 && (
                        <div className="flex items-center justify-center pointer-events-none rounded-[20px] w-[150px] h-[150px] bg-gray-300">
                          <LuImagePlus className="w-20 h-20 text-[#A1A1AA]" />
                        </div>
                      )}
                    </label>
                  </div>
                  <textarea
                    required
                    rows={1}
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="제목을 입력해주세요."
                    className="outline-none text-lg border-1 rounded-[10px] resize-none border-[#8F5DF4] p-[8px] pl-4 mb-2"
                  />
                  <textarea
                    required
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
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
                      수정
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
}
