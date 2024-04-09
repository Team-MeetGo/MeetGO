'use client';

import { useChatDataQuery, useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { clientSupabase } from '(@/utils/supabase/client)';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody } from '@nextui-org/react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapProps {
  userId: string | null | undefined;
  chatRoomId: string;
}

const Map: React.FC<MapProps> = ({ userId, chatRoomId }) => {
  const mapRef = useRef<string>();
  const [map, setMap] = useState<any>();
  const [markers, setMarkers] = useState<any>();
  const [bars, setBars] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPos, setCurrentPos] = useState<string>();
  const [searchText, setSearchText] = useState<string>('');
  const [isLocationSelected, setisLocationSelected] = useState<boolean>(false);
  const [selectedMeetingLocation, setSelectedMeetingLocation] = useState<string>();

  // useRoomDataQuery로 리더 아이디 가져오기
  const room = useRoomDataQuery(chatRoomId);
  const leaderId = room?.roomData.leader_id;

  // 채팅방 정보 가져오기
  const chat = useChatDataQuery(chatRoomId);
  const meetingLocation = chat?.[0]?.meeting_location;

  useEffect(() => {
    setSelectedMeetingLocation(meetingLocation || '');
    setisLocationSelected(!!meetingLocation);
  }, [meetingLocation]);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services,clusterer,drawing`;
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
        mapRef.current = currentPos;
        const mapContainer = document.getElementById('map');
        const kakaoMap = new window.kakao.maps.Map(mapContainer, {
          center: currentPos,
          level: 3
        });
        setCurrentPos(currentPos);
        setMap(kakaoMap);
      },
      () => alert('위치 정보를 가져오는데 실패했습니다.'),
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      }
    );
  };

  // 맵 나타난 후 searchBarsNearby로 마커 표시
  useEffect(() => {
    if (!currentPos) {
      return;
    } else {
      searchBarsNearby(currentPos);
    }
  }, [map]);

  const searchBarsNearby = (currentPosition: any, page?: number) => {
    const places = new window.kakao.maps.services.Places();

    places.keywordSearch(
      '술집',
      (data: any, status: any, pagination: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // 마커 초기화
          if (markers && markers.length > 0) {
            markers.forEach((marker: any) => {
              marker.setMap(null);
            });
          }

          const bounds = new window.kakao.maps.LatLngBounds();
          let newMarkers = [];
          // 검색된 장소 정보를 바탕으로 마커 생성
          for (var i = 0; i < data.length; i++) {
            const markerPosition = new window.kakao.maps.LatLng(data[i].y, data[i].x);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
              map: map
            });
            bounds.extend(markerPosition); // 지도 영역 설정을 위해 bounds에 포함
            newMarkers.push(marker); // 생성된 마커를 markers 배열에 추가
          }
          setMarkers(newMarkers); // 새로운 마커 배열을 상태에 설정
          setBars(data); // 검색된 장소 정보를 상태에 설정
          setTotalPages((prevTotalPages) => Math.max(prevTotalPages, pagination.last));
          setCurrentPage(page || currentPage);
        } else {
          console.error('실패', status);
        }
      },
      {
        location: currentPosition,
        radius: 1000,
        page: page || currentPage
      }
    );
  };

  // 지도 검색 함수
  const searchNewPlaces = (page?: number) => {
    const places = new window.kakao.maps.services.Places();
    if (searchText === '') {
      alert('검색어를 입력해 주세요.');
    }
    places.keywordSearch(searchText, (data: any, status: any, pagination: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 마커 초기화
        if (markers && markers.length > 0) {
          markers.forEach((marker: any) => {
            marker.setMap(null);
          });
        }

        const bounds = new window.kakao.maps.LatLngBounds();
        let newMarkers = [];
        // 검색된 장소 정보를 바탕으로 마커 생성
        for (var i = 0; i < data.length; i++) {
          const markerPosition = new window.kakao.maps.LatLng(data[i].y, data[i].x);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            map: map
          });
          bounds.extend(markerPosition); // 지도 영역 설정을 위해 bounds에 포함
          newMarkers.push(marker); // 생성된 마커를 markers 배열에 추가
        }
        map.setBounds(bounds);
        setMarkers(newMarkers); // 새로운 마커 배열을 상태에 설정
        setBars(data); // 검색된 장소 정보를 상태에 설정
        setTotalPages((prevTotalPages) => Math.max(prevTotalPages, pagination.last));
        setCurrentPage(page || currentPage);
        setSearchText('');
      } else {
        alert('검색 결과가 없습니다.');
        console.error('실패', status);
      }
    });
  };

  // 페이지네이션 함수
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    searchBarsNearby(mapRef.current, pageNumber);
  };

  // 장소 선택 함수
  const handleSelectLocation = async (barName: string) => {
    setSelectedMeetingLocation(barName);
    setisLocationSelected(!isLocationSelected);
    if (!chatRoomId) {
      return;
    }

    if (!isLocationSelected) {
      // 장소 선택 안되었을 때
      const { error } = await clientSupabase
        .from('chatting_room')
        .update({ meeting_location: barName })
        .eq('chatting_room_id', chatRoomId);
      if (error) {
        console.log('서버에 미팅 장소 추가 에러', error);
      }
    } else {
      const { error } = await clientSupabase
        .from('chatting_room')
        .update({ meeting_location: null })
        .eq('chatting_room_id', chatRoomId);
      if (error) {
        console.log('서버에 미팅 장소 제거 에러', error);
      }
    }
  };

  return (
    <div>
      <h1 className="font-semibold text-2xl mb-2.5">미팅 장소</h1>
      <Card className="border border-mainColor shadow-none mb-6">
        <CardBody className=" h-[60px]">
          <p className="text-lg">{selectedMeetingLocation}</p>
        </CardBody>
      </Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchNewPlaces();
        }}
      >
        장소 검색:
        <input type="text" className="border" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        <button type="submit">검색</button>
      </form>
      <div id="map" className="w-70 h-80"></div>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {bars.map((bar, index) => (
          <div key={index} className="border">
            <div className="flex flex-row justify-between">
              <h1>{bar.place_name}</h1>
              {/* {userId === leaderId &&
                (selectedMeetingLocation === '' ? (
                  <button
                    onClick={() => {
                      handleSelectLocation(bar.place_name);
                    }}
                  >
                    {isLocationSelected ? '취소' : '선택'}
                  </button>
                ) : selectedMeetingLocation === bar.place_name ? (
                  <button
                    onClick={() => {
                      handleSelectLocation('');
                    }}
                  >
                    {isLocationSelected ? '취소' : '선택'}
                  </button>
                ) : (
                  <div></div>
                ))} */}
              {selectedMeetingLocation === '' ? (
                <button
                  onClick={() => {
                    handleSelectLocation(bar.place_name);
                  }}
                >
                  {isLocationSelected ? '취소' : '선택'}
                </button>
              ) : selectedMeetingLocation === bar.place_name ? (
                <button
                  onClick={() => {
                    handleSelectLocation('');
                  }}
                >
                  {isLocationSelected ? '취소' : '선택'}
                </button>
              ) : (
                <div></div>
              )}
            </div>
            <p>{bar.address_name}</p>
            <p>{bar.place_url}</p>
            <p>{bar.phone}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button className=" px-3" key={index} onClick={() => handlePageClick(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Map;
