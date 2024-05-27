import { Skeleton } from '@nextui-org/skeleton';

const ChatLoadingSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col gap-8 px-16 justify-center">
      <Skeleton className="h-3 w-2/5 rounded-lg" />
      <Skeleton className="ml-auto h-3 w-2/5 rounded-lg" />
      <Skeleton className="h-3 w-3/5 rounded-lg" />
      <Skeleton className="ml-auto h-3 w-3/5 rounded-lg" />
      <Skeleton className="h-3 w-1/5 rounded-lg" />
      <Skeleton className="ml-auto h-3 w-2/5 rounded-lg" />
    </div>
  );
};

export default ChatLoadingSkeleton;
