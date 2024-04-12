import { useGetUserDataQuery, useGetUserLikePostQuery, useGetUserPostQuery } from '(@/hooks/useQueries/useUserQuery)';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

const MyPost = () => {
  const { data: user } = useGetUserDataQuery();
  const userId = user?.user_id ?? '';
  const { data: myPostData } = useGetUserPostQuery(userId);
  const { data: likePostData } = useGetUserLikePostQuery(userId);

  console.log('myPostData', myPostData);
  console.log('likePostData', likePostData);

  // useEffect(() => {
  //   if (userId) {
  //     myPostData?.sort((a: any, b: any) => {
  //       return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  //     });
  //     likePostData?.sort((a: any, b: any) => {
  //       return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  //     });
  //   }
  // }, [myPostData, likePostData]);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">내가 쓴 글</h2>
        {myPostData?.map((post: any) => (
          <Link href={`review/${post.review_id}`} key={post.review_id} className="mb-4">
            {post.image_urls ? (
              <div className="relative w-full h-[200px]">
                <Image
                  src={post.image_urls[0]}
                  alt="Post Image"
                  style={{ objectFit: 'cover' }}
                  fill={true}
                  sizes="500px"
                  priority={false}
                  className="mb-2"
                />
              </div>
            ) : (
              <div className="w-full h-80 bg-white mb-2" />
            )}
            <p>{post.review_title}</p>
          </Link>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">좋아요한 글</h2>
        {likePostData?.map((post: any) => (
          <Link href={`review/${post.review_id}`} key={post.review_id} className="mb-4">
            {post.image_urls ? (
              <div className="relative w-full h-[200px]">
                <Image
                  src={post.image_urls[0]}
                  alt="Like Post Image"
                  style={{ objectFit: 'cover' }}
                  fill={true}
                  sizes="500px"
                  priority={false}
                  className="mb-2"
                />
              </div>
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
