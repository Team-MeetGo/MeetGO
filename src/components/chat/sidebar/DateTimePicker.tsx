import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns';

const DateTimePicker = () => {
  const [selectedMeetingTime, setSelectedMeetingTime] = useState(setHours(setMinutes(new Date(), 30), 16));

  return (
    <div className="relative z-50 w-full max-w-lg">
      <div className="w-full">
        <DatePicker
          selected={selectedMeetingTime}
          onChange={(date) => setSelectedMeetingTime(date as Date)}
          showTimeSelect
          includeTimes={[
            // Predefined times for selection
            setHours(setMinutes(new Date(), 0), 17), // Set time to 17:00 (5:00 PM)
            setHours(setMinutes(new Date(), 30), 18), // Set time to 18:30 (6:30 PM)
            setHours(setMinutes(new Date(), 30), 19), // Set time to 19:30 (7:30 PM)
            setHours(setMinutes(new Date(), 30), 17) // Set time to 17:30 (5:30 PM) - example repeated
          ]}
          dateFormat="yyyy년 MM월 dd일 / aa h:mm" // Date and time format
          shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
          className="w-full"
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
