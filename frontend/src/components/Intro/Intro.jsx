import React from 'react';
import './Intro.css'; 
import Button from '../common/Button/Button'

const Intro = () => {
    return (
        <section className='intro'>
            <div className='intro__container'>
            <div className='intro__text'>
            <h1 className='intro__title'>{`No one else.\nJust you`}</h1>
            <p className='intro__subtitle'>65£ for 40 min</p>
            <p className='intro__subtitle'>35£ for 15 min</p>
            </div>
            <div className='intro__buttons'>
            <Button book={true} type={"time"} value={"BOOK"}/>
            <Button book={false} type={"gift"} value={"BUY AS A GIFT"}/>
            </div>
            </div>
        </section>
    );
  };
  

export default Intro;