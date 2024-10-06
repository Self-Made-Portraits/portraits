import React, { useState, useEffect } from 'react';
import './GiftBooking.css'; 
import BookingNavigation from '../BookingNavigation/BookingNavigation';

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
              <strong>{item.quantity}gift</strong> {item.quantity > 1 ? 's' : ''} for <strong>{item.duration}</strong>
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
                    <input
                      className='gift-booking__quantity-input'
                      type='number'
                      value={quantity[label] || 0}
                      readOnly
                    />
                    <div className='gift-booking__quantity-buttons'>
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
                    </div>
                  </div>
                </div>
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
