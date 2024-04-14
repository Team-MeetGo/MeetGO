'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DateCustomeInput from './DateCustomeInput';
import { ko } from 'date-fns/locale';
import { getMonth, getYear } from 'date-fns';
import { IoChevronBackSharp } from 'react-icons/io5';
import { IoChevronForwardSharp } from 'react-icons/io5';
import { userStore } from '(@/store/userStore)';
import { useChatDataQuery, useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { useUpdateMeetingTimeMutation } from '(@/hooks/useMutation/useMeetingTimeMutation)';

interface DateTimePickerProps {
  chatRoomId: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = forwardRef(({ chatRoomId }, ref) => {
  const [selectedMeetingTime, setSelectedMeetingTime] = useState<Date | null>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const datePickerRef = useRef<DatePicker>(null);

  // userStore에서 userId 받아오기
  const { user } = userStore((state) => state);
  const userId = user?.user_id;

  // useRoomDataQuery로 리더 아이디 가져오기
  const room = useRoomDataQuery(chatRoomId);
  const leaderId = room?.roomData.leader_id;

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const chat = useChatDataQuery(chatRoomId);

  useEffect(() => {
    const meetingTime = new Date(String(chat?.[0]?.meeting_time));
    if (meetingTime instanceof Date && !isNaN(meetingTime.getTime())) {
      setSelectedMeetingTime(meetingTime);
    }
  }, [chatRoomId, chat]);

  const { mutate: updateMeetingTime } = useUpdateMeetingTimeMutation();

  // months 배열을 선언
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  return (
    <div className="relative z-50 w-full max-w-lg py-6">
      <DatePicker
        calendarStartDay={1} // 시작을 월요일로
        locale={ko} // 한국어
        showPopperArrow={false} // 위에 삼각형 제거
        wrapperClassName="w-full z-100"
        selected={selectedMeetingTime ? selectedMeetingTime : new Date()}
        onChange={(date) => {
          if (leaderId == userId) {
            setSelectedMeetingTime(date as Date);
            if (date) {
              // 선택된 미팅 시간이 있을 때에만 서버에 미팅 시간 업데이트
              const isoStringMeetingTime = date.toISOString();
              updateMeetingTime({
                chatRoomId,
                isoStringMeetingTime
              });
            }
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
              {prevMonthButtonDisabled ? (
                <IoChevronBackSharp className="text-white" />
              ) : (
                <IoChevronBackSharp className="text-gray-500" />
              )}
            </button>
            <div className="px-4 text-black text-base">
              {getYear(date)}년 {months[getMonth(date)]}
            </div>
            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              <IoChevronForwardSharp className="text-gray-500" />
            </button>
          </div>
        )}
      />
    </div>
  );
});

DateTimePicker.displayName = 'DateTimePicker';

export default DateTimePicker;
