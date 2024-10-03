import React from 'react';
import './Button.css';

const Button = ({ book, value }) => {
    return (
          <button
            className={`button ${book ? 'button__book-time' : 'button__book-gift'}`}>
            {value}
          </button>
    )
}
  

export default Button;