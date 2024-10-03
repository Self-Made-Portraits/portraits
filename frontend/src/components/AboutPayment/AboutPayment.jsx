import React from 'react';
import './AboutPayment.css'; 

const AboutPayment = () => {

  const items = [
    {number: '1', title:`Online\nBooking`,
    description: 'For your convenience, we have a dressing room and makeup area inside the studio'},
    {number: '2', title: `Pay per\nsession`,
    description: 'Capture professional photos of yourself and your loved ones by simply looking at your reflection and using a small clicker, where you can be both the photographer and the model'},
    {number: '3', title:`Same day \nresults`,
    description: 'Our studio offers a minimalist space with a professional studio lighting , magic mirror and a variety of backgrounds, allowing you to have complete creative control over your shoot with a small clicker'},
    {number: '4', title:`Get all\nphotos`,
      description: `You can take as many pictures as you'd like`},
]

    return (
      <section className='payment' id="about">
            <div className='payment__container'>
            {items.map((item) => (
              <div key={item.title} 
              className='payment__card'>
                <div className='payment__block'>
                <h3 className='payment__block-number'>{item.number}</h3>
                <h3 className='payment__block-title'>{item.title}</h3>
                </div>
                <p className='payment__description'>{item.description}</p>
              </div>
          ))}
        </div>
      </section>
    );
  };
  

export default AboutPayment;