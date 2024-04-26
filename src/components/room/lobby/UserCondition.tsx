'use client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import React from 'react';
import MeetingRoomList from './MeetingRoomList';

function UserCondition() {
  const { data: user } = useGetUserDataQuery();

  if (!user) return;

  return <MeetingRoomList />;
}

export default UserCondition;
