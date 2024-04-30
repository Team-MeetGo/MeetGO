import ProfileSettingLayout from './ProfileSettingLayout';
import { useEditingStore, useProfileOnchangeStore } from '@/store/userStore';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { favoriteOptions } from '@/utils/data/FavoriteData';
import { Select, SelectItem } from '@nextui-org/react';
import { customErrToast } from '../common/customToast';
import { useEffect } from 'react';

const UserFavorite = () => {
  const { data: user } = useGetUserDataQuery();
  const { favoriteInputValue, setFavoriteInputValue } = useProfileOnchangeStore();
  const { isEditing } = useEditingStore();

  const handleSelectionChange = (e: any) => {
    const selectedArray = e.target.value.split(',');
    if (selectedArray.length > 5) {
      customErrToast('최대 5개까지 선택 가능합니다.');
      return;
    }
    setFavoriteInputValue(new Set(selectedArray));
  };

  useEffect(() => {
    const initialFavorites = new Set(user?.favorite || []);
    setFavoriteInputValue(initialFavorites);
    if (!isEditing) {
      setFavoriteInputValue(new Set(user!.favorite || []));
    }
  }, [isEditing]);

  return (
    <>
      <ProfileSettingLayout
        info={{
          title: '이상형',
          required: '',
          children: (
            <div className="flex flex-col gap-4 w-full">
              {isEditing ? (
                <div className="flex whitespace-nowrap">
                  <Select
                    label="이상형 선택(최대 5개)"
                    selectionMode="multiple"
                    variant="bordered"
                    selectedKeys={favoriteInputValue}
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
                  {favoriteInputValue.size === 0 && (
                    <div className="text-sm text-[#9CA3AF]">이상형을 선택해주세요.</div>
                  )}
                  {Array.from(favoriteInputValue).map((value) => (
                    <div className="text-sm text-[#9CA3AF]" key={value}>
                      {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        }}
      />
    </>
  );
};

export default UserFavorite;
