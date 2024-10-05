import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TimeBooking.css';

const TimeBooking = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
    // Error states for Step 1
    const [durationError, setDurationError] = useState('');
    const [dateError, setDateError] = useState('');
    const [timeError, setTimeError] = useState('');

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [willComeWithPets, setWillComeWithPets] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({}); // New state for validation errors

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [remainingTime, setRemainingTime] = useState(600); // Timer state for countdown (in seconds)

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const durations = [
    { label: '40 mins', value: 40 },
    { label: '15 mins', value: 15 }
  ];

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

  // Calculate the final price based on the duration
  const finalPrice = (selectedDuration === 15 ? 30 : 60) - discount;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  
  // Handle form validation
  useEffect(() => {
    setIsFormValid(
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      phone.trim() !== '' &&
      email.trim() !== '' &&
      willComeWithPets !== null
    );
  }, [firstName, lastName, phone, email, willComeWithPets]);

  const isValidDate = selectedDate && new Date(selectedDate).setHours(0, 0, 0, 0) >= today;

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
    // if (isValidDate && selectedDuration && selectedTime) {
    //   setActiveStep(1);
    //   setErrors({});  // Reset errors on moving to the next step
    // }
  };

  const handleBackStep = () => {
    setActiveStep(activeStep - 1);
    setErrors({}); // Reset errors when moving back
  };

    // Validate fields before submission
    const validateForm = () => {
      const validationErrors = {};
      if (!firstName.trim()) validationErrors.firstName = ` - first name is required`;
      if (!lastName.trim()) validationErrors.lastName = "- last name is required";
      if (!phone.trim()) validationErrors.phone = "- phone number is required";
      if (!email.trim()) validationErrors.email = "- email is required";
      if (willComeWithPets === null) validationErrors.willComeWithPets = "- please select an option";
  
      setErrors(validationErrors);
      console.log("Validation Errors:", validationErrors);
      return Object.keys(validationErrors).length === 0;
    };

  // Existing form submission function
  // Existing form submission function with validation logic
  const handleFormSubmit = async () => {
    if (validateForm()) {
      const bookingData = {
        date: selectedDate?.toLocaleDateString(),
        time: selectedTime,
        duration: selectedDuration,
        firstName,
        lastName,
        phone,
        email,
        willComeWithPets
      };

      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        const result = await response.json();
        console.log('Booking data sent successfully:', result);

        setActiveStep(2); // Move to Step 3 (Done) after successful form submission
      } catch (error) {
        console.error('Error sending booking data:', error);
      }
    }
  };

  const renderError = (fieldName) => (
    errors[fieldName] ? <div className="time__form-error">{errors[fieldName]}</div> : null
  );

  // Handle applying a coupon code
  const handleApplyCoupon = () => {
    if (coupon.toLowerCase() === "discount10") {
      setDiscount(10); // Apply a £10 discount for a specific coupon code
      alert("Coupon applied successfully! £10 off your total.");
    } else {
      alert("Invalid coupon code. Please try again.");
    }
  };

  // Handle Timer for Step 3
  useEffect(() => {
    let timer;

    if (activeStep === 2) {
      setRemainingTime(600); // Reset to 10 minutes
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            alert('Time is up! You will be redirected to the first step.');
            setActiveStep(0); // Redirect to Step 1
            resetFormData();  // Optional: Reset all form data
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer); // Cleanup the timer when component unmounts or step changes
  }, [activeStep]);
    // Function to reset form data (optional)
    const resetFormData = () => {
      setSelectedDate(null);
      setSelectedDuration(null);
      setSelectedTime(null);
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setWillComeWithPets(null);
      setCoupon("");
      setDiscount(0);
    };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

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
      )}

      {/* Step 2: Form Details */}
      {activeStep === 1 && (
        <>
          {/* Form Section */}
          <div className='time__confirmation'>
            <button type='button' className='time__back-button' onClick={handleBackStep}>
              Back
            </button>
            <p className='time__confirmation-text'>
              Your selected date and time is:<br /> <strong>{selectedDate?.toLocaleDateString()}</strong> at <strong>{selectedTime}</strong> for <strong>{selectedDuration} minutes</strong>.
            </p>
          </div>

          <form className='time__form'>
            <div className='time__form-group'>
              <label className='time__form-field' htmlFor='firstName'>First Name&nbsp; {renderError('firstName')}</label>
              <input
                id='firstName'
                type='text'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className='time__form-group'>
              <label className='time__form-field'  htmlFor='lastName'>Last Name&nbsp; {renderError('lastName')}</label>
              <input
                id='lastName'
                type='text'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className='time__form-group'>
              <label className='time__form-field'  htmlFor='phone'>Phone&nbsp; {renderError('phone')}</label>
              <input
                id='phone'
                type='tel'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className='time__form-group'>
              <label className='time__form-field'  htmlFor='email'>Email&nbsp; {renderError('email')}</label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Will you come with pets? */}
            <div className='time__form-group'>
              <label className='time__form-field'>Will you come with pets?&nbsp; {renderError('willComeWithPets')}</label>
              <div className='time__form-options'>
                <label className='time__form-field'>
                  <input
                    type='radio'
                    className='time__radio'
                    name='pets'
                    value='Yes'
                    onChange={(e) => setWillComeWithPets(e.target.value)}
                    checked={willComeWithPets === 'Yes'}
                    required
                  />
                  Yes
                </label>
                <label>
                  <input
                    type='radio'
                    className='time__radio'
                    name='pets'
                    value='No'
                    onChange={(e) => setWillComeWithPets(e.target.value)}
                    checked={willComeWithPets === 'No'}
                    required
                  />
                  No
                </label>
              </div>
            </div>
          </form>

          <div className='time__button-container'>
          <button
              type='button'
              className={`time__next-step-button ${isFormValid ? 'time__next-step-button_active' : ''}`}
              onClick={handleFormSubmit}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Step 3: Final Confirmation */}
      {activeStep === 2 && (
        <>
          <div className='time__confirmation'>
            <button type='button' className='time__back-button' onClick={handleBackStep}>
              Back
            </button>
            <h2 className='time__confirmation-subtitle'>Booking Confirmation</h2>
          </div>
          <div className='time__confirmation-final'>
            {/* Display the Timer */}
            <p className='time__timer'>
              <strong>Time Remaining: {formatTime(remainingTime)}</strong>
            </p>
            <p className='time__confirmation-final-text'>
              <strong>Date:</strong> {selectedDate?.toLocaleDateString()} <br />
              <strong>Time:</strong> {selectedTime} <br />
              <strong>Duration:</strong> {selectedDuration} minutes <br />
              <strong>First Name:</strong> {firstName} <br />
              <strong>Last Name:</strong> {lastName} <br />
              <strong>Phone:</strong> {phone} <br />
              <strong>Email:</strong> {email} <br />
              <strong>Total Price:</strong> £{finalPrice}
            </p>

            {/* Coupon Input Section */}
            <div className='time__coupon'>
              <input
                type='text'
                className='time__coupon-input'
                placeholder='Enter coupon code'
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button
                type='button'
                className='time__coupon-button'
                onClick={handleApplyCoupon}
              >
                Apply Coupon
              </button>
            </div>

            {/* Proceed to Payment Button */}
            <button
              type='button'
              className='time__final-step-button time__final-step-button_active'
              onClick={() => alert("Proceeding to Payment...")}
              disabled={remainingTime === 0} // Disable if the timer reaches 0
            >
              Proceed to Payment
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default TimeBooking;
