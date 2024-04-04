import { userStore } from '(@/store/userStore)';
import { getUserId } from '(@/utils/api/authAPI)';
import { clientSupabase } from '(@/utils/supabase/client)';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const MyPost = () => {
  const [myPost, setMyPost] = useState([] as any);
  const [likePost, setLikePost] = useState([] as any);

  const getMyPost = async () => {
    const { result: userId } = await getUserId();
    const { data } = await clientSupabase.from('review').select('*').eq('user_id', userId);
    if (data) {
      setMyPost(data);
    }
  };

  const getLikePost = async () => {
    const { result: userId } = await getUserId();
    const userIdArray = [userId];
    const { data } = await clientSupabase.from('review').select('*').contains('like_user', userIdArray);
    if (data) {
      setLikePost(data);
    }
  };

  useEffect(() => {
    getMyPost();
    getLikePost();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">내가 쓴 글</h2>
        {myPost.map((post: any) => (
          <div key={post.id} className="mb-4">
            {post.image_Url ? (
              <Image src={post.image_Url} alt="Post Image" width={320} height={180} className="mb-2" />
            ) : (
              <div className="w-full h-80 bg-white mb-2" />
            )}
            <p>{post.review_title}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">좋아요한 글</h2>
        {likePost.map((post: any) => (
          <div key={post.id} className="mb-4">
            {post.imageUrl ? (
              <Image src={post.image_Url} alt="Like Post Image" width={320} height={180} className="mb-2" />
            ) : (
              <div className="w-full h-80 bg-gray-300 mb-2" />
            )}
            <p>{post.review_title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPost;
