import { UserType } from '@/types/roomTypes';
import { clientSupabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export const fetchUserData = async () => {
  // 유저 데이터 가져오기
  const {
    data: { user },
    error
  } = await clientSupabase.auth.getUser();
  if (!user || error) throw error;
  const { data: userData, error: userDataErr } = await clientSupabase
    .from('users')
    .select('*')
    .eq('user_id', String((user as User).id));
  if (userDataErr || !userData) {
    throw new Error('error');
  } else {
    return userData[0] as UserType;
  }
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
