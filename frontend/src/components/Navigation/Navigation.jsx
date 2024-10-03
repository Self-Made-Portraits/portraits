import {React, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../common/Button/Button"
import "./Navigation.css";

function Navigation({ activeSection, isShowMenu, setIsShowMenu }) {
    const location = useLocation();
    const [active, setActive] = useState("");
    //   console.log(activeSection)
    // useEffect(() => {
    //     if (location.pathname.includes("/copper") || location.pathname.includes("/nickel") || location.pathname.includes("/cobalt")) {
    //         setActive("2");
    //         setActiveSubMenu(true);
    //     } else if (location.pathname === "/articles") {
    //         setActive("3");
    //     } else if (location.pathname === "/wesafe-the-world") {
    //         setActive("4");
    //     } else if (location.pathname === "/about-us") {
    //         setActive("5");
    //     } else if (location.pathname === "/contact-us") {
    //         setActive("6");
    //     } else {
    //         setActive("");
    //         setActiveSubMenu(false);
    //     }
    // }, [location]);


    const handleCloseBurgerMenu = () => {
        if (isShowMenu) {
            setIsShowMenu(false);
        }
    };


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
        handleCloseBurgerMenu(); // Close menu after scrolling
      };
      
    // Handle menu button click
const handleNavigationClick = (e, sectionId) => {
        setActive(e.target.id);
        scrollToSection(sectionId);
      };

    return (
        <>
            <button 
                id={"1"} 
                className={`navigation__link navigation__link_main ${activeSection === "about" ? "navigation__link_active" : null}`} 
                onClick={(e) => handleNavigationClick(e, "about")}
            >
                {`How it works?`}
            </button>
            <button 
                id={"2"} 
                className={`navigation__link navigation__link_main ${activeSection === "photos" ? "navigation__link_active" : null}`} 
                onClick={(e) => handleNavigationClick(e, "photos")}
            >
                {`Photo`}
            </button>

            <button
                id={"3"} 
                className={`navigation__link navigation__link_main ${activeSection === "gifts" ? "navigation__link_active" : null}`} 
                onClick={(e) => handleNavigationClick(e, "gifts")}
            >
                {`Gift Cards`}
            </button>

            <button 
                id={"4"} 
                className={`navigation__link navigation__link_main ${activeSection === "faq" ? "navigation__link_active" : null}`} 
                onClick={(e) => handleNavigationClick(e, "faq")}
            >
                {`FAQ`}
            </button>
            <button 
                id={"5"} 
                className={`navigation__link navigation__link_main ${activeSection === "contact" ? "navigation__link_active" : null}`} 
                onClick={(e) => handleNavigationClick(e, "contact")}
            >
                {`Contact Us`}
            </button>
            <Button book={true} value={"BOOK NOW"} />
        </>
    );
}

export default Navigation;
