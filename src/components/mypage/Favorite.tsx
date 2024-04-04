import { Chip, Select, SelectItem } from '@nextui-org/react';
import { useState } from 'react';

const Favorite = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  return (
    <div className="mb-6">
      <label>이상형</label>
      {/* <Select selectedKeys={selected}>
        <SelectItem key="180cm" value="1">
          180cm
        </SelectItem>
        <SelectItem key="비흡연자" value="2">
          비흡연자
        </SelectItem>
        <SelectItem key="다정함" value="3">
          다정함
        </SelectItem>
      </Select>
      <Chip className="bg-[#8F5DF4]">{selected}</Chip> */}
    </div>
  );
};

export default Favorite;
