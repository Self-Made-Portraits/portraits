import React, { useState, useEffect } from 'react';
import './GiftBooking.css'; 
import BookingNavigation from '../BookingNavigation/BookingNavigation';

const GiftBooking = ({  }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [recipientFirstName, setRecipientFirstName] = useState("");
  const [recipientLastName, setRecipientLastName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({});

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\d+$/.test(phone);

  const renderError = (fieldName) => (
    errors[fieldName] ? <div className="gift-booking__form-error">{errors[fieldName]}</div> : null
  );

  const handleDurationClick = (value) => {
    setSelectedDuration(value);
  };

  const handleBackStep = () => {
    setActiveStep(activeStep - 1);
    setErrors({}); // Reset errors when moving back
  };

  const steps = [
    { number: 1, label: 'Card' },
    { number: 2, label: 'Details' },
    { number: 3, label: 'Done' }
  ];

  return (
    <section className='gift-booking' id="gift-booking">
      <h1 className='gift-booking__title'>GIFT BOOKING</h1>
      <BookingNavigation steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />

      {activeStep === 0 && (
        <div className='gift-booking__step-0'>
      {/* Left Column with Image */}
      <div className='gift-booking__image-container'>
        <img src="https://via.placeholder.com/400" alt="Gift Image" className='gift-booking__image' />
      </div>
      {/* Right Column with Session Durations and Quantity */}
      <div className='gift-booking__session-container'>
        <div className='gift-booking__durations-container'>
          {[
            { label: '15 mins', price: 30 },
            { label: '30 mins', price: 40 },
            { label: '45 mins', price: 60 },
            { label: '60 mins', price: 75 }
          ].map((item, index) => (
            <div key={index} className='gift-booking__duration-row'>
              {/* Duration Field */}
              <div className={`gift-booking__duration-label ${selectedDuration === item.label ? 'gift-booking__duration-label_active' : ''}`} onClick={() => setSelectedDuration(item.label)}>
                {item.label} - £{item.price}
              </div>

              {/* Quantity Selection for each Duration */}
              <div className='gift-booking__quantity-container'>
                <input
                  className='gift-booking__quantity-input'
                  type='number'
                  value={quantity[item.label] || 0}
                  readOnly
                />
                <div className='gift-booking__quantity-buttons'>
                  <button
                    type='button'
                    className='gift-booking__quantity-button'
                    onClick={() => setQuantity((prev) => ({
                      ...prev,
                      [item.label]: Math.max((prev[item.label] || 0) - 1, 0)
                    }))}
                  >
                    -
                  </button>
                  <button
                    type='button'
                    className='gift-booking__quantity-button'
                    onClick={() => setQuantity((prev) => ({
                      ...prev,
                      [item.label]: (prev[item.label] || 0) + 1
                    }))}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Display Total Sum */}
        <div className='gift-booking__total-sum'>
          <h3>Total Sum: £{Object.keys(quantity).reduce((sum, key) => sum + (quantity[key] || 0) * ({ '15 mins': 30, '30 mins': 40, '45 mins': 60, '60 mins': 75 }[key] || 0), 0)}</h3>
              </div>

              {/* Next Button for Step 1 */}
              <div className='gift-booking__button-container'>
                <button
                  type='button'
                  className='gift-booking__next-step-button'
                  onClick={() => setActiveStep(1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
      )}

      {activeStep === 1 && (
        <>
        <div className='time__confirmation'>
        <button type='button' className='time__back-button' onClick={handleBackStep}>
          Back
        </button>
        <p className='time__confirmation-text'>
          Your selected date and time is:<br /> <strong></strong> at <strong>{}</strong> for <strong>{} minutes</strong>.
        </p>
      </div>
        <form className='gift-booking__form'>
          {/* Sender's Information */}
          <h3>Sender's Information</h3>
          <div className='gift-booking__form-group'>
            <label className='gift-booking__form-field' htmlFor='firstName'>First Name&nbsp; {renderError('firstName')}</label>
            <input
              id='firstName'
              type='text'
              value={firstName}
              placeholder="John"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className='gift-booking__form-group'>
            <label className='gift-booking__form-field' htmlFor='lastName'>Last Name&nbsp; {renderError('lastName')}</label>
            <input
              id='lastName'
              type='text'
              value={lastName}
              placeholder="Smith"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className='gift-booking__form-group'>
            <label className='gift-booking__form-field' htmlFor='phone'>Phone&nbsp; {renderError('phone')}</label>
            <input
              id='phone'
              type='tel'
              value={phone}
              placeholder="e.g., 07123456789"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className='gift-booking__form-group'>
            <label className='gift-booking__form-field' htmlFor='email'>Email&nbsp; {renderError('email')}</label>
            <input
              id='email'
              type='email'
              value={email}
              placeholder="example@domain.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Recipient's Information */}
          <h3>Recipient's Information</h3>
          <div className='gift-booking__form-group'>
            <label className='gift-booking__form-field' htmlFor='recipientFirstName'>Recipient's First Name&nbsp; {renderError('recipientFirstName')}</label>
            <input
              id='recipientFirstName'
              type='text'
              value={recipientFirstName}
              placeholder="Jane"
              onChange={(e) => setRecipientFirstName(e.target.value)}
              required
            />
          </div>

          <div className='gift-booking__form-group'>
            <label className='gift-booking__form-field' htmlFor='recipientLastName'>Recipient's Last Name&nbsp; {renderError('recipientLastName')}</label>
            <input
              id='recipientLastName'
              type='text'
              value={recipientLastName}
              placeholder="Doe"
              onChange={(e) => setRecipientLastName(e.target.value)}
              required
            />
          </div>

          <div className='gift-booking__form-group'>
            <label className='gift-booking__form-field' htmlFor='recipientPhone'>Recipient's Phone&nbsp; {renderError('recipientPhone')}</label>
            <input
              id='recipientPhone'
              type='tel'
              value={recipientPhone}
              placeholder="e.g., 07123456789"
              onChange={(e) => setRecipientPhone(e.target.value)}
              required
            />
          </div>

          <div className='gift-booking__form-group'>
            <label className='gift-booking__form-field' htmlFor='recipientEmail'>Recipient's Email&nbsp; {renderError('recipientEmail')}</label>
            <input
              id='recipientEmail'
              type='email'
              value={recipientEmail}
              placeholder="recipient@domain.com"
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
            />
          </div>
          <div className='gift-booking__button-container'>
            <button
              type='button'
              className={`gift-booking__next-step-button ${isFormValid ? 'gift-booking__next-step-button_active' : ''}`}
              onClick={() => setActiveStep(2)}
            >
              Next
            </button>
          </div>
        </form>
        </>
      )}
    </section>
  );
};

export default GiftBooking;
