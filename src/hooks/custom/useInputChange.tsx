import { useState } from 'react';

const useInputChange = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  return { value, setValue, onChange };
};

export default useInputChange;
