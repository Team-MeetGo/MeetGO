import { clientSupabase } from '(@/utils/supabase/client)';

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
