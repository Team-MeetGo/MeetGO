// 'use client';

// import React, { useEffect, useState } from 'react';
// import ToggleButton from './ToggleButton';
// import HeartFillIcon from '(@/utils/icons/HeartFillIcon)';
// import HeartIcon from '(@/utils/icons/HeartIcon)';
// import { clientSupabase } from '(@/utils/supabase/client)';
// import { userStore } from '(@/store/userStore)';
// import { useSuspenseQuery } from '@tanstack/react-query';
// import { LIKED_COUNT_QUERY_KEY, LIKED_QUERY_KEY } from '(@/query/review/reviewQueryKeys)';
// import { fetchLikeCount, fetchLikestatus } from '(@/query/review/reviewQueryFns)';

// type Props = {
//   review_id: string;
// };

// const ReviewHeart = ({ review_id }: Props) => {
//   const [likes, setLikes] = useState<boolean | null>(null);
//   const [likeCount, setLikeCount] = useState(0);
//   const [likeUser, setLikeUser] = useState<string[]>([]);

//   const { user, setUser } = userStore((state) => state);
//   const userId = user && user[0].user_id;

//   const useLikedReviewDataQuery = (review_id: string) => {
//     const { data: likedUsers } = useSuspenseQuery({
//       queryKey: [LIKED_QUERY_KEY, review_id],
//       queryFn: async () => await fetchLikestatus(review_id)
//     });
//     return likedUsers;
//   };

//   const likedUsers = useLikedReviewDataQuery(review_id);

//   useEffect(() => {
//     if (!likedUsers || likedUsers.length === 0) {
//       setLikes(false);
//       return;
//     }
//     const userLikes = likedUsers.some((likedUser) => likedUser.user_id === userId);
//     setLikes(userLikes);
//   }, [likedUsers, userId]);

//   const useLikedReviewCountQuery = (review_id: string) => {
//     const { data: likeCountData, error } = useSuspenseQuery({
//       queryKey: [LIKED_COUNT_QUERY_KEY, review_id],
//       queryFn: async () => await fetchLikeCount(review_id)
//     });
//     if (error) {
//       console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
//       return 0;
//     }
//     return likeCountData;
//   };

//   const likeCountData = useLikedReviewCountQuery(review_id);

//   useEffect(() => {
//     if (likeCountData) {
//       setLikeCount(likeCountData.length);
//     } else {
//       setLikeCount(0);
//     }
//   }, [likeCountData]);

//   const handleLikeToggle = async () => {
//     if (!userId) {
//       alert('로그인 후 이용해주세요.');
//       return;
//     }

//     const { data: existingData } = await clientSupabase
//       .from('review_like')
//       .select('review_id')
//       .eq('review_id', review_id)
//       .eq('user_id', userId);

//     if (existingData && existingData.length > 0) {
//       await clientSupabase.from('review_like').delete().eq('review_id', review_id).eq('user_id', userId);
//       setLikeCount((prevCount) => prevCount - 1);
//       setLikes(false);
//       setLikeUser((prevLikeUser) => prevLikeUser.filter((id) => id !== userId));
//     } else {
//       await clientSupabase.from('review_like').insert([{ review_id, user_id: userId }]);
//       setLikeCount((prevCount) => prevCount + 1);
//       setLikes(true);
//       setLikeUser((prevLikeUser) => [...prevLikeUser, userId]);
//     }
//   };

//   return (
//     <div className="flex gap-1 items-center">
//       <div>
//         <ToggleButton
//           toggled={likes ?? false}
//           onToggle={handleLikeToggle}
//           onIcon={<HeartFillIcon />}
//           offIcon={<HeartIcon />}
//         />
//       </div>
//       <div className="pb-1">{likeCount}</div>
//     </div>
//   );
// };

// export default ReviewHeart;

'use client';

import React, { useEffect, useState } from 'react';
import ToggleButton from './ToggleButton';
import HeartFillIcon from '(@/utils/icons/HeartFillIcon)';
import HeartIcon from '(@/utils/icons/HeartIcon)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { userStore } from '(@/store/userStore)';
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { LIKED_COUNT_QUERY_KEY, LIKED_QUERY_KEY, LIKE_TOGGLE_KEY } from '(@/query/review/reviewQueryKeys)';
import { fetchLikeCount, fetchLikestatus, fetchToggleLike } from '(@/query/review/reviewQueryFns)';

type Props = {
  review_id: string;
};

const ReviewHeart = ({ review_id }: Props) => {
  const [likes, setLikes] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [likeUser, setLikeUser] = useState<string[]>([]);

  const { user, setUser } = userStore((state) => state);
  const userId = user && user[0].user_id;

  const useLikedReviewDataQuery = (review_id: string) => {
    const { data: likedUsers } = useSuspenseQuery({
      queryKey: [LIKED_QUERY_KEY, review_id],
      queryFn: async () => await fetchLikestatus(review_id)
    });
    return likedUsers;
  };

  const likedUsers = useLikedReviewDataQuery(review_id);

  useEffect(() => {
    if (!likedUsers || likedUsers.length === 0) {
      setLikes(false);
      return;
    }
    const userLikes = likedUsers.some((likedUser) => likedUser.user_id === userId);
    setLikes(userLikes);
  }, [likedUsers, userId]);

  const useLikedReviewCountQuery = (review_id: string) => {
    const { data: likeCountData, error } = useSuspenseQuery({
      queryKey: [LIKED_COUNT_QUERY_KEY, review_id],
      queryFn: async () => await fetchLikeCount(review_id)
    });
    if (error) {
      console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
      return 0;
    }
    return likeCountData;
  };

  const likeCountData = useLikedReviewCountQuery(review_id);

  useEffect(() => {
    if (likeCountData) {
      setLikeCount(likeCountData.length);
    } else {
      setLikeCount(0);
    }
  }, [likeCountData]);

  // const useLikeToggleQuery = (review_id: string, userId: string) => {
  //   const queryClient = useQueryClient();
  //   const { data: likeToggle, error } = useQuery(
  //     [LIKE_TOGGLE_KEY, review_id, userId],
  //     {
  //       onSuccess: () => {
  //         queryClient.invalidateQueries([LIKE_TOGGLE_KEY, review_id, userId]);
  //       }
  //     }
  //   );
  //   return { likeToggle, error };
  // };

  const handleLikeToggle = async () => {
    if (!userId) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    try {
      await fetchToggleLike(review_id, userId);
      if (likes) {
        setLikeCount((prevCount) => prevCount - 1);
        setLikes(false);
        setLikeUser((prevLikeUser) => prevLikeUser.filter((id) => id !== userId));
      } else {
        setLikeCount((prevCount) => prevCount + 1);
        setLikes(true);
        setLikeUser((prevLikeUser) => [...prevLikeUser, userId]);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="flex gap-1 items-center">
      <div>
        <ToggleButton
          toggled={likes ?? false}
          onToggle={handleLikeToggle}
          onIcon={<HeartFillIcon />}
          offIcon={<HeartIcon />}
        />
      </div>
      <div className="pb-1">{likeCount}</div>
    </div>
  );
};

export default ReviewHeart;
