'use client';

import { useTagStore } from '(@/store/zustand)';
import { useState } from 'react';

type TagsType = {
  state: () => string[];
};
const TagList = () => {
  const { addTags, deleteTags, tags } = useTagStore();
  // const [tags, setTags] = useState<string[]>([]);

  const tagList = [`잘생김 보장`, `키커요`, `매너 좋음`, `유머`, `옷 잘입음`];
  return (
    <>
      <div className="flex flex-row items-center justify-center gap-4">
        {tagList.map((key) => {
          const isActive = tags.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                isActive ? deleteTags(key) : addTags(key);
              }}
              className="btn text-black hover:border-violet-400 active:bg-violet-700"
            >
              {key}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default TagList;
