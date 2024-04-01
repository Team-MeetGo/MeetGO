'use client';

import { useEffect, useState } from 'react';
import ModalPotal from './ModalPortal';
import ReviewCard from './ReviewCard';
import ReviewModal from './ReviewModal';
import NewReview from './NewReview';
import { Button } from '@nextui-org/react';
import { useDisclosure } from '@nextui-org/react';
import { clientSupabase } from '(@/utils/supabase/client)';
import Link from 'next/link';

export type reviewData = {
  user_id: string | null;
  review_id: string | null;
  review_title: string | null;
  review_contents: string | null;
  created_at: string | null;
  image_url: string | null;
};

const ReviewList = () => {
  const [reviewData, setReviewData] = useState<reviewData[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getRecentReview();
  }, []);

  async function getRecentReview() {
    let { data } = await clientSupabase.from('review').select('*');
    if (data) {
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setReviewData(data);
    }
  }
  const openNewReviewModal = async () => {
    onOpen();
  };
  return (
    <div>
      <div className="flex justify-between gap-8">
        <div>dropdown</div>
        <div>
          <Button onClick={openNewReviewModal} color="primary">
            새 리뷰 등록
          </Button>
        </div>
        <div>
          {isOpen && (
            <ModalPotal>
              <div>
                <ReviewModal onClose={onClose} isOpen={isOpen}>
                  <NewReview />
                </ReviewModal>
              </div>
            </ModalPotal>
          )}
        </div>
      </div>
      <div>
        {reviewData.map((item, index) => (
          <div key={item.review_id}>
            <Link href={`/review/${item.review_id}`}>
              <ReviewCard key={index} review={item} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
