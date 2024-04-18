import GetMostLikedReivew from '@/components/mainpage/GetMostLikedReview';
import MainBanner from '@/components/mainpage/MainBanner';
import MainBottomBanner from '@/components/mainpage/MainBottomBanner';

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center justify-content">
      <MainBanner />
      <div className="my-12">
        <GetMostLikedReivew />
      </div>
      <MainBottomBanner />
    </main>
  );
}
