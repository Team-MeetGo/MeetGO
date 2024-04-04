'use client';

import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const Map = () => {
  const [map, setMap] = useState<any>();
  const [markers, setMarkers] = useState<any>();
  const [bars, setBars] = useState<any[]>([]);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.addEventListener('load', () => {
      window.kakao.maps.load(() => {
        getCurrentPosition();
      });
    });

    return () => {
      script.removeEventListener('load', () => {});
      document.head.removeChild(script);
    };
  }, []);

  // 현재 위치 받아오는 함수
  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (pos: GeolocationPosition) => {
        const currentPos = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        const mapContainer = document.getElementById('map');
        const kakaoMap = new window.kakao.maps.Map(mapContainer, {
          center: currentPos,
          level: 3
        });
        setMap(kakaoMap);
        searchBarsNearby(currentPos);
      },
      () => alert('위치 정보를 가져오는데 실패했습니다.'),
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      }
    );
  };

  // 주변 술집 데이터 가져오기
  const searchBarsNearby = (currentPosition: any) => {
    const places = new window.kakao.maps.services.Places();

    places.keywordSearch(
      '술집',
      (data: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          console.log('주변 술집:', data);
          setBars(data);
          displayBarsAsMarkers(data);
        } else {
          console.error('실패', status);
        }
      },
      {
        location: currentPosition,
        radius: 1000
      }
    );
  };

  // 술집 마커로 찍기
  const displayBarsAsMarkers = (bars: any[]) => {
    const newMarkers = bars.map((bar) => {
      const markerPosition = new window.kakao.maps.LatLng(bar.y, bar.x);
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: markerPosition,
        title: bar.place_name
      });
      console.log('map', map);
      return marker;
    });

    setMarkers(newMarkers);
  };

  return (
    <div>
      <div id="map" className="w-96 h-96"></div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {bars.map((bar, index) => (
          <div key={index} className="border">
            <h1>{bar.place_name}</h1>
            <p>{bar.address_name}</p>
            <p>{bar.place_url}</p>
            <p>{bar.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Map;
