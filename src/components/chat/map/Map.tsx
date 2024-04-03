'use client';
import React, { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const Map = () => {
  useEffect(() => {
    // DOM을 이용하여 script 태그를 만들어주기
    const mapScript = document.createElement('script');
    // script.async = true 라면,
    // 해당 스크립트가 다른 페이지와는 비동기적으로 동작함
    mapScript.async = true;
    // script.src에 map을 불러오는 api를 넣어주기
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_MAP_API_KEY}&autoload=false`;

    //script를 document에 붙여주기
    document.head.appendChild(mapScript);

    // script가 완전히 load 된 이후, 실행될 함수
    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667)
        };
        new window.kakao.maps.Map(mapContainer, mapOption);
      });
    };

    // sciprt가 완전히 load 된 이후, 지도를 띄우는 코드를 실행시킨다.
    mapScript.addEventListener('load', onLoadKakaoMap);
  }, []);
  return (
    <div>
      {/* 지도 출력 영역 설정 */}
      <div id="map" className="w-96 h-96"></div>
    </div>
  );
};

export default Map;
