'use client';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DateCustomeInput from './DateCustomeInput';
import { ko } from 'date-fns/locale';
import { getMonth, getYear } from 'date-fns';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { useChatDataQuery, useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { useUpdateMeetingTimeMutation } from '@/hooks/useMutation/useMeetingTimeMutation';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { DateTimePickerProps } from '@/types/sideBarTypes';
import { clientSupabase } from '@/utils/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { CHATDATA_QUERY_KEY } from '@/query/chat/chatQueryKeys';

const DateTimePicker: React.FC<DateTimePickerProps> = forwardRef(({ chatRoomId }, ref) => {
  const [selectedMeetingTime, setSelectedMeetingTime] = useState<Date | null>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const datePickerRef = useRef<DatePicker>(null);
  // 유저 정보 가져오기
  const { data: userData } = useGetUserDataQuery();
  const userId = userData?.user_id;
  // useRoomDataQuery로 리더 아이디 가져오기
  const room = useRoomDataQuery(chatRoomId);
  const leaderId = room?.leader_id;
  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };
  // const chat = useChatDataQuery(chatRoomId);
  const queryClient = useQueryClient();

  // useEffect(() => {
  //   const meetingTime = new Date(String(chat?.meeting_time));
  //   if (meetingTime instanceof Date && !isNaN(meetingTime.getTime())) {
  //     setSelectedMeetingTime(meetingTime);
  //   }
  // }, [chatRoomId, chat]);

  const { mutate: updateMeetingTime } = useUpdateMeetingTimeMutation();

  useEffect(() => {
    if (leaderId !== userId) {
      const channel = clientSupabase
        .channel(chatRoomId)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'chatting_room', filter: `chatting_room_id=eq.${chatRoomId}` },
          (payload) => {
            console.log(payload.new);
            queryClient.invalidateQueries({
              queryKey: [CHATDATA_QUERY_KEY]
            });
          }
        )
        .subscribe();
      return () => {
        clientSupabase.removeChannel(channel);
      };
    }
  }, [chatRoomId, leaderId, queryClient, userId]);
  // months 배열을 선언
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  return (
    <div className="relative z-50 w-full max-w-lg py-6">
      <DatePicker
        locale={ko} // 한국어
        showPopperArrow={false} // 위에 삼각형 제거
        wrapperClassName="w-full z-100"
        selected={selectedMeetingTime ? selectedMeetingTime : new Date()}
        onChange={(date) => {
          if (leaderId == userId) {
            setSelectedMeetingTime(date as Date);
          }
        }}
        minDate={new Date()} // 오늘 이전의 날짜 선택 불가능
        showTimeSelect
        timeIntervals={30} //30분 간격
        timeCaption="시간"
        dateFormat="yyyy년 MM월 dd일 / aa h:mm"
        shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
        // 커스텀 인풋
        customInput={<DateCustomeInput onClick={toggleCalendar} />}
        ref={datePickerRef} // DatePicker에 ref를 추가
        // 커스텀 헤더
        renderCustomHeader={({
          date,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
          decreaseMonth,
          increaseMonth
        }) => (
          <div className="flex flex-row justify-center">
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              {prevMonthButtonDisabled ? <IoIosArrowBack className="text-white" /> : <IoIosArrowBack color="#A1A1AA" />}
            </button>
            <div className="px-4 text-black text-base">
              {getYear(date)}년 {months[getMonth(date)]}
            </div>
            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              <IoIosArrowForward color="#A1A1AA" />
            </button>
          </div>
        )}
      />
      <button
        onClick={() => {
          const isoStringMeetingTime = selectedMeetingTime?.toISOString();
          updateMeetingTime({
            chatRoomId,
            isoStringMeetingTime: String(isoStringMeetingTime)
          });
        }}
      >
        버튼
      </button>
    </div>
  );
});
DateTimePicker.displayName = 'DateTimePicker';
export default DateTimePicker;
