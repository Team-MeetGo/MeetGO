import { Chip, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { favoriteOptions } from '(@/utils/FavoriteData)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { userStore } from '(@/store/userStore)';

const Favorite = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set([]));
  const { user, setUser } = userStore((state) => state);

  const handleSelect = (value: string[]) => {
    if (selected.size >= 5) {
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

  /** 이상형 업데이트하는 로직 */
  const updateFavorite = async () => {
    const favoriteArray = Array.from(selected);
    const userId = user && user[0].user_id;
    if (!userId) return;
    const { error } = await clientSupabase.from('users').update({ favorite: favoriteArray }).eq('user_id', userId);
    if (error) {
      console.error('Error updating introduction:', error);
    } else {
      alert('이상형이 업데이트되었습니다.');
    }
  };

  useEffect(() => {
    // userStore에서 favorite 정보를 가져와서 selected 상태에 설정
    const initialFavorites = new Set((user && user[0].favorite) || []);
    setSelected(initialFavorites);
  }, [user]);

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <label>이상형</label>
      <div className="flex whitespace-nowrap">
        <Select
          label="이상형 선택(최대 5개)"
          selectionMode="multiple"
          variant="bordered"
          selectedKeys={selected}
          className="max-w-xs"
          aria-label="이상형 선택"
          onSelectionChange={(value) => handleSelect(value as string[])}
        >
          {favoriteOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.value}
            </SelectItem>
          ))}
        </Select>
        <button className="p-4 border" onClick={updateFavorite}>
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
  );
};

export default Favorite;
