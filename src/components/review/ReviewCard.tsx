import Image from 'next/image';
import Link from 'next/link';
import ReviewComment from './ReviewComment';
import defaultImg from '../../../public/defaultImg.jpg';
import ReviewLike from './ReviewLike';
import { useAuthorDataQuery } from '@/hooks/useQueries/useReviewQuery';

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
  const userData = useAuthorDataQuery(review.review_id);
  const authorNickname = userData?.nickname || null;

  const ellipsisText = (text: string | null) => {
    const maxLength = 22;
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div
      key={review.review_id}
      className="flex flex-col w-full justify-center item-center border-1 border-[#A1A1AA] rounded-[8px] p-[16px]"
    >
      <div className="flex flex-col w-full items-start h-full">
        <Link href={`/review/${review.review_id}`}>
          <div className="flex w-full flex-col h-full items-start">
            {review.image_urls && review.image_urls.length > 0 ? (
              <Image
                src={review.image_urls[0]}
                alt="reviewImage"
                height={400}
                width={400}
                className="w-[324px] h-[204px] object-cover rounded-[10px]"
              />
            ) : (
              <Image
                src={defaultImg}
                alt="reviewImage"
                height={400}
                width={400}
                className="w-[324px] h-[204px] object-cover rounded-[10px]"
              />
            )}
            <p className="text-[20px] pt-[16px] pb-[16px]">{review.review_title}</p>
            <p className="pb-[24px] text-ellipsis overflow-hidden">{ellipsisText(review.review_contents)}</p>
          </div>
        </Link>
      </div>
      <div className="flex max-w-[324px] w-full justify-between items-end">
        <p className="pb-1">{review.show_nickname ? authorNickname || '익명유저' : '익명유저'}</p>
        <div className="flex gap-x-3">
          <ReviewLike review_id={review.review_id} />
          <ReviewComment review_id={review.review_id} />
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
