'use client';

import { useRecruitingMyroomQuery } from '(@/hooks/useQueries/useMeetingQuery)';
import { userStore } from '(@/store/userStore)';

const Test = () => {
  const user = userStore((state) => state.user);

  const result = useRecruitingMyroomQuery(user ? user[0].user_id : '');
  console.log(result);
  return <div>Test</div>;
};

export default Test;
