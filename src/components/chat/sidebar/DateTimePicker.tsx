'use client';
import React, { forwardRef, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DateCustomeInput from './DateCustomeInput';
import { ko } from 'date-fns/locale';
import { getMonth, getYear } from 'date-fns';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { useRoomDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { useUpdateMeetingTimeMutation } from '@/hooks/useMutation/useMeetingTimeMutation';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';

const DateTimePicker = forwardRef(({ chatRoomId }: { chatRoomId: string }) => {
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
    setIsCalendarOpen((prev) => !prev);
  };

  const { mutate: updateMeetingTime } = useUpdateMeetingTimeMutation();

  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  return (
    <div className="relative z-50 w-full py-6">
      <DatePicker
        locale={ko} // 한국어
        showPopperArrow={false} // 위에 삼각형 제거
        wrapperClassName="w-full z-100"
        selected={selectedMeetingTime ? selectedMeetingTime : new Date()}
        onChange={(date) => {
          if (leaderId == userId) {
            setSelectedMeetingTime(date as Date);
            const isoStringMeetingTime = date?.toISOString();
            updateMeetingTime({
              chatRoomId,
              isoStringMeetingTime: String(isoStringMeetingTime)
            });
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
    </div>
  );
});
DateTimePicker.displayName = 'DateTimePicker';
export default DateTimePicker;
