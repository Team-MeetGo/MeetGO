import GetMostLikedReivew from '@/components/mainpage/GetMostLikedReview';
import MainBanner from '@/components/mainpage/MainBanner';
import ProfileRouteModal from '@/components/mainpage/ProfileRouteModal';
import UseInformation from '@/components/mainpage/UseInformation';
import ThinBanner from '@/utils/banner/ThinBanner';
import ThickBanner from '@/utils/banner/ThickBanner';

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-12">
      <MainBanner />
      <GetMostLikedReivew />
      <ThinBanner />
      <UseInformation />
      <ProfileRouteModal />
      <ThickBanner />
    </main>
  );
}
