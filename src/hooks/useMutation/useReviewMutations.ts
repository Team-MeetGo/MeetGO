import { clientSupabase } from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  EDIT_IMGS_QUERY_KEY,
  EDIT_REVIEW_QUERY_KEY,
  NEW_IMGS_QUERY_KEY,
  NEW_REVIEW_QUERY_KEY,
  REVIEWLIST_QUERY_KEY
} from '../../query/review/reviewQueryKeys';

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  const deleteCommentMutation = useMutation({
    mutationFn: async (review_id: string) => {
      const { error: commentDeleteError } = await clientSupabase
        .from('review_comment')
        .delete()
        .eq('review_id', review_id);
      const { error: likeDeleteError } = await clientSupabase.from('review_like').delete().eq('review_id', review_id);
      const { error: reviewDeleteError } = await clientSupabase.from('review').delete().eq('review_id', review_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REVIEWLIST_QUERY_KEY]
      });
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
      queryClient.invalidateQueries({
        queryKey: [REVIEWLIST_QUERY_KEY]
      });
    }
  });
  return newReviewMutation;
};

export const useUploadImgsMutation = () => {
  const queryClient = useQueryClient();
  const uploadImgsMutation = useMutation({
    mutationFn: async ({ filePath, file }: { filePath: string; file: File }) => {
      const { data: uploadImgsData, error: uploadImgError } = await clientSupabase.storage
        .from('reviewImage')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadImgError) {
        console.error('insert error', uploadImgError);
        throw uploadImgError;
      }
      const { data: imageUrlData } = await clientSupabase.storage.from('reviewImage').getPublicUrl(uploadImgsData.path);

      return imageUrlData.publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEW_IMGS_QUERY_KEY });
    }
  });
  return uploadImgsMutation;
};

export const useEditReviewMutation = () => {
  const queryClient = useQueryClient();
  const editReviewMutation = useMutation({
    mutationFn: async ({
      editedTitle,
      editedContent,
      allImages,
      review_id
    }: {
      editedTitle: string;
      editedContent: string;
      allImages: string[];
      review_id: string;
    }) => {
      const { data: updateReview, error: editReviewError } = await clientSupabase
        .from('review')
        .update({ review_title: editedTitle, review_contents: editedContent, image_urls: allImages })
        .eq('review_id', review_id)
        .select();
      if (editReviewError) {
        console.error('insert error', editReviewError);
        return;
      }
      return updateReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EDIT_REVIEW_QUERY_KEY });
    }
  });
  return editReviewMutation;
};

export const useEditImgsMutation = () => {
  const queryClient = useQueryClient();
  const editImgsMutation = useMutation({
    mutationFn: async ({ filePath, file }: { filePath: string; file: File }) => {
      const { data: editImgsData, error } = await clientSupabase.storage.from('reviewImage').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

      if (error) {
        console.error('업로드 오류', error.message);
        throw error;
      }

      const { data: imageUrlData } = await clientSupabase.storage.from('reviewImage').getPublicUrl(editImgsData.path);
      return imageUrlData.publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EDIT_IMGS_QUERY_KEY });
    }
  });
  return editImgsMutation;
};
