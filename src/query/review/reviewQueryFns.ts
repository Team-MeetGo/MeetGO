import { clientSupabase } from '(@/utils/supabase/client)';

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
      } else {
        return userData;
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

export const fetchToggleLike = async (review_id: string, userId: string) => {
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
};
