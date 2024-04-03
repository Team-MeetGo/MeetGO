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
    // DOM을 이용하여 script 태그를 만들어주기
    const mapScript = document.createElement('script');
    // script.async = true 라면,
    // 해당 스크립트가 다른 페이지와는 비동기적으로 동작함
    mapScript.async = true;
    // script.src에 map을 불러오는 api를 넣어주기
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;

    //script를 document에 붙여주기
    document.head.appendChild(mapScript);

    // script가 완전히 load 된 이후, 실행될 함수
    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const kakaoMap = new window.kakao.maps.Map(mapContainer, {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3
        });
        setMap(kakaoMap);

        getCurrentPosition(kakaoMap);
      });
    };

    mapScript.addEventListener('load', onLoadKakaoMap);
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
      },
      () => alert('위치 정보를 가져오는데 실패했습니다.'),
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      }
    );
  };

  return (
    <div>
      {/* 지도 출력 영역 설정 */}
      <div id="map" className="w-96 h-96"></div>
    </div>
  );
};

export default Map;
