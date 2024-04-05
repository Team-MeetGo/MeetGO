import { userStore } from '(@/store/userStore)';
import { clientSupabase } from '(@/utils/supabase/client)';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const MyPost = () => {
  const [myPost, setMyPost] = useState([] as any);
  const [likePost, setLikePost] = useState([] as any);
  const { user } = userStore((state) => state);

  const getMyPost = async () => {
    const userId = user && user[0].user_id;
    if (!userId) return;
    const { data } = await clientSupabase.from('review').select('*').eq('user_id', userId);
    if (data) {
      setMyPost(data);
    }
  };

  const getLikePost = async () => {
    const userId = user && user[0].user_id;
    if (!userId) return;
    const { data } = await clientSupabase.from('review_like').select('review_id').eq('user_id', userId);
    if (data) {
      const likePostId = data.map((like: any) => like.review_id);
      const { data: reviewData } = await clientSupabase.from('review').select('*').in('review_id', likePostId);
      setLikePost(reviewData);
    }
  };

  useEffect(() => {
    getMyPost();
    getLikePost();
  }, [user]);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">내가 쓴 글</h2>
        {myPost.map((post: any) => (
          <Link href={`review/${post.review_id}`} key={post.review_id} className="mb-4">
            {post.image_urls ? (
              <Image
                src={post.image_urls[0]}
                alt="Post Image"
                style={{
                  width: '100%',
                  height: 'auto'
                }}
                width={200}
                height={200}
                className="mb-2"
              />
            ) : (
              <div className="w-full h-80 bg-white mb-2" />
            )}
            <p>{post.review_title}</p>
          </Link>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">좋아요한 글</h2>
        {likePost.map((post: any) => (
          <Link href={`review/${post.review_id}`} key={post.review_id} className="mb-4">
            {post.image_urls ? (
              <Image
                src={post.image_urls[0]}
                alt="Like Post Image"
                style={{
                  width: '100%',
                  height: 'auto'
                }}
                width={200}
                height={200}
                className="mb-2"
              />
            ) : (
              <div className="w-full h-80 bg-gray-300 mb-2" />
            )}
            <p>{post.review_title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyPost;
