import React, { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DateCustomeInput from './DateCustomeInput';
import { ko } from 'date-fns/locale';

const DateTimePicker = () => {
  const [selectedMeetingTime, setSelectedMeetingTime] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const datePickerRef = useRef<DatePicker>(null);

  const toggleCalendar = () => {
    setCalendarOpen((prevState) => !prevState); // 캘린더 상태를 토글합니다.
    console.log('아오', calendarOpen);
  };

  return (
    <div className="relative z-50 w-full max-w-lg">
      <DatePicker
        locale={ko}
        wrapperClassName="w-full z-100"
        selected={selectedMeetingTime}
        onChange={(date) => {
          setSelectedMeetingTime(date as Date);
          setCalendarOpen(false); // 캘린더를 닫습니다.
        }}
        minDate={new Date()} // 오늘 이전의 날짜 선택 불가
        showTimeSelect
        timeIntervals={30}
        timeCaption="Time"
        dateFormat="yyyy년 MM월 dd일 / aa h:mm"
        shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
        customInput={<DateCustomeInput onClick={toggleCalendar} />} // 클릭 이벤트 핸들러를 전달합니다.
        //open={calendarOpen} // 캘린더의 열림/닫힘 상태를 DatePicker에 전달합니다.
        ref={datePickerRef} // DatePicker에 ref를 추가합니다.
      />
    </div>
  );
};

export default DateTimePicker;

//popperPlacement="left"
// 캘린더 위치 테스트
//popperPlacement="bottom"
//className={'react-datepicker__input-container input'styles.default.datepicker}
//popperClassName="react-datepicker-right"
//dayClassName={(d) =>
//   d.getDate() === selectedMeetingTime!.getDate() ? styles.default.selectedDay : styles.default.unselectedDay
// }
//calendarClassName="w-full"
//fixedHeight
//className="w-full flex items-center border border-gray-300 rounded bg-white box-border h-12 text-center pr-14 focus:border-2 focus:border-orange-500"
