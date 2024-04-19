'use client';
import { Spinner } from '@nextui-org/react';

export default function RoomLoading() {
  return (
    <div className="flex flex-col justify-center align-middle h-1/2">
      <Spinner label="Success" color="success" labelColor="success" />
    </div>
  );
}
