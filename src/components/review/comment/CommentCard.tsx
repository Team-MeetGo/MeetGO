import Image from 'next/image';
import AvatarDefault from '(@/utils/icons/AvatarDefault)';
import { CommentListType } from './CommentList';
import { useQuery } from '@tanstack/react-query';
import { COMMENT_AUTHOR_QUERY_KEY } from '(@/query/review/commentQueryKeys)';
import { fetchCommentAuthor } from '(@/query/review/commentQueryFns)';

type Props = {
  comment: CommentListType;
};

const CommentCard = ({ comment }: Props) => {
  const commentAuthorId = comment.user_id;

  const useCommentAuthorDataQuery = (commentAuthorId: string) => {
    const { data: commentAuthorData } = useQuery({
      queryKey: [COMMENT_AUTHOR_QUERY_KEY, commentAuthorId],
      queryFn: async () => await fetchCommentAuthor(commentAuthorId)
    });
    return commentAuthorData;
  };

  const commentAuthorData = useCommentAuthorDataQuery(commentAuthorId as string);

  const userAvatar = commentAuthorData?.avatar || null;
  const userNickname = commentAuthorData?.nickname || null;

  return (
    <div className="flex">
      <div>
        {userAvatar ? (
          <Image className="mr-[15px] rounded-full" src={userAvatar} alt="유저 아바타" height={50} width={50} />
        ) : (
          <AvatarDefault />
        )}
      </div>
      <div>
        <div className="flex">
          <div>{userNickname ? userNickname : '익명유저'}</div>
          <div className="text-[#A1A1AA]">
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
        <div>
          <p>{comment.comment_content}</p>
          <p>{comment.comment_id}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
