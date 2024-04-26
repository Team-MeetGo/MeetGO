'use client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { MY_PAST_NOW_ROOM, RECRUTING_ROOMDATA, ROOMLIST } from '@/query/meetingRoom/meetingQueryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { IoMdRefresh } from 'react-icons/io';

function RefreshButoon() {
  const queryClient = useQueryClient();
  const { data: user, isPending, isError, error } = useGetUserDataQuery();

  const onReload = async () => {
    await queryClient.invalidateQueries({
      queryKey: [ROOMLIST, user?.user_id],
      refetchType: 'all'
    });
    await queryClient.invalidateQueries({
      queryKey: [RECRUTING_ROOMDATA],
      refetchType: 'all'
    });
    await queryClient.invalidateQueries({
      queryKey: [MY_PAST_NOW_ROOM],
      refetchType: 'all'
    });
  };
  return (
    <div className="flex flex-col align-middle justify-center text-gray2">
      <button className="h-full" onClick={onReload}>
        <IoMdRefresh className="h-[24px] w-[24px] m-2" />
      </button>
      <p className="text-[14px] text-center">New</p>
    </div>
  );
}

export default RefreshButoon;
