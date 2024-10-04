import React, { useState } from 'react';
import './TimeBooking.css';

const TimeBooking = () => {
  // State to track the active step (0: Session, 1: Details, 2: Done)
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className='time' id="time">
      <h1 className='time__title'>RESERVATION</h1>
      <div className='time__navigation'>
        <div className='time__step'>
          {/* Step 1: Session */}
          <div
            className={`time__point ${activeStep >= 0 ? 'time__point_active' : ''}`}
            onClick={() => setActiveStep(0)}
          >
            <span className='time__number'>1</span>
            <span className={`time__label ${activeStep >= 0 ? 'time__label_active' : ''}`}>
              Session
            </span>
          </div>

          {/* Connecting Line */}
          <div className={`time__line ${activeStep > 0 ? 'time__line_active' : ''}`}></div>

          {/* Step 2: Details */}
          <div
            className={`time__point ${activeStep >= 1 ? 'time__point_active' : ''}`}
            onClick={() => setActiveStep(1)}
          >
            <span className='time__number'>2</span>
            <span className={`time__label ${activeStep >= 1 ? 'time__label_active' : ''}`}>
              Details
            </span>
          </div>

          {/* Connecting Line */}
          <div className={`time__line ${activeStep > 1 ? 'time__line_active' : ''}`}></div>

          {/* Step 3: Done */}
          <div
            className={`time__point ${activeStep >= 2 ? 'time__point_active' : ''}`}
            onClick={() => setActiveStep(2)}
          >
            <span className='time__number'>3</span>
            <span className={`time__label ${activeStep >= 2 ? 'time__label_active' : ''}`}>
              Done
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeBooking;

