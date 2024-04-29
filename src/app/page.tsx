import GetMostLikedReivew from '@/components/mainpage/GetMostLikedReview';
import MainBanner from '@/components/mainpage/MainBanner';
import MainBottomBanner from '@/utils/banner/ThickBanner';
import ProfileRouteModal from '@/components/mainpage/ProfileRouteModal';
import UseInformation from '@/components/mainpage/UseInformation';
import ThinBanner from '@/utils/banner/ThinBanner';

export default function Home() {
  return (
    <main className="w-screen flex flex-col items-center gap-12">
      <MainBanner />
      <GetMostLikedReivew />
      <ThinBanner />
      <UseInformation />
      <ProfileRouteModal />
      <MainBottomBanner />
    </main>
  );
}
