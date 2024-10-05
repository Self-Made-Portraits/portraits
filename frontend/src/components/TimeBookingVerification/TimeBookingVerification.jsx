// TimeBookingVerification.jsx
import React, { useState,useEffect } from 'react';
import './TimeBookingVerification.css';

const TimeBookingVerification = ({
  selectedDate,
  selectedTime,
  selectedDuration,
  firstName,
  lastName,
  phone,
  email,
  coupon,
  setCoupon,
  discount,
  setDiscount,
  handleBackStep,
  resetFormData,
  activeStep,
  setActiveStep
}) => {

const [remainingTime, setRemainingTime] = useState(600); // Timer state for countdown (in seconds)

// Calculate the final price based on the duration
  const finalPrice = (selectedDuration === 15 ? 30 : 60) - discount;

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

      const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      };
      

  return (
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
  );
};

export default TimeBookingVerification;

