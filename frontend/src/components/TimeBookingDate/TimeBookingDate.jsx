// TimeBookingDate.jsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TimeBookingDate.css';

const TimeBookingDate = ({setErrors, setActiveStep, selectedDate, setSelectedDate, selectedDuration, setSelectedDuration, selectedTime, setSelectedTime}) => {
     // Error states for Step 1
  const [durationError, setDurationError] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

     
  const isValidDate = selectedDate && new Date(selectedDate).setHours(0, 0, 0, 0) >= today;
      // Reset error messages when a user makes a new selection
      useEffect(() => {
        if (selectedDuration) setDurationError('');
        if (selectedDate) setDateError('');
        if (selectedTime) setTimeError('');
      }, [selectedDuration, selectedDate, selectedTime]);

  const durations = [
    { label: '40 mins', value: 40 },
    { label: '15 mins', value: 15 }
  ];

    // Handle Step Navigation
    const handleNextStep = () => {
      let hasError = false;
  
      // Validate Duration
      if (!selectedDuration) {
        setDurationError('Please select a session duration');
        hasError = true;
      }
  
      // Validate Date
      if (!selectedDate || !isValidDate) {
        setDateError('Please select a valid date');
        hasError = true;
      }
  
      // Validate Time Slot
      if (!selectedTime) {
        setTimeError('Please select a time slot');
        hasError = true;
      }
  
      // If there are no errors, proceed to the next step
      if (!hasError) {
        setActiveStep(1);
        setErrors({})
      }
    };
  

    // Generate time slots in 30-minute intervals
    const generateTimeSlots = () => {
      const slots = [];
      let startTime = new Date();
      startTime.setHours(9, 0, 0, 0);
      const endTime = new Date();
      endTime.setHours(18, 0, 0, 0);
  
      while (startTime < endTime) {
        slots.push(new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        startTime.setMinutes(startTime.getMinutes() + 30);
      }
  
      return slots;
    };
  
    const timeSlots = generateTimeSlots();

  return (
    <>
    <div className='time__container'>
      <div className='time__duration-buttons'>
        {durations.map((duration) => (
          <button
            key={duration.value}
            className={`time__duration-button ${selectedDuration === duration.value ? 'time__duration-button_active' : ''}`}
            onClick={() => setSelectedDuration(duration.value)}
          >
            {duration.label}
          </button>
        ))}
        {durationError && <p className='time__error-message-duration'>{durationError}</p>}
      </div>

      <div className='time__calendar'>
      {dateError && <p className='time__error-message'>{dateError}</p>}
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>

      <div className='time__slots-container'>
        <div className='time__slots'>
          <h2>Available Time Slots</h2>
          <ul className='time__list'>
          {timeError && <p className='time__error-message'>{timeError}</p>} 
            {timeSlots.map((time, index) => (
              <li
                key={index}
                className={`time__slot ${selectedTime === time ? 'time__slot_selected' : ''}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <div className='time__next-step'>
    <button
        className={`time__next-step-button ${isValidDate && selectedDuration && selectedTime ? 'time__next-step-button_active' : ''}`}
        onClick={handleNextStep}
      >
        Next
      </button>
    </div>
  </>
  )
};

export default TimeBookingDate;
