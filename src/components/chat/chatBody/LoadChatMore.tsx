'use client';
import { useMsgsQuery } from '@/hooks/useQueries/useChattingQuery';
import { MSGS_QUERY_KEY } from '@/query/chat/chatQueryKeys';
import { chatStore } from '@/store/chatStore';
import { getFromTo } from '@/utils';
import { ITEM_INTERVAL } from '@/utils/constant';
import { clientSupabase } from '@/utils/supabase/client';
import { Button } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect } from 'react';

const LoadChatMore = ({
  chatRoomId,
  count,
  setCount
}: {
  chatRoomId: string;
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}) => {
  const { setHasMore } = chatStore((state) => state);
  const messages = useMsgsQuery(chatRoomId);
  const queryClient = useQueryClient();

  const fetchMoreMsg = async () => {
    const { from, to } = getFromTo(count, ITEM_INTERVAL);
    const { error, data: newMsgs } = await clientSupabase
      .from('messages')
      .select('*')
      .range(from, to)
      .eq('chatting_room_id', String(chatRoomId))
      .order('created_at', { ascending: false });
    if (error) {
      alert('이전 메세지를 불러오는 데에 오류가 발생했습니다.');
    } else {
      messages &&
        queryClient.setQueryData([MSGS_QUERY_KEY, chatRoomId], [...(newMsgs ? newMsgs.reverse() : []), ...messages]);
      if (newMsgs.length < ITEM_INTERVAL + 1) {
        setHasMore(false);
      } else if (!newMsgs.length) {
        alert('더 이상 불러올 메세지가 없습니다.');
      } else {
        setCount((prev) => prev + 1);
      }
    }
  };
  // 더보기 눌렀을 때 위치 다시 생각해봐야함
  // 삭제 후 더보기 누르면 제대로 안 불러와짐

  return (
    <div>
      <Button className="w-full bg-[#F2EAFA]" onClick={fetchMoreMsg}>
        더보기
      </Button>
    </div>
  );
};

export default LoadChatMore;
