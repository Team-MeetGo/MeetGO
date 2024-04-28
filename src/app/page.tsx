import GetMostLikedReivew from '@/components/mainpage/GetMostLikedReview';
import MainBanner from '@/components/mainpage/MainBanner';
import MainBottomBanner from '@/components/mainpage/MainBottomBanner';
import ProfileRouteModal from '@/components/mainpage/ProfileRouteModal';
import UseInformation from '@/components/mainpage/UseInformation';

export default function Home() {
  return (
    <main className="w-screen flex flex-col items-center gap-12">
      <MainBanner />
      <GetMostLikedReivew />
      <MainBottomBanner />
      <UseInformation />
      <ProfileRouteModal />
    </main>
  );
}
