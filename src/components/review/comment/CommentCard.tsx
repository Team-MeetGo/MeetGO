import Image from 'next/image';
import AvatarDefault from '@/utils/icons/AvatarDefault';
import { CommentListType } from './CommentList';
import { useCommentAuthorDataQuery } from '@/hooks/useQueries/useCommentQuery';
import { Button } from '@nextui-org/react';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useDeleteCommentMutation } from '@/hooks/useMutation/useCommentMutations';
import { IoFemale, IoMale } from 'react-icons/io5';

type Props = {
  comment: CommentListType;
};

const CommentCard = ({ comment }: Props) => {
  const { data: user } = useGetUserDataQuery();
  const userId = user && user.user_id;

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      await deleteCommentMutation.mutate(commentId);
    }
  };

  const deleteCommentMutation = useDeleteCommentMutation(comment.review_id as string);

  const commentAuthorId = comment.user_id;

  const commentAuthorData = useCommentAuthorDataQuery(commentAuthorId as string);

  const userAvatar = commentAuthorData?.avatar || null;
  const userNickname = commentAuthorData?.nickname || null;
  const userGender = commentAuthorData?.gender || null;

  return (
    <div className="flex w-full max-w-[1000px] border-b-1 border-gray2">
      <div className="flex w-full max-w-[1000px] flex-col mb-[24px]">
        <div className="flex flex-col w-full max-w-[1000px] mt-[24px]">
          <div className="flex items-center">
            <div className="mr-[15px]">
              {userAvatar ? (
                <Image
                  className="rounded-full w-[52px] h-[52px]"
                  src={`${userAvatar}?${new Date().getTime()}`}
                  alt="유저 아바타"
                  height={50}
                  width={50}
                />
              ) : (
                <AvatarDefault />
              )}
            </div>
            <div className="flex items-center gap-1">
              <p className="text-xl">{userNickname ? userNickname : '익명유저'}</p>
              <p className="text-xl mr-[15px]">
                {userGender === 'female' ? (
                  <IoFemale className="fill-hotPink" />
                ) : userGender === 'male' ? (
                  <IoMale className="fill-blue" />
                ) : null}
              </p>
              <div className="text-[#A1A1AA] text-[16px]">
                {comment && comment.created_at
                  ? new Intl.DateTimeFormat('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    }).format(new Date(comment.created_at))
                  : null}
              </div>
            </div>
          </div>
          <div className="mt-[16px]">
            <p className="text-[16px] ml-[67px]">{comment.comment_content}</p>
          </div>
        </div>
        <div className="w-full flex justify-end items-end">
          {userId === comment.user_id && (
            <Button
              className="border-1 border-gray2 bg-white text-gray2"
              onClick={() => handleDeleteComment(comment.comment_id as string)}
            >
              삭제
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
