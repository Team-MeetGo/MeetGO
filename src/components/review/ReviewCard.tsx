import Image from 'next/image';
import Link from 'next/link';
import ReviewComment from './ReviewComment';
import ReviewHeart from './ReviewHeart';
import defaultImg from '../../../public/defaultImg.jpg';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AUTHOR_QUERY_KEY } from '(@/query/review/reviewQueryKeys)';
import { fetchAuthorData } from '(@/query/review/reviewQueryFns)';

export type ReviewType = {
  user_id: string | null;
  review_id: string;
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  image_urls: string[] | null;
  show_nickname: boolean | null;
};

const ReviewCard = ({ review }: { review: ReviewType }) => {
  const useAuthorDataQuery = (review_id: string) => {
    const { data: userData } = useSuspenseQuery({
      queryKey: [AUTHOR_QUERY_KEY, review_id],
      queryFn: async () => await fetchAuthorData(review_id)
    });
    return userData;
  };

  const userData = useAuthorDataQuery(review.review_id);
  const authorNickname = userData?.nickname || null;

  return (
    <div
      key={review.review_id}
      className="flex flex-col justify-center item-center border-1 border-[#A1A1AA] rounded-[10px] p-4"
    >
      <Link href={`/review/${review.review_id}`}>
        <div>
          {review.image_urls && review.image_urls.length > 0 ? (
            <Image
              src={review.image_urls[0]}
              alt="reviewImage"
              height={400}
              width={400}
              className="w-full h-[280px] object-cover rounded-[10px]"
            />
          ) : (
            <Image
              src={defaultImg}
              alt="reviewImage"
              height={400}
              width={400}
              className="w-full h-[280px] object-cover rounded-[10px]"
            />
          )}
        </div>
        <div>{review.review_title}</div>
        <div>{review.review_contents}</div>
        <div>{review.show_nickname ? authorNickname || '익명유저' : '익명유저'}</div>
      </Link>
      <div className="flex gap-2">
        <ReviewHeart review_id={review.review_id} />
        <ReviewComment review_id={review.review_id} />
      </div>
    </div>
  );
};

export default ReviewCard;
