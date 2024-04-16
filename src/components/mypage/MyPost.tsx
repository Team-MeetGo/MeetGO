'use client';
import { useGetUserDataQuery, useGetUserLikePostQuery, useGetUserPostQuery } from '@/hooks/useQueries/useUserQuery';
import Image from 'next/image';
import Link from 'next/link';

const MyPost = () => {
  const { data: user } = useGetUserDataQuery();
  const userId = user?.user_id ?? '';

  const myPostData = useGetUserPostQuery(userId);
  const likePostData = useGetUserLikePostQuery(userId);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">내가 쓴 글</h2>
        {myPostData?.map((post: any) => (
          <Link
            href={`review/${post.review_id}`}
            key={post.review_id}
            className="border p-4 rounded-lg flex flex-col gap-4"
          >
            {post.image_urls ? (
              <div className="relative w-full h-[200px]">
                <Image
                  src={post.image_urls[0]}
                  alt="Post Image"
                  style={{ objectFit: 'cover' }}
                  fill={true}
                  sizes="500px"
                  priority={false}
                  className="rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full h-80 bg-white mb-2" />
            )}
            <div className="flex flex-col gap-2">
              <p className="text-[20px]">{post.review_title}</p>
              <p className="overflow-ellipsis overflow-hidden whitespace-nowrap">{post.review_contents}</p>
            </div>
          </Link>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">좋아요한 글</h2>
        <div className="flex flex-col gap-4">
          {likePostData?.map((post: any) => (
            <Link
              href={`review/${post.review_id}`}
              key={post.review_id}
              className="border p-4 rounded-lg flex flex-col gap-4"
            >
              {post.image_urls ? (
                <div className="relative w-full h-[200px]">
                  <Image
                    src={post.image_urls[0]}
                    alt="Like Post Image"
                    style={{ objectFit: 'cover' }}
                    fill={true}
                    sizes="500px"
                    priority={false}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-full h-80 bg-gray-300 mb-2" />
              )}
              <div className="flex flex-col gap-2">
                <p className="text-[20px]">{post.review_title}</p>
                <p className="overflow-ellipsis overflow-hidden whitespace-nowrap">{post.review_contents}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPost;
