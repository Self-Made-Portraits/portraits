import {React, useState, useEffect} from "react";
import {Link} from "react-router-dom";
import './Footer.css';
import linkedin from '../../images/network/linkedin.png'
import twitter from '../../images/network/twitter.png'

export default function Footer() {
    const [active, setActive] = useState("");
          // Scroll to a specific section by its ID
          const scrollToSection = (sectionId) => {
            const section = document.getElementById(sectionId);
            if (section) {
              const headerOffset = 65; // Height of your fixed header
              const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
              const offsetPosition = elementPosition - headerOffset;
          
              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
              });
            }
          };

        // Handle menu button click
        const handleNavigationClick = (e, sectionId) => {
            setActive(e.target.id);
            scrollToSection(sectionId);
        };
                
    return(
        <>
        <footer className='footer'>
        <div className='footer__info'>
            <button className='footer__link'
            onClick={(e) => handleNavigationClick(e, "about")}>How it works?</button>
            <button className='footer__link'
            onClick={(e) => handleNavigationClick(e, "photos")}>Photo</button>
            <button className='footer__link'
            onClick={(e) => handleNavigationClick(e, "gifts")}>Gift Cards</button>
            <button className='footer__link'
            onClick={(e) => handleNavigationClick(e, "faq")}>FAQ</button>
            <button className='footer__link'
            onClick={(e) => handleNavigationClick(e, "contact")}>Contact Us</button>   
        </div>
        <div className='footer__reg'>
            <div  className='footer__reg-container' >
            <Link target="_blank">
                <img className="footer__reg-logo footer__reg-logo_x" src={twitter} alt="x" />
            </Link>
            <Link className="footer__reg-link" to="./legal-notice">{'Studio Rules & Rental Agreement'}</Link>
            <Link className="footer__reg-link" to="./cancellation-refund-policy">{`Cancellation & Refund Policy`}</Link>
            <Link className="footer__reg-link" to="./terms-of-use">{`Terms of Use`}</Link>
            <Link className="footer__reg-link" to="./priavte-policy">{`Privacy Policy`}</Link>
            <Link className="footer__reg-link" to="./pet-policy">{`Pet Policy`}</Link>
            <p className="footer__reg-copyright">© Self Made Portraits 2024</p>
            </div>
            <div>
            </div>
        </div>
        </footer>
        </>
    )
}