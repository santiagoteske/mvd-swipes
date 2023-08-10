import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ModernCalendar.css";

const ModernCalendar = ({ selectedDates, onClickDay }) => {
  const [buttonSelectedDate, setButtonSelectedDate] = useState(null);

  useEffect(() => {
    if (buttonSelectedDate) {
      onClickDay(buttonSelectedDate);      
      setButtonSelectedDate(null);
    }
  }, [buttonSelectedDate, onClickDay]);

  

  const handleDateChange = (date) => {
    setButtonSelectedDate(date);    
  };

  const areDatesEqual = (date1, date2) => {
    return (
      date2 &&
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isDateSelected = (date) => {
    return selectedDates.some((d) => areDatesEqual(d, date));
  };

  const isButtonSelectedDate = (date) => {
    return (buttonSelectedDate && areDatesEqual(date, buttonSelectedDate));
  };

  let currentDate = new Date();

  return (
    <Calendar
      className="modern-calendar"
      maxDate={currentDate}
      value={selectedDates}
      tileContent={({ date }) =>
        isDateSelected(date) && !isDateSelected(buttonSelectedDate) ? (
          <span className="react-calendar__tile--selected-indicator">•</span>
        ) : null
      }
      tileClassName={({ date }) =>
        isDateSelected(date) || isDateSelected(buttonSelectedDate) || date > currentDate
          ? "react-calendar__tile--selected"          
          : null
      }
      onClickDay={handleDateChange}
    />
  );
};

export default ModernCalendar;
