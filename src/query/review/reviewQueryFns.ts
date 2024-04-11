import { clientSupabase } from '(@/utils/supabase/client)';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NEW_REVIEW_QUERY_KEY } from './reviewQueryKeys';

export const fetchAuthorData = async (review_id: string) => {
  const { data: reviewDetail, error } = await clientSupabase
    .from('review')
    .select('review_title, review_contents, created_at, user_id, image_urls')
    .eq('review_id', review_id)
    .single();

  if (error) {
    console.error('리뷰를 불러오지 못함', error);
  } else {
    if (reviewDetail) {
      const { user_id } = reviewDetail;
      const { data: userData, error: userError } = await clientSupabase
        .from('users')
        .select('nickname, avatar')
        .eq('user_id', user_id as string)
        .single();

      if (userError) {
        console.error('유저 정보를 불러오지 못함', userError);
        return null;
      } else {
        return userData || null;
      }
    }
  }
};

export const fetchReviewData = async (review_id: string) => {
  const { data: reviewDetail, error } = await clientSupabase
    .from('review')
    .select('review_title, review_contents, created_at, user_id, image_urls, show_nickname')
    .eq('review_id', review_id)
    .single();

  if (error) {
    console.error('리뷰를 불러오지 못함', error);
  } else {
    return reviewDetail;
  }
};

export const fetchReviewList = async () => {
  let { data, count } = await clientSupabase.from('review').select('*', { count: 'estimated' });
  return { data, count };
};

export const fetchLikedReviewList = async () => {
  let { data: likedReviewList } = await clientSupabase.from('review_like').select('review_id');
  return likedReviewList;
};

export const useDeleteReviewMutation = () => {
  const deleteCommentMutation = useMutation({
    mutationFn: async (review_id: string) => {
      const { error: commentDeleteError } = await clientSupabase
        .from('review_comment')
        .delete()
        .eq('review_id', review_id);
      const { error: likeDeleteError } = await clientSupabase.from('review_like').delete().eq('review_id', review_id);
      const { error: reviewDeleteError } = await clientSupabase.from('review').delete().eq('review_id', review_id);
    }
  });
  return deleteCommentMutation;
};

export const useNewReviewMutation = () => {
  const queryClient = useQueryClient();
  const newReviewMutation = useMutation({
    mutationFn: async ({
      reviewTitle,
      reviewContents,
      imageUrls,
      userId,
      show_nickname
    }: {
      reviewTitle: string;
      reviewContents: string;
      imageUrls: string[];
      userId: string;
      show_nickname: boolean;
    }) => {
      const { data: newReview, error: newReviewError } = await clientSupabase.from('review').insert([
        {
          review_title: reviewTitle,
          review_contents: reviewContents,
          image_urls: imageUrls,
          user_id: userId,
          show_nickname
        }
      ]);
      if (newReviewError) {
        console.error('insert error', newReviewError);
        return;
      }
      return newReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEW_REVIEW_QUERY_KEY });
    }
  });
  return newReviewMutation;
};

// export const useNewImgsMutation = () => {
//   const queryClient = useQueryClient();

//   const newImgsMutation = useMutation({
//     mutationFn: async (files: File[]) => {
//       const imageUrls: string[] = [];

//       for (const file of files) {
//         const uuid = crypto.randomUUID();
//         const filePath = `reviewImage/${uuid}`;

//         const uploadImage = async (filePath: string, file: File) => {
//           const { data, error } = await clientSupabase.storage.from('reviewImage').upload(filePath, file, {
//             cacheControl: '3600',
//             upsert: true
//           });

//           if (error) {
//             console.error('업로드 오류', error.message);
//             throw error;
//           }

//           return data;
//         };

//         try {
//           const data = await uploadImage(filePath, file);
//           const { data: imageUrl } = await clientSupabase.storage.from('reviewImage').getPublicUrl(data.path);
//           imageUrls.push(imageUrl.publicUrl);
//         } catch (error) {
//           console.error('이미지 업로드 오류:', error);
//           throw error;
//         }
//       }

//       return imageUrls;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: NEW_IMAGES_UPLOAD_QUERY_KEY });
//     }
//   });

//   return newImgsMutation;
// };
