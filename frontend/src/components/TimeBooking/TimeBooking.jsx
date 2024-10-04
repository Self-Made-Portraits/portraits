import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TimeBooking.css';

const TimeBooking = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

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
      setActiveStep(activeStep - 1); // Decrease the step to move to the previous one
    };
    // Calculate the final price based on the duration
    const finalPrice = selectedDuration === 15 ? 30 : 60;

    // Handle form submission in Step 2
    const handleFormSubmit = async () => {
      // Check that all fields are filled
      if (firstName && lastName && phone && email) {
        const bookingData = {
          date: selectedDate?.toLocaleDateString(),
          time: selectedTime,
          duration: selectedDuration,
          firstName,
          lastName,
          phone,
          email
        };
  
        try {
          // Send data to the server
          const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
          });
  
          const result = await response.json();
          console.log('Booking data sent successfully:', result);
  
          // Move to Step 3 (Done) after successful form submission
          setActiveStep(2);
        } catch (error) {
          console.error('Error sending booking data:', error);
        }
      }
    };

    // Handle applying a coupon code
    const handleApplyCoupon = () => {
      if (coupon.toLowerCase() === "discount10") {
        setDiscount(10); // Apply a £10 discount for a specific coupon code
        alert("Coupon applied successfully! £10 off your total.");
      } else {
        alert("Invalid coupon code. Please try again.");
      }
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
          <button
              type='button'
              className='time__final-step-button time__final-step-button_active'
              onClick={() => alert("Proceeding to Payment...")}
            >
              Proceed to Payment
            </button>
        </div>
        </>
      )}
      {activeStep === 1 && (
        <>
        <div className='time__confirmation'>
        <button type='button' className='time__back-button' onClick={handleBackStep}>
            Back
          </button>
          <p className='time__confirmation-text'>
            Your selected date and time is:<br/> <strong>{selectedDate?.toLocaleDateString()}</strong> at <strong>{selectedTime}</strong> for <strong>{selectedDuration} minutes</strong>.
          </p>
        </div>
                  <form className='time__form'>
                  <div className='time__form-group'>
                    <label htmlFor='firstName'>First Name</label>
                    <input
                      id='firstName'
                      type='text'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
      
                  <div className='time__form-group'>
                    <label htmlFor='lastName'>Last Name</label>
                    <input
                      id='lastName'
                      type='text'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
      
                  <div className='time__form-group'>
                    <label htmlFor='phone'>Phone</label>
                    <input
                      id='phone'
                      type='tel'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
      
                  <div className='time__form-group'>
                    <label htmlFor='email'>Email</label>
                    <input
                      id='email'
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </form>
                <div className='time__button-container'>
                <button
                type='button'
                className='time__next-step-button time__next-step-button_active'
                onClick={handleFormSubmit}
              >
                Next
              </button>
              </div>
                </>
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
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default TimeBooking;
