import React, { useState, useEffect } from 'react';
import './PhotosCarusel.css'; 

const PhotosCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle left arrow click
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    setCurrentIndex(isFirstSlide ? images.length - 1 : currentIndex - 1);
  };

  // Handle right arrow click
  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    setCurrentIndex(isLastSlide ? 0 : currentIndex + 1);
  };

  // Handle dot click
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Automatically move the slide every 5 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 10000); // Change slide every 5000ms (5 seconds)

    return () => clearInterval(slideInterval); // Cleanup interval on component unmount
  }, [currentIndex]); // Only re-run when the currentIndex changes

  return (
    <div className="carousel">
      <div className="carousel__slider">
        <div className="carousel__arrows carousel__arrow_left" onClick={prevSlide}>
        </div>
        <img src={images[currentIndex]} alt={`slide-${currentIndex}`} className="carousel__image" />
        <div className="carousel__arrows carousel__arrow_right" onClick={nextSlide}>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="carousel__dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`carousel__dot ${currentIndex === index ? 'carousel__dot_active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default PhotosCarousel;
