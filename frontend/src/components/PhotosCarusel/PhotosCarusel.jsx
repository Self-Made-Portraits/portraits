import React, { useState, useEffect } from 'react';
import './PhotosCarusel.css'; 

const PhotosCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchPosition, setTouchPosition] = useState(null); // Store touch start position
  const [isTransitioning, setIsTransitioning] = useState(false); // Track transition state

  // Handle left arrow click
  const prevSlide = () => {
    if (isTransitioning) return; // Prevent changes during transition
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Handle right arrow click
  const nextSlide = () => {
    if (isTransitioning) return; // Prevent changes during transition
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Handle dot click
  const goToSlide = (slideIndex) => {
    if (isTransitioning) return; // Prevent changes during transition
    setIsTransitioning(true);
    setCurrentIndex(slideIndex);
  };

  // Automatically move the slide every 10 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(slideInterval); // Cleanup interval on component unmount
  }, [currentIndex]);

  // Handle touch start event
  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX; // Get the touch start position (x-coordinate)
    setTouchPosition(touchDown); // Store the touch position in state
  };

  // Handle touch move event
  const handleTouchMove = (e) => {
    if (touchPosition === null || isTransitioning) {
      return;
    }

    const currentTouch = e.touches[0].clientX; // Get the current touch position (x-coordinate)
    const diff = touchPosition - currentTouch; // Calculate the difference

    if (Math.abs(diff) > 50) { // Minimum swipe distance to trigger a change
      if (diff > 0) {
        nextSlide(); // Swipe left to move to the next slide
      } else {
        prevSlide(); // Swipe right to move to the previous slide
      }
      setTouchPosition(null); // Reset the touch position
    }
  };

  // Remove transition lock after the transition ends
  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 500); // Transition duration in ms
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div
      className="carousel"
      onTouchStart={handleTouchStart} // Listen to touch start event
      onTouchMove={handleTouchMove}   // Listen to touch move event
    >
      <div className="carousel__slider">
        <div className="carousel__arrows carousel__arrow_left" onClick={prevSlide}></div>
        <img
          src={images[currentIndex]}
          alt={`slide-${currentIndex}`}
          className={`carousel__image ${isTransitioning ? 'carousel__image_transition' : ''}`} // Add transition class during slide change
        />
        <div className="carousel__arrows carousel__arrow_right" onClick={nextSlide}></div>
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
