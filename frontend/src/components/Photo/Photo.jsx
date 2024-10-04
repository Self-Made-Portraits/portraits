import React, { useState, useEffect } from 'react';
import './Photo.css';
import Button from '../common/Button/Button';
import smile from '../../images/about/smile.png';
import click from '../../images/about/click.png';
import repeat from '../../images/about/repeat.png';
import PhotosCarousel from '../PhotosCarusel/PhotosCarusel';
import Privacy from '../Privacy/Privacy';

const Photo = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 767);

  // Monitor screen size changes and update state
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 767);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = [
    {
      images: [smile, click, repeat], // Array of images for the PhotosCarousel
      alt: "explore",
      subtitle: "EXPLORE YOURSELF",
      text: "Taking your own photos in a self-portrait studio allows for a unique experience of self-discovery through photography. With complete privacy, you have the space to truly explore and express yourself. It's just you and your reflection.",
      position: "left",
    },
    {
      images: [click, repeat, smile], // Array of images for the PhotosCarousel
      alt: "explore",
      subtitle: "CREATE A PHOTOSHOOT WITH LOVED ONES",
      text: "Taking photos with a partner, friends, co-workers or family members, such a fun experience, even with those who are typically shy or hesitant to take part. Self-portrait studio allows you to create photoshoot that truly represent your unique relationships and personalities.",
      position: "right",
    },
    {
      images: [repeat, smile, click], // Array of images for the PhotosCarousel
      alt: "explore",
      subtitle: "CAPTURE YOUR SPECIAL MOMENTS",
      text: "We offer a perfect space where you can capturing the beauty of pregnancy, birthday, graduation or any other private shoots, which can be sensitive and personal. It allows to express yourself and your unique beauty.",
      position: "left",
    },
  ];

  return (
    <section className='photos' id="photos">
      {items.map((item, index) => (
        <div
          key={index}
          className={`photos__container ${
            isMobileView ? 'photos__container_center' : `photos__container_${item.position}`
          }`}
        >
          {isMobileView ? (
            <>
              {/* Render image carousel first in mobile view */}
              <div className='photos__shoots'>
                <PhotosCarousel images={item.images} />
              </div>
              {/* Render description below the image in mobile view */}
              <div className='photos__description'>
                <h2 className='photos__subtitle'>{item.subtitle}</h2>
                <p className='photos__text'>{item.text}</p>
                <Button book={true} type={"time"} value={"BOOK NOW"} />
              </div>
            </>
          ) : item.position === 'left' ? (
            <>
              <div className='photos__shoots'>
                <PhotosCarousel images={item.images} />
              </div>
              <div className='photos__description'>
                <h2 className='photos__subtitle'>{item.subtitle}</h2>
                <p className='photos__text'>{item.text}</p>
                <Button book={true} type={"time"} value={"BOOK NOW"} />
              </div>
            </>
          ) : (
            <>
              <div className='photos__description'>
                <h2 className='photos__subtitle'>{item.subtitle}</h2>
                <p className='photos__text'>{item.text}</p>
                <Button book={true} type={"time"} value={"BOOK NOW"} />
              </div>
              <div className='photos__shoots'>
                <PhotosCarousel images={item.images} />
              </div>
            </>
          )}
        </div>
      ))}
      <Privacy />
    </section>
  );
};

export default Photo;
