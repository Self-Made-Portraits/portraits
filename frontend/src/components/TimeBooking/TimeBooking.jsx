import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TimeBooking.css';

const TimeBooking = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const durations = [
    { label: '40 mins', value: 40 },
    { label: '15 mins', value: 15 }
  ];

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
  const isValidDate = selectedDate && new Date(selectedDate).setHours(0, 0, 0, 0) >= today;

  const handleNextStep = () => {
    if (isValidDate && selectedDuration && selectedTime) {
      setActiveStep(1);
    }
  };

  const handleBackStep = () => {
    setActiveStep(0);
  };

  return (
    <section className='time' id="time">
      <h1 className='time__title'>RESERVATION</h1>

      <div className='time__navigation'>
        <div className='time__step'>
          <div className={`time__point ${activeStep >= 0 ? 'time__point_active' : ''}`} onClick={() => setActiveStep(0)}>
            <span className='time__number'>1</span>
            <span className={`time__label ${activeStep >= 0 ? 'time__label_active' : ''}`}>Session</span>
          </div>
          <div className={`time__line ${activeStep > 0 ? 'time__line_active' : ''}`}></div>

          <div className={`time__point ${activeStep >= 1 ? 'time__point_active' : ''}`} onClick={() => setActiveStep(1)}>
            <span className='time__number'>2</span>
            <span className={`time__label ${activeStep >= 1 ? 'time__label_active' : ''}`}>Details</span>
          </div>
          <div className={`time__line ${activeStep > 1 ? 'time__line_active' : ''}`}></div>

          <div className={`time__point ${activeStep >= 2 ? 'time__point_active' : ''}`} onClick={() => setActiveStep(2)}>
            <span className='time__number'>3</span>
            <span className={`time__label ${activeStep >= 2 ? 'time__label_active' : ''}`}>Done</span>
          </div>
        </div>
      </div>

      {activeStep === 1 && (
        <div className='time__confirmation'>
          <p className='time__confirmation-text'>
            Your selected date and time is: <strong>{selectedDate?.toLocaleDateString()}</strong> at <strong>{selectedTime}</strong> for <strong>{selectedDuration} minutes</strong>.
          </p>
          <button className='time__back-button' onClick={handleBackStep}>
            Back
          </button>
        </div>
      )}

      {activeStep === 0 && (
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
          </div>

          <div className='time__calendar'>
            <Calendar onChange={setSelectedDate} value={selectedDate} />
          </div>

          <div className='time__slots-container'>
            <div className='time__slots'>
              <h2>Available Time Slots</h2>
              <ul className='time__list'>
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
      )}

      {activeStep === 0 && (
        <div className='time__next-step'>
          <button
            className={`time__next-step-button ${isValidDate && selectedDuration && selectedTime ? 'time__next-step-button_active' : ''}`}
            onClick={handleNextStep}
            disabled={!isValidDate || !selectedDuration || !selectedTime}
          >
            Next Step
          </button>
        </div>
      )}
    </section>
  );
};

export default TimeBooking;
