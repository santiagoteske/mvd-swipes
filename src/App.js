import React, { useState, useEffect } from "react";
import "./App.css";
import ModernCalendar from "./ModernCalendar";
import Button from "@mui/material/Button";

function App() {
  const [swipesRemaining, setSwipesRemaining] = useState(9);
  const [selectedDates, setSelectedDates] = useState([]);
  const [isDaysOffChecked, setIsDaysOffChecked] = useState(false);
  const [daysOffValue, setDaysOffValue] = useState(0);

  let today = new Date();  

  useEffect(() => {
    console.log("Fetching stored dates from localStorage...");
    const storedDates = JSON.parse(localStorage.getItem("selectedDates"));
    if (storedDates) {
      setSelectedDates(storedDates.map((dateStr) => new Date(dateStr)));
      console.log("Stored dates found and set in state. DATES: ", storedDates);
    }

    const storedDaysOff = JSON.parse(localStorage.getItem("daysOffValue"));
    console.log("Cargando cantidad de dias off: ", storedDaysOff);
    if (storedDaysOff !== null) {
      setIsDaysOffChecked(true);
      setDaysOffValue(storedDaysOff);
    }
  }, []);

  useEffect(() => {
    if (isDaysOffChecked) {
      localStorage.setItem("daysOffValue", JSON.stringify(daysOffValue));
    } else {
      localStorage.removeItem("daysOffValue");
    }
  }, [isDaysOffChecked, daysOffValue]);


  useEffect(() => {
    // Filtrar las fechas del mes actual
    const currentMonthDates = selectedDates.filter(
      (date) => date.getMonth() === today.getMonth()
    );

    // Calculating swipes remaining
    const todaySelected = currentMonthDates.some((date) =>
      areDatesEqual(date, today)
    );
    let remaining;

    if (daysOffValue >= 5 && daysOffValue <= 9) {
      remaining = 6 - currentMonthDates.length;
    } else if (daysOffValue > 9) {
      remaining = 4 - currentMonthDates.length;
    } else {
      remaining = 9 - currentMonthDates.length;
    }

    // Guardar los datos solo si hay fechas seleccionadas
    if (selectedDates.length > 0) {
      localStorage.setItem(
        "selectedDates",
        JSON.stringify(selectedDates.map((date) => date.toISOString()))
      );
      console.log(
        "Updating localStorage and swipesRemaining...",
        JSON.stringify(selectedDates.map((date) => date.toISOString()))
      );
    }

    console.log("Setting swipesRemaining:", remaining);
    remaining >= 0 ? setSwipesRemaining(remaining) : setSwipesRemaining(0);
  }, [selectedDates, today, daysOffValue]);


  
  const handleSwipe = () => {
    console.log("Handling swipe...");
    if (!selectedDates.some((date) => areDatesEqual(date, today))) {
      setSelectedDates([...selectedDates, today]);
      console.log("Today's date added to selectedDates.");
    }
  };

  const handleDateChange = (date) => {
    if (selectedDates.some((d) => areDatesEqual(d, date))) {
      setSelectedDates(selectedDates.filter((d) => !areDatesEqual(d, date)));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const areDatesEqual = (date1, date2) => {
    return (
      date2 &&
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        Swipes restantes: {swipesRemaining}
      </header>
      <ModernCalendar
        selectedDates={selectedDates}
        onClickDay={handleDateChange}
      />
      <Button
        className="btn-swipe"
        variant="contained"
        id="btn-swipe"
        onClick={handleSwipe}
        disabled={
          swipesRemaining === 0 ||
          selectedDates.some((date) => areDatesEqual(date, today))
        }
      >
        Registrar Swipe
      </Button>
      <div className="checkbox-container">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isDaysOffChecked}
            onChange={() => setIsDaysOffChecked(!isDaysOffChecked)}
          />
          <span>Days Off</span>
        </label>
        <input
          type="number"
          className={`days-off-input${isDaysOffChecked ? "" : " disabled"}`}
          value={daysOffValue}
          onChange={(e) => setDaysOffValue(e.target.value)}
          disabled={!isDaysOffChecked}
          min="0"
        />
      </div>
    </div>
  );
}

export default App;
