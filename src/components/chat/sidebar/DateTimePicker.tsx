import React, { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DateCustomeInput from './DateCustomeInput';
import { ko } from 'date-fns/locale';
import { getMonth, getYear } from 'date-fns';
import { IoChevronBackSharp } from 'react-icons/io5';
import { IoChevronForwardSharp } from 'react-icons/io5';

const DateTimePicker = () => {
  const [selectedMeetingTime, setSelectedMeetingTime] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const datePickerRef = useRef<DatePicker>(null);

  const toggleCalendar = () => {
    setCalendarOpen((prevState) => !prevState); // 캘린더 상태를 토글합니다.
    console.log('아오', calendarOpen);
  };

  const TimeHeader = ({ date }: { date: Date }) => <div className="px-4 text-black text-base">시간</div>;

  // months 배열을 선언합니다.
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  return (
    <div className="relative z-50 w-full max-w-lg">
      <DatePicker
        // dayClassName={(d) =>
        //   d.getDate() === selectedMeetingTime!.getDate() ? styles.default.selectedDay : styles.default.unselectedDay
        // }
        calendarStartDay={1}
        locale={ko}
        showPopperArrow={false}
        wrapperClassName="w-full z-100"
        selected={selectedMeetingTime}
        onChange={(date) => {
          setSelectedMeetingTime(date as Date);
          setCalendarOpen(false); // 캘린더를 닫습니다.
        }}
        minDate={new Date()} // 오늘 이전의 날짜 선택 불가능
        showTimeSelect
        timeIntervals={30}
        timeCaption="시간"
        dateFormat="yyyy년 MM월 dd일 / aa h:mm"
        shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
        customInput={<DateCustomeInput onClick={toggleCalendar} />} // 클릭 이벤트 핸들러를 전달합니다.
        //open={calendarOpen} // 캘린더의 열림/닫힘 상태를 DatePicker에 전달합니다.
        ref={datePickerRef} // DatePicker에 ref를 추가합니다.
        // 헤더를 커스텀해보자
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
};

export default DateTimePicker;
