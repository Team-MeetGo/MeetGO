import ReviewList from '@/components/review/ReviewList';
import ThinBanner from '@/utils/banner/ThinBanner';

const ReviewsPage = () => {
  return (
    <>
      <main className="w-full max-w-[1080px] mx-auto px-[24px] flex flex-col gap-12">
        <header className="h-40 flex flex-col justify-center items-center gap-4 py-auto">
          <h1 className="text-4xl font-extrabold mr-auto">실시간 후기</h1>
          <p className="text-[#6F7785] mr-auto">자유게시판 이라고 생각해도 좋아요.</p>
        </header>
        <ReviewList />
      </main>
      <ThinBanner />
    </>
  );
};

export default ReviewsPage;
