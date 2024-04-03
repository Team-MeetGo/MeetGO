'use client';

import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const Map = () => {
  const [map, setMap] = useState<any>();
  const [marker, setMarker] = useState<any>();

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.addEventListener('load', () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const kakaoMap = new window.kakao.maps.Map(mapContainer, {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3
        });
        setMap(kakaoMap);

        getCurrentPosition(kakaoMap);
      });
    });

    return () => {
      script.removeEventListener('load', () => {});
      document.head.removeChild(script);
    };
  }, []);

  // 현재 위치 받아오는 함수
  const getCurrentPosition = (map: any) => {
    navigator.geolocation.getCurrentPosition(
      (pos: GeolocationPosition) => {
        const currentPos = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        map.panTo(currentPos);

        const marker = new window.kakao.maps.Marker({
          position: currentPos,
          map: map
        });
        setMarker(marker);

        // Call function to search for bars near the current location
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
          console.log('Bars nearby:', data);
        } else {
          console.error('Failed to retrieve bars nearby:', status);
        }
      },
      {
        location: currentPosition,
        radius: 1000
      }
    );
  };

  return (
    <div>
      <div id="map" className="w-96 h-96"></div>
    </div>
  );
};

export default Map;
