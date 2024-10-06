import React, { useEffect, useState } from "react";
import './Main.css';
import AboutSession from "../AboutSession/AboutSession";
import AboutPayment from "../AboutPayment/AboutPayment";
import FAQ from "../FAQ/FAQ";
import Photo from "../Photo/Photo";
import GiftCards from "../GiftCards/GiftCards";
import ContactUs from "../ContactUs/ContactUs";
import Intro from "../Intro/Intro";
import Navigation from "../Navigation/Navigation"; // Import your Navigation component

export default function Main({ setActiveSection }) {

  // Array of section IDs to observe
  const sectionIds = ["intro", "about", "photos", "gifts", "faq", "contact"];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2, // Trigger when 40% of the section is visible
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Attach observer to each section
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });

    // Cleanup observer on component unmount
    return () => {
      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, [setActiveSection]);

  return (
    <>
      <main className='main'>
          <Intro />
          <AboutSession />
          <AboutPayment />
          <Photo />
          <GiftCards />
          <FAQ />
          <ContactUs />
      </main>
    </>
  );
}
