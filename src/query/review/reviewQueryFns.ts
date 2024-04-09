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
