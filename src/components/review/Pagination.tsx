// pagination.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Props {
  totalItems: number;
  itemCountPerPage: number;
  pageCount: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

export default function Pagination({ totalItems, itemCountPerPage, pageCount, currentPage, onPageChange }: Props) {
  const totalPages = Math.ceil(totalItems / itemCountPerPage);
  const [start, setStart] = useState(1);
  const noPrev = start === 1;
  const noNext = start + pageCount - 1 >= totalPages;

  useEffect(() => {
    if (currentPage === start + pageCount) setStart((prev) => prev + pageCount);
    if (currentPage < start) setStart((prev) => prev - pageCount);
  }, [currentPage, pageCount, start]);

  return (
    <div>
      <ul>
        <li>
          <Link href={`/review/pageNumber/${start - 1}`}>이전</Link>
        </li>
        {[...Array(pageCount)].map((a, i) => (
          <>
            {start + i <= totalPages && (
              <li key={i}>
                <Link className={`${currentPage === start + i}`} href={`/review/pageNumber/${start + i}`}>
                  {start + i}
                </Link>
              </li>
            )}
          </>
        ))}
        <li>
          <Link href={`/review/pageNumber/${start + pageCount}`}>다음</Link>
        </li>
      </ul>
    </div>
  );
}
