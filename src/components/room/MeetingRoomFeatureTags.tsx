'use client';

import { useTagStore } from '(@/store/roomStore)';
import { favoriteOptions } from '(@/utils/FavoriteData)';
import { Chip, Select, SelectItem } from '@nextui-org/react';
import { useState } from 'react';

const TagList = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set([]));
  const { setTags, tags } = useTagStore();

  const handleSelect = (value: string[]) => {
    if (selected.size > 5) {
      alert('최대 5개까지 선택 가능합니다.');
      return;
    }
    setSelected(new Set(value));
  };

  const handleDelete = (value: string) => {
    const newSelected = new Set(selected);
    newSelected.delete(value);
    setSelected(newSelected);
  };

  const addFavorite = async () => {
    const favoriteArray = Array.from(selected);
    return setTags(favoriteArray);
  };

  return (
    <>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <label>방의 컨셉을 골라주세요!</label>
        <div className="flex whitespace-nowrap">
          <Select
            label="방의 특성(최대 5개)"
            selectionMode="multiple"
            variant="bordered"
            selectedKeys={selected}
            className="max-w-xs"
            aria-label="방의 특성"
            onSelectionChange={(value) => handleSelect(value as string[])}
          >
            {favoriteOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.value}
              </SelectItem>
            ))}
          </Select>
          <button
            type="button"
            className="p-4 border"
            onClick={() => {
              addFavorite();
            }}
          >
            저장
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from(selected).map((value) => (
            <Chip
              key={value}
              color="default"
              style={{ backgroundColor: favoriteOptions.find((option) => option.value === value)?.color }}
              onClose={() => handleDelete(value)}
            >
              {value}
            </Chip>
          ))}
        </div>
      </div>
    </>
  );
};

export default TagList;
