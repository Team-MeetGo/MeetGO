import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimePicker = () => {
  const [selectedMeetingTime, setSelectedMeetingTime] = useState(new Date());

  return (
    <div className="relative z-50 w-full max-w-lg">
      <DatePicker
        selected={selectedMeetingTime}
        onChange={(date) => setSelectedMeetingTime(date as Date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={30}
        timeCaption="Time"
        dateFormat="yyyy년 MM월 dd일 / aa h:mm"
        shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
        className="w-[300px]"
      />
    </div>
  );
};

export default DateTimePicker;
