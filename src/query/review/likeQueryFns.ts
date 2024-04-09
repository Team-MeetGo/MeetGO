import { clientSupabase } from '(@/utils/supabase/client)';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LIKE_TOGGLE_KEY } from './likeQueryKeys';

export const fetchLikestatus = async (review_id: string) => {
  const { data: likedUsers, error } = await clientSupabase
    .from('review_like')
    .select('user_id')
    .eq('review_id', review_id);
  if (error) {
    console.error('좋아요 정보를 불러오지 못함', error);
  } else {
    return likedUsers;
  }
};

export const fetchLikeCount = async (review_id: string) => {
  const { data: likeCountData, error } = await clientSupabase
    .from('review_like')
    .select('*')
    .eq('review_id', review_id);

  if (error) {
    console.error('좋아요 개수를 불러오지 못함', error);
  } else {
    return likeCountData;
  }
};

export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();

  const toggleLikeMutation = useMutation({
    mutationFn: async ({ review_id, userId }: { review_id: string; userId: string }) => {
      const { data: existingLikedData, error } = await clientSupabase
        .from('review_like')
        .select('review_id')
        .eq('review_id', review_id)
        .eq('user_id', userId);

      if (existingLikedData && existingLikedData.length > 0) {
        await clientSupabase.from('review_like').delete().eq('review_id', review_id).eq('user_id', userId);
      } else {
        await clientSupabase.from('review_like').insert([{ review_id, user_id: userId }]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIKE_TOGGLE_KEY });
    }
  });

  return toggleLikeMutation;
};
