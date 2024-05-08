'use client';

import { ITEM_INTERVAL } from '@/utils/constant';
import { clientSupabase } from '@/utils/supabase/client';
import { getFromTo } from '@/utils/utilFns';

const New = () => {
  const fetchMoreMsg = async ({ pageParam = 0 }) => {
    const { from, to } = getFromTo(pageParam, ITEM_INTERVAL);
    const { error: fetchMoreErr, data: newMsgs } = await clientSupabase
      .from('messages')
      .select('*')
      .range(from, to)
      .eq('chatting_room_id', String(chatRoomId))
      .order('created_at', { ascending: false });
    if (fetchMoreErr) {
      alert('이전 메세지를 불러오는 데에 오류가 발생했습니다.');
    } else {
      return newMsgs;
    }
  };

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [MSGS_QUERY_KEY, chatRoomId],
    queryFn: ({ pageParam }: { pageParam: number | undefined }) => fetchMoreMsg({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      // console.log('lastPage =>', lastPage);
      // if (lastPage) {
      //   if (lastPage?.length && lastPage?.length < ITEM_INTERVAL) return null;
      // return pages.length + 1;
      return null;
      // }
    },
    select: (data) => data.pages.flat()
  });

  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (!inView || !hasNextPage || isFetchingNextPage) return;
      fetchNextPage();
    }
  });

  console.log('data =>', data);
  return <div>New</div>;
};

export default New;
