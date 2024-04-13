'use client';

import { useChatDataQuery, useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody, Pagination } from '@nextui-org/react';
import { IoMdSearch } from 'react-icons/io';
import DateTimePicker from './DateTimePicker';
import { userStore } from '(@/store/userStore)';
import {
  useClearMeetingLocationMutation,
  useUpdateMeetingLocationMutation
} from '(@/hooks/useMutation/useMeetingLocationMutation)';

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapProps {
  chatRoomId: string;
}

const Map: React.FC<MapProps> = ({ chatRoomId }) => {
  const mapRef = useRef<string>();
  const [map, setMap] = useState<any>();
  const [markers, setMarkers] = useState<any>();
  const [bars, setBars] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPos, setCurrentPos] = useState<string>();
  const [searchText, setSearchText] = useState<string>('');
  const [isLocationSelected, setIsLocationSelected] = useState<boolean>(false);
  const [selectedMeetingLocation, setSelectedMeetingLocation] = useState<string>();

  // userStore에서 userId 받아오기
  const { user } = userStore((state) => state);
  const userId = user?.user_id;

  // useRoomDataQuery로 리더 아이디 가져오기
  const room = useRoomDataQuery(chatRoomId);
  const leaderId = room?.roomData.leader_id;

  // 채팅방 정보 가져오기
  const chat = useChatDataQuery(chatRoomId);
  const meetingLocation = chat?.[0]?.meeting_location;

  useEffect(() => {
    setSelectedMeetingLocation(meetingLocation || '');
    setIsLocationSelected(!!meetingLocation);
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
      return;
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
        setSearchText('');
      }
    });
  };

  // 페이지네이션 함수
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    searchBarsNearby(mapRef.current, pageNumber);
  };
  // useMutation 호출
  const updateMeetingLocationMutation = useUpdateMeetingLocationMutation();

  // 장소 선택 함수
  const handleSelectLocation = async (barName: string) => {
    setSelectedMeetingLocation(barName);
    setIsLocationSelected(!isLocationSelected);
    if (!chatRoomId) {
      return;
    }

    if (barName === selectedMeetingLocation) {
      const clearMutation = useClearMeetingLocationMutation({ chatRoomId });
      try {
        await clearMutation.mutateAsync();
      } catch (error) {
        console.error('미팅장소 삭제 오류:', error);
      }
    } else {
      try {
        await updateMeetingLocationMutation.mutateAsync({ chatRoomId, barName });
      } catch (error) {
        console.error('미팅장소 업데이트 오류:', error);
      }
    }
  };

  return (
    <div className="z-10">
      <div className="py-6">
        <h1 className="font-semibold text-2xl mb-2">미팅 장소</h1>
        <Card className="border border-mainColor shadow-none ">
          <CardBody className=" h-[60px]">
            <p className="text-lg">{selectedMeetingLocation}</p>
          </CardBody>
        </Card>
      </div>

      <div className="border-t border-gray2 "></div>

      <DateTimePicker chatRoomId={chatRoomId} />

      <h1 className="font-semibold text-2xl mb-2">장소 검색</h1>
      <Card className="border border-gray2 shadow-none mb-4">
        <CardBody className=" h-[60px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchNewPlaces();
            }}
            className="flex flex-row justify-between"
          >
            <input
              type="text"
              className="outline-none"
              value={searchText}
              placeholder="장소 검색하기"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button type="submit" className="bg-transparent border-none p-0">
              <IoMdSearch size={25} color="#A1A1AA" />
            </button>
          </form>
        </CardBody>
      </Card>

      <div id="map" className="w-70 h-80"></div>
      <div className="flex flex-col justify-center place-item-center">
        {bars.map((bar, index) => (
          <div
            key={index}
            className={`flex flex-col justify-center border-b-1 border-gray2 py-4 ${
              selectedMeetingLocation === bar.place_name ? 'bg-purpleSecondary' : ''
            }`}
            // onClick={() => {
            //   if (userId === leaderId) {
            //     handleSelectLocation(selectedMeetingLocation === bar.place_name ? '' : bar.place_name);
            //   }
            // }}
            onClick={() => {
              handleSelectLocation(selectedMeetingLocation === bar.place_name ? '' : bar.place_name);
            }}
            style={{ cursor: 'pointer', alignItems: 'center' }}
          >
            <div className="flex flex-col text-left">
              <h1 className="text-base mb-2.5">{bar.place_name}</h1>
              <div className="text-sm">
                <p>{bar.address_name}</p>
                <p>{bar.place_url}</p>
                <p>{bar.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-5">
        <Pagination
          showControls
          total={totalPages}
          initialPage={currentPage}
          variant="bordered"
          color="secondary"
          onChange={(pageNumber: number) => handlePageClick(pageNumber)}
        />
      </div>
    </div>
  );
};

export default Map;
