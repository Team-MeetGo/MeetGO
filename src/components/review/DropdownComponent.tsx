'use client';

import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { clientSupabase } from '(@/utils/supabase/client)';
import { reviewData } from './ReviewList';
import { Selection } from '@react-types/shared';

export default function DropdownComponent() {
  const [reviewData, setReviewData] = useState<reviewData[]>([]);
  const [selected, setSelected] = React.useState<Selection>(new Set(['최신 순']));

  const selectedValue = React.useMemo(() => Array.from(selected).join(', ').replaceAll('_', ' '), [selected]);

  async function getMostLikedReview() {
    let { data } = await clientSupabase.from('review').select('*');
    if (data) {
      data.sort((a, b) => (b.like_user?.length || 0) - (a.like_user?.length || 0));
      setReviewData([...data]);
      console.log(data);
    }
  }

  async function getRecentReview() {
    let { data } = await clientSupabase.from('review').select('*');
    if (data) {
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setReviewData(data);
    }
  }

  const handleSelectionChange = (keys: Selection) => {
    setSelected(keys);

    if (keys instanceof Set && keys.has('최신 순')) {
      getRecentReview();
    } else if (keys instanceof Set && keys.has('좋아요 순')) {
      getMostLikedReview();
    }
  };

  useEffect(() => {
    if (selected instanceof Set && selected.has('최신 순')) {
      getRecentReview();
    } else if (selected instanceof Set && selected.has('좋아요 순')) {
      getMostLikedReview();
    }
  }, [selected]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={handleSelectionChange}
      >
        <DropdownItem key="최신 순" onClick={getRecentReview}>
          최신 순
        </DropdownItem>
        <DropdownItem key="좋아요 순" onClick={getMostLikedReview}>
          좋아요 순
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

// import React from 'react';
// import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
// import { Selection } from '@react-types/shared';

// export default function App() {
//   const [selected, setSelected] = React.useState<Selection>(new Set(['text']));

//   const selectedValue = React.useMemo(() => Array.from(selected).join(', ').replaceAll('_', ' '), [selected]);

//   return (
//     <Dropdown>
//       <DropdownTrigger>
//         <Button variant="bordered" className="capitalize">
//           {selectedValue}
//         </Button>
//       </DropdownTrigger>
//       <DropdownMenu
//         aria-label="Single selection example"
//         variant="flat"
//         disallowEmptySelection
//         selectionMode="single"
//         selectedKeys={selected}
//         onSelectionChange={setSelected}
//       >
//         <DropdownItem key="text">Text</DropdownItem>
//         <DropdownItem key="number">Number</DropdownItem>
//         <DropdownItem key="date">Date</DropdownItem>
//         <DropdownItem key="single_date">Single Date</DropdownItem>
//         <DropdownItem key="iteration">Iteration</DropdownItem>
//       </DropdownMenu>
//     </Dropdown>
//   );
// }
