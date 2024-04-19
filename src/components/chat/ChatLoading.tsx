import { Spinner } from '@nextui-org/react';

const ChatLoading = () => {
  return (
    <div className="absolute top-1/2 left-1/2">
      <Spinner color="secondary" size="lg" />
    </div>
  );
};

export default ChatLoading;
