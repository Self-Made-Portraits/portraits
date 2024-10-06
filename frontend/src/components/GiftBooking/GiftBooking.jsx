import React, { useState, useEffect } from 'react';
import './GiftBooking.css'; 

const GiftBooking = ({ setActiveStep, handleBackStep }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [willComeWithPets, setWillComeWithPets] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [recipientFirstName, setRecipientFirstName] = useState("");
  const [recipientLastName, setRecipientLastName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({});

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\d+$/.test(phone);

  const renderError = (fieldName) => (
    errors[fieldName] ? <div className="time__form-error">{errors[fieldName]}</div> : null
  );

  // Validate fields before submission
  const validateForm = () => {
    const validationErrors = {};
    if (!firstName.trim()) validationErrors.firstName = "- first name is required";
    if (!lastName.trim()) validationErrors.lastName = "- last name is required";
    if (!phone.trim()) validationErrors.phone = "- phone number is required";
    else if (!isValidPhone(phone)) validationErrors.phone = "- phone number must have only digits";
    if (!email.trim()) validationErrors.email = "- email is required";
    else if (!isValidEmail(email)) validationErrors.email = "- invalid email format";
    if (willComeWithPets === null) validationErrors.willComeWithPets = "- select an option";
    if (!recipientFirstName.trim()) validationErrors.recipientFirstName = "- recipient's first name is required";
    if (!recipientLastName.trim()) validationErrors.recipientLastName = "- recipient's last name is required";
    if (!recipientPhone.trim()) validationErrors.recipientPhone = "- recipient's phone number is required";
    else if (!isValidPhone(recipientPhone)) validationErrors.recipientPhone = "- recipient's phone number must have only digits";
    if (!recipientEmail.trim()) validationErrors.recipientEmail = "- recipient's email is required";
    else if (!isValidEmail(recipientEmail)) validationErrors.recipientEmail = "- recipient's email is invalid";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

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
        recipientFirstName,
        recipientLastName,
        recipientPhone,
        recipientEmail,
        willComeWithPets,
        quantity
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

  return (
    <>
      {/* Form Section */}
      <section className='gift-booking' id="gift-booking">
      <h1 className='gift-booking__title'>RESERVATION</h1>
      <form className='gift-booking__form'>
        {/* Quantity Selection */}
        <div className='gift-booking__form-group'>
          <label className='gift-booking__form-field'>Quantity</label>
          <div className='gift-booking__quantity-container'>
            <input
              className='gift-booking-input'
              type='number'
              value={quantity}
              readOnly
            />
            <div className='gift-booking__quantity-buttons'>
            <button type='button' className='gift-booking__quantity-button-down' onClick={() => setQuantity(quantity + 1)}>
                +
              </button>
              <button type='button' className='gift-booking__quantity-button-up' onClick={() => setQuantity(Math.max(quantity - 1, 1))}>
                -
              </button>
            </div>
          </div>
        </div>

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
      </form>

      <div className='gift-booking__button-container'>
        <button
          type='button'
          className={`gift-booking__next-step-button ${isFormValid ? 'gift-booking__next-step-button_active' : ''}`}
          onClick={handleFormSubmit}
        >
          Next
        </button>
      </div>
      </section>
    </>
  );
};

export default GiftBooking;
