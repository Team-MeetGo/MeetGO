'use client';
import { Chip, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { favoriteOptions } from '@/utils/data/FavoriteData';
import { clientSupabase } from '@/utils/supabase/client';
import type { IsEditingType } from '@/types/userTypes';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useFavoriteStore } from '@/store/userStore';
import { customErrToast } from '../common/customToast';

const Favorite: React.FC<IsEditingType> = ({ isEditing }) => {
  const { selected, setSelected } = useFavoriteStore();
  const { data: user } = useGetUserDataQuery();

  const handleSelectionChange = (e: any) => {
    const selectedArray = e.target.value.split(',');
    if (selectedArray.length > 5) {
      customErrToast('최대 5개까지 선택 가능합니다.');
      return;
    }
    setSelected(new Set(selectedArray));
  };

  useEffect(() => {
    const initialFavorites = new Set(user?.favorite || []);
    setSelected(initialFavorites);
    if (!isEditing) {
      setSelected(new Set(user!.favorite || []));
    }
  }, [isEditing]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {isEditing ? (
        <div className="flex whitespace-nowrap">
          <Select
            label="이상형 선택(최대 5개)"
            selectionMode="multiple"
            variant="bordered"
            selectedKeys={selected}
            className="min-w-44 max-w-[342px] w-full"
            classNames={{
              trigger:
                'border-1 px-[12px] py-[8px] max-h-[38px] data-[focus=true]:border-mainColor data-[hover=true]:border-mainColor rounded-xl',
              innerWrapper: 'p-0',
              listboxWrapper: 'max-h-[400px]'
            }}
            onChange={handleSelectionChange}
          >
            {favoriteOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.value}
              </SelectItem>
            ))}
          </Select>
        </div>
      ) : (
        <div className="flex gap-2 max-w-[342px] w-full border rounded-lg py-2 px-3 mt-2 bg-[#FAFAFA]">
          {selected.size === 0 && <div className="text-sm text-[#9CA3AF]">이상형을 선택해주세요.</div>}
          {Array.from(selected).map((value) => (
            <div className="text-sm text-[#9CA3AF]" key={value}>
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;
