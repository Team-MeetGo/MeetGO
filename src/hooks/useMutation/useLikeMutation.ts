import { LIKE_TOGGLE_KEY } from '@/query/review/likeQueryKeys';
import { clientSupabase } from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
