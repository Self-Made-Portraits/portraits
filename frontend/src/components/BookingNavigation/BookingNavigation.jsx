// StepNavigation.jsx
import React from 'react';
import './BookingNavigation.css'; // Import the related styles

const BookingNavigation = ({ steps, activeStep, setActiveStep }) => {
  return (
    <div className='time__navigation'>
      <div className='time__step'>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={`time__point ${activeStep >= index ? 'time__point_active' : ''}`}
              onClick={() => setActiveStep(index)}
            >
              <span className='time__number'>{step.number}</span>
              <span className={`time__label ${activeStep >= index ? 'time__label_active' : ''}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`time__line ${activeStep > index ? 'time__line_active' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookingNavigation;
