import React, { useState, useEffect } from 'react';
import './GiftBooking.css'; 
import BookingNavigation from '../BookingNavigation/BookingNavigation';
import { formatTime, transactionTimer } from '../../utils/constants';

const GiftBooking = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [quantity, setQuantity] = useState({ '15 mins': 0, '30 mins': 0, '45 mins': 0, '60 mins': 0 });
  const [totalSum, setTotalSum] = useState(0);
  const [selectedDetails, setSelectedDetails] = useState({
    duration: '',
    quantity: 0,
    total: 0,
  });
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [userSelections, setUserSelections] = useState([]); // State to store chosen items and their details
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
  const [remainingTime, setRemainingTime] = useState(600); // Timer state for countdown (in seconds)

  // Prices for each duration
  const durationPrices = { '15 mins': 30, '30 mins': 40, '45 mins': 60, '60 mins': 75 };

  // Render error messages for fields
  const renderError = (fieldName) => errors[fieldName] ? <div className="gift-booking__form-error">{errors[fieldName]}</div> : null;

  // Move to the next step and save all selected details
  const handleNextStep = () => {
    const selections = Object.entries(quantity)
      .filter(([_, qty]) => qty > 0)
      .map(([duration, qty]) => ({
        duration,
        quantity: qty,
        pricePerItem: durationPrices[duration],
        totalPrice: qty * durationPrices[duration]
      }));

    setUserSelections(selections); // Store all selected items and details in the state
    setActiveStep(1);
  };

  const handleBackStep = () => {
    setActiveStep(activeStep - 1);
    setErrors({}); // Reset errors when moving back
  };

    // Calculate the total sum whenever the quantity changes
    useEffect(() => {
      const newTotal = Object.keys(quantity).reduce(
        (sum, key) => sum + (quantity[key] || 0) * (durationPrices[key] || 0),
        0
      );
      setTotalSum(newTotal);
    }, [quantity]);

    const steps = [
      { number: 1, label: 'Card' },
      { number: 2, label: 'Details' },
      { number: 3, label: 'Done' }
    ];

  console.log(userSelections)

    // Generate a sentence based on `userSelections` array
    const generateSentence = () => {
      if (userSelections.length === 0) return "No items selected.";
    
      // Create a formatted sentence for the items chosen
      const sentence = userSelections
        .map(
          (item) => (
            <span key={item.duration}>
              <br/>
              <strong>{item.quantity} gift{item.quantity > 1 ? 's' : ''}</strong>  for <strong>{item.duration}</strong>
            </span>
          )
        )
        .reduce((prev, curr) => [prev, ", ", curr]); // To add commas between items
    
      const total = userSelections.reduce((sum, item) => sum + item.totalPrice, 0);
      return (
        <>
          You have selected {sentence} <br/>for a total Price of <strong>£{total}</strong>.
        </>
      );
    };

    // Validate fields before submission
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = (phone) => /^\d+$/.test(phone);

    const validateForm = () => {
        const validationErrors = {};
        if (!firstName.trim()) validationErrors.firstName = "- first name is required";
        if (!lastName.trim()) validationErrors.lastName = "- last name is required";
        if (!phone.trim()) validationErrors.phone = "- phone number is required";
        else if (!isValidPhone(phone)) validationErrors.phone = "- phone number must have only digits";
        if (!email.trim()) validationErrors.email = "- email is required";
        else if (!isValidEmail(email)) validationErrors.email = "- invalid email format";
        if (!recipientFirstName.trim()) validationErrors.recipientFirstName = "- recipient's first name is required";
        if (!recipientLastName.trim()) validationErrors.recipientLastName = "- recipient's last name is required";
        // if (!recipientPhone.trim()) validationErrors.recipientPhone = "- recipient's phone number is required";
        // else if (!isValidPhone(recipientPhone)) validationErrors.recipientPhone = "- recipient's phone number must have only digits";
        // if (!recipientEmail.trim()) validationErrors.recipientEmail = "- recipient's email is required";
        // else if (!isValidEmail(recipientEmail)) validationErrors.recipientEmail = "- recipient's email is invalid";
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
      };

    const handleFormSubmit = async () => {
      if (validateForm()) {
        const bookingData = {
          duration: selectedDuration,
          firstName,
          lastName,
          phone,
          email,
          recipientFirstName,
          recipientLastName,
          recipientPhone,
          recipientEmail,
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

    // Handle form validation state
  useEffect(() => {
    setIsFormValid(
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      phone.trim() !== '' &&
      email.trim() !== '' &&
      recipientFirstName.trim() !== '' &&
      recipientLastName.trim() !== ''
      //  && recipientPhone.trim() !== '' &&
      // recipientEmail.trim() !== ''
    );
  }, [firstName, lastName, phone, email, recipientFirstName, recipientLastName
    // , recipientPhone, recipientEmail
  ]);

  // Handle form field changes to clear specific error messages
  useEffect(() => {
    if (firstName.trim()) setErrors((prevErrors) => ({ ...prevErrors, firstName: '' }));
    if (lastName.trim()) setErrors((prevErrors) => ({ ...prevErrors, lastName: '' }));
    if (phone.trim() && isValidPhone(phone)) setErrors((prevErrors) => ({ ...prevErrors, phone: '' }));
    if (email.trim() && isValidEmail(email)) setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
    if (recipientFirstName.trim()) setErrors((prevErrors) => ({ ...prevErrors, recipientFirstName: '' }));
    if (recipientLastName.trim()) setErrors((prevErrors) => ({ ...prevErrors, recipientLastName: '' }));
    // if (recipientPhone.trim() && isValidPhone(recipientPhone)) setErrors((prevErrors) => ({ ...prevErrors, recipientPhone: '' }));
    // if (recipientEmail.trim() && isValidEmail(recipientEmail)) setErrors((prevErrors) => ({ ...prevErrors, recipientEmail: '' }));
  }, [firstName, lastName, phone, email, recipientFirstName, recipientLastName, recipientPhone, recipientEmail]);

  useEffect(() => {
    const cleanup = transactionTimer(activeStep, setActiveStep, setRemainingTime)

    // Cleanup interval on component unmount or activeStep change
    return cleanup;
  }, [activeStep]);

  return (
    <section className='gift-booking' id="gift-booking">
      <h1 className='gift-booking__title'>GIFT BOOKING</h1>
      <BookingNavigation steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />

      {activeStep === 0 && (
        <>
        <div className='gift-booking__reservation'>
          {/* Left Column with Image */}
          <div className='gift-booking__image-container'>
            <img src="https://via.placeholder.com/400" alt="Gift Image" className='gift-booking__image' />
          </div>

          {/* Right Column with Session Durations and Quantity */}
          <div className='gift-booking__session-container'>
            <div className='gift-booking__durations-container'>
              {Object.entries(durationPrices).map(([label, price], index) => (
                <div key={index} className='gift-booking__duration-row'>
                  {/* Duration Field */}
                  <div
                    className={`gift-booking__duration-label ${selectedDuration === label ? 'gift-booking__duration-label_active' : ''}`}
                    onClick={() => setSelectedDuration(label)}
                  >
                    {label} - £{price}
                  </div>
                  {/* Quantity Selection for each Duration */}
                  <div className='gift-booking__quantity-container'>
                                        {/* <div className='gift-booking__quantity-buttons'> */}
                      <button
                        type='button'
                        className='gift-booking__quantity-button'
                        onClick={() => setQuantity((prev) => ({
                          ...prev,
                          [label]: Math.max((prev[label] || 0) - 1, 0)
                        }))}
                      >
                        -
                      </button>
                    <input
                      className='gift-booking__quantity-input'
                      type='number'
                      value={quantity[label] || 0}
                      readOnly
                    />
                      <button
                        type='button'
                        className='gift-booking__quantity-button'
                        onClick={() => setQuantity((prev) => ({
                          ...prev,
                          [label]: (prev[label] || 0) + 1
                        }))}
                      >
                        +
                    </button>
                    </div>
                  </div>
                // </div>
              ))}
            </div>

            {/* Display Total Sum */}
            <div className='gift-booking__total-sum'>
              <h3>Total Sum: £{totalSum}</h3>
            </div>
          </div>
        </div>

        {/* Next Button for Step 1 */}
        <div className='gift-booking__button-container'>
          <button
            type='button'
            className={`gift-booking__next-step-button ${totalSum > 0 ? 'gift-booking__next-step-button_active' : ''}`}
            onClick={handleNextStep}
            disabled={totalSum === 0} // Disable button if total sum is zero
          >
            Next
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
                {generateSentence()}
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

                {/* <div className='gift-booking__form-group'>
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
                </div> */}
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
              </>
      )}
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
  <h2>Gift Details</h2>
  {userSelections.length > 0 ? (
    <>
      <strong>Selected Gifts:</strong>
        {userSelections.map((item, index) => (
          <p key={index}>
            {item.quantity} gift{item.quantity > 1 ? 's' : ''} for {item.duration} - £{item.pricePerItem} each (Total: £{item.totalPrice})
          </p>
        ))}
    </>
  ) : (
    <p>No gifts selected.</p>
  )}
        <h2>Sender's Information</h2>
        <strong>First Name:</strong> {firstName} <br />
        <strong>Last Name:</strong> {lastName} <br />
        <strong>Phone:</strong> {phone} <br />
        <strong>Email:</strong> {email} <br />

        <h2>Recipient's Information</h2>
        <strong>Recipient's First Name:</strong> {recipientFirstName} <br />
        <strong>Recipient's Last Name:</strong> {recipientLastName} <br />
        <strong>Total Price:</strong> <strong>£{totalSum}</strong>
      </p>
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

export default GiftBooking;
