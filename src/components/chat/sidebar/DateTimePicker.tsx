import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as styles from '../../../styles/tailwind.module.css';
import DateCustomeInput from './DateCustomeInput';

const DateTimePicker = () => {
  const [selectedMeetingTime, setSelectedMeetingTime] = useState(new Date());

  return (
    <div className="relative z-50 w-full max-w-lg">
      <DatePicker
        wrapperClassName="w-full z-100"
        selected={selectedMeetingTime}
        onChange={(date) => setSelectedMeetingTime(date as Date)}
        minDate={new Date()} // 오늘 이전의 날짜 선택 불가
        showTimeSelect
        timeIntervals={30}
        timeCaption="Time"
        dateFormat="yyyy년 MM월 dd일 / aa h:mm"
        shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
        //popperClassName="z-100"
        //className={styles.default.datePicker}
        customInput={<DateCustomeInput />}
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
