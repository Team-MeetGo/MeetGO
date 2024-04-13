import { clientSupabase } from '(@/utils/supabase/client)';

export const fetchUserData = async () => {
  // 유저 데이터 가져오기
  const {
    data: { user }
  } = await clientSupabase.auth.getUser();

  if (user) {
    const { data: userData } = await clientSupabase.from('users').select('*').eq('user_id', String(user.id));
    if (userData) return userData[0];
  }
  return null;
};

/** 유저의 작성 글 가져오기 */
export const fetchUserPost = async (userId: string) => {
  if (userId) {
    const { data } = await clientSupabase.from('review').select('*').eq('user_id', userId);
    if (data) return data;
  }
  return null;
};

export const fetchUserLikePost = async (userId: string) => {
  if (userId) {
    const { data } = await clientSupabase.from('review_like').select('review_id').eq('user_id', userId);
    if (data) {
      const likePostId = data.map((like: any) => like.review_id);
      const { data: reviewData } = await clientSupabase.from('review').select('*').in('review_id', likePostId);
      return reviewData;
    }
  }
  return null;
};
