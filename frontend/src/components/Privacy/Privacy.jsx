import React from 'react';
import './Privacy.css'; 
import door from '../../images/privacy/door.png'
import comfort from '../../images/privacy/comfort.png'
import safety from '../../images/privacy/private.jpg'
import assurance from '../../images/privacy/assurance.png'

const Privacy = () => {

  const options = [
    {title:'Closed door', src: door, 
    description: 'You will have the room to yourself behind a closed door. The door will remain closed until the end of your session.', alt: 'ready'},
    {title:'Comfort', src: comfort,
    description: 'Music or silence, lights on, off, or dimmed, curtains open or closed. You can set everything up the way that works best for you.', alt: 'cheese'},
    {title:'Safety', src: safety, 
    description: 'No one will see your pictures until and if you give permission.' ,alt: 'click'},
    {title:'Assurance', src: assurance,
      description: `Your photos will be deleted 1 week after your session or even sooner if you wish.`, alt: 'repeat'},
]

    return (
      <section className='privacy' id="about">
          <h1 className='privacy__title'>WE RESPSECT YOUR PRIVACY</h1>
          <h2 className='privacy__subtitle'>We believe that comfort is the most important aspect of a photoshoot</h2>
            <div className='privacy__container'>
            {options.map((option) => (
              <div key={option.title} 
              className='privacy__card'>
                <h3 className='privacy__card-title'>{option.title}</h3>
                <img className='privacy__card-image' src={option.src} alt={option.alt} />
                <p className='privacy__card-description'>{option.description}</p>
              </div>
          ))}
        </div>
      </section>
    );
  };
  

export default Privacy;