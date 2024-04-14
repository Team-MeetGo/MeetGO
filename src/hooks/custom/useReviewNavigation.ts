import { useState, useEffect } from 'react';

// type Navigation = {
//   prevReviewId: string | null;
//   nextReviewId: string | null;
// };

// export const useAsyncNavigation = (reviewId: string, fetchReviewsData: any[]): [Navigation, boolean] => {
//   const [navigation, setNavigation] = useState<Navigation>({ prevReviewId: null, nextReviewId: null });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     function calculateNavigation() {
//       if (fetchReviewsData && fetchReviewsData.length > 0) {
//         const currentIndex = fetchReviewsData.findIndex((review: any) => review.review_id === reviewId);
//         if (currentIndex !== -1) {
//           const prevReview = fetchReviewsData[currentIndex - 1];
//           const nextReview = fetchReviewsData[currentIndex + 1];
//           setNavigation({
//             prevReviewId: prevReview?.review_id || null,
//             nextReviewId: nextReview?.review_id || null
//           });
//         }
//       }
//       setLoading(false);
//     }

//     calculateNavigation();
//   }, [reviewId, fetchReviewsData]);

//   return [navigation, loading];
// };

interface Review {
  created_at: string;
  image_urls: string[] | null;
  review_contents: string | null;
  review_id: string;
  review_title: string | null;
  show_nickname: boolean | null;
  user_id: string | null;
}

interface ReviewData {
  data: Review[] | null;
  count: number | null;
}

interface Navigation {
  prevReviewId: string | null;
  nextReviewId: string | null;
}

export const useAsyncNavigation = (reviewId: string, fetchReviewsData: Review[]): [Navigation, boolean] => {
  const [navigation, setNavigation] = useState<Navigation>({ prevReviewId: null, nextReviewId: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fetchReviewsData && fetchReviewsData.length > 0) {
      const sortedData = fetchReviewsData.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const currentIndex = sortedData.findIndex((review) => review.review_id === reviewId);
      if (currentIndex !== -1) {
        const prevReview = sortedData[currentIndex - 1];
        const nextReview = sortedData[currentIndex + 1];
        setNavigation({
          prevReviewId: prevReview?.review_id || null,
          nextReviewId: nextReview?.review_id || null
        });
      }
    }
    setLoading(false);
  }, [reviewId, fetchReviewsData]);

  return [navigation, loading];
};
