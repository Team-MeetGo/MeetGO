'use client';

import React, { useState } from 'react';
import Map from '(@/components/chat/sidebar/Map)';
import DatePicker from './DatePicker';

const SideBar = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  return (
    <div>
      <DatePicker />
      <div>미팅 장소 : {selectedLocation}</div>
      <Map setSelectedLocation={setSelectedLocation} />
    </div>
  );
};

export default SideBar;
