import React, { useState } from 'react';
import './FAQ.css'; // Import the CSS file for styling

const FAQ = () => {
  // State to track which question is currently open
  const [openQuestion, setOpenQuestion] = useState(null);

  // List of FAQ items
  const faqItems = [
    {
      question: "What is your refund policy?",
      answer: "Our refund policy allows for a full refund within 30 days of purchase."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes, we offer 24/7 customer support. You can reach us through email, phone, or chat."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping typically takes 3-5 business days for domestic orders and 7-14 business days for international orders."
    }
  ];

  // Toggle function to open/close a question
  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <section className="faq" id="faq">
      <h1 className="faq__title">FREQUENTLY ASKED QUESTIONS</h1>
      <div className="faq__container">
        {faqItems.map((item, index) => (
          <div key={index} className="faq__item">
            <div className="faq__question" onClick={() => toggleQuestion(index)}>
              <h2>{item.question}</h2>
              <span className={`faq__icon ${openQuestion === index ? 'faq__icon_open' : ''}`}>
                {openQuestion === index ? '-' : '+'}
              </span>
            </div>
            <div className={`faq__answer ${openQuestion === index ? 'faq__answer_visible' : ''}`}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
