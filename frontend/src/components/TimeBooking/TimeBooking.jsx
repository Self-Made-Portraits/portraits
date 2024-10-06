import React, { useState, useEffect } from 'react';
import './TimeBooking.css';
import TimeBookingDate from '../TimeBookingDate/TimeBookingDate';
import TimeBookingForm from '../TimeBookingForm/TimeBookingForm';
import TimeBookingVerification from '../TimeBookingVerification/TimeBookingVerification';

const TimeBooking = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [willComeWithPets, setWillComeWithPets] = useState(null);
  const [errors, setErrors] = useState({});

  // Scroll to the top every time the active step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  const handleBackStep = () => {
    setActiveStep(activeStep - 1);
    setErrors({}); // Reset errors when moving back
  };

  const renderError = (fieldName) => (
    errors[fieldName] ? <div className="time__form-error">{errors[fieldName]}</div> : null
  );

  return (
    <section className='time' id="time">
      <h1 className='time__title'>RESERVATION</h1>
      {/* Navigation Steps */}
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

      {/* Step 1: Session Selection */}
      {activeStep === 0 && (
        <TimeBookingDate
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          setActiveStep={setActiveStep}
          setErrors={setErrors}
        />
      )}

      {/* Step 2: Form Details */}
      {activeStep === 1 && (
        <TimeBookingForm
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          phone={phone}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          renderError={renderError}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
          willComeWithPets={willComeWithPets}
          setWillComeWithPets={setWillComeWithPets}
          handleBackStep={handleBackStep}
          errors={errors}
          setErrors={setErrors}
          setActiveStep={setActiveStep}
        />
      )}

      {/* Step 3: Final Confirmation */}
      {activeStep === 2 && (
        <TimeBookingVerification
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          phone={phone}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
          setWillComeWithPets={setWillComeWithPets} 
          handleBackStep={handleBackStep}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      )}
    </section>
  );
};

export default TimeBooking;

