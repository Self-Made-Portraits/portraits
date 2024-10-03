import React from 'react';
import './AboutSession.css'; 
import dress from '../../images/about/dress.png'
import smile from '../../images/about/smile.png'
import click from '../../images/about/click.png'
import repeat from '../../images/about/repeat.png'

const AboutSession = () => {

  const options = [
    {title:'Get Ready', src: dress, 
    description: 'For your convenience, we have a dressing room and makeup area inside the studio.', alt: 'ready'},
    {title:'Say cheese', src: smile,
    description: 'Capture professional photos of yourself and your loved ones by simply looking at your reflection and using a small clicker, where you can be both the photographer and the model.', alt: 'cheese'},
    {title:'Click', src: click, 
    description: 'Our studio offers a minimalist space with a professional studio lighting , magic mirror and a variety of backgrounds, allowing you to have complete creative control over your shoot with a small clicker' ,alt: 'click'},
    {title:'Repeat', src: repeat,
      description: `You can take as many pictures as you'd like`, alt: 'repeat'},
]

    return (
      <section className='session' id="about">
          <h1 className='session__title'>HOW IT WORKS?</h1>
          <h2 className='session__subtitle'>{`Are you comfortable in front of a photographer?\n- Well, we’re not!`}</h2>
            <div className='session__container'>
            {options.map((option) => (
              <div key={option.title} 
              className='session__card'>
                <h3 className='session__card-title'>{option.title}</h3>
                <img className='session__card-image' src={option.src} alt={option.alt} />
                <p className='session__card-description'>{option.description}</p>
              </div>
          ))}
        </div>
      </section>
    );
  };
  

export default AboutSession;