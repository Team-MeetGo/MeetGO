import React, { forwardRef, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DateCustomeInput from './DateCustomeInput';
import { ko } from 'date-fns/locale';
import { getMonth, getYear } from 'date-fns';
import { IoChevronBackSharp } from 'react-icons/io5';
import { IoChevronForwardSharp } from 'react-icons/io5';
import { clientSupabase } from '(@/utils/supabase/client)';

interface DateTimePickerProps {
  chatRoomId: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = forwardRef(({ chatRoomId }, ref) => {
  const [selectedMeetingTime, setSelectedMeetingTime] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const datePickerRef = useRef<DatePicker>(null);

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
    console.log(selectedMeetingTime);
  };

  useEffect(() => {
    const isoStringMeetingTime = selectedMeetingTime.toISOString();
    console.log(selectedMeetingTime, '///', isoStringMeetingTime);
    //Sat Apr 27 2024 18:00:00 GMT+0900 (한국 표준시) '///' '2024-04-27T09:00:00.000Z'

    // 슈퍼베이스에 시간 추가
    const updateMeetingTime = async () => {
      const { error } = await clientSupabase
        .from('chatting_room')
        .update({ meeting_time: isoStringMeetingTime })
        .eq('chatting_room_id', chatRoomId);
      if (error) {
        console.log('서버에 미팅 시간 추가 에러', error);
      }
    };

    updateMeetingTime();
  }, [selectedMeetingTime]);

  // months 배열을 선언
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  return (
    <div className="relative z-50 w-full max-w-lg">
      <DatePicker
        calendarStartDay={1} // 시작을 월요일로
        locale={ko} // 한국어
        showPopperArrow={false} // 위에 삼각형 제거
        wrapperClassName="w-full z-100"
        selected={selectedMeetingTime}
        onChange={(date) => {
          setSelectedMeetingTime(date as Date);
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

export default DateTimePicker;
