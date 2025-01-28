import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/hero/Hero";
import Scenarios from "./components/scenario/Scenarios";
import About from "./components/about/About";
import TeamBuilding from "./components/teambuilding/TeamBuilding";
import Reservation from "./components/Reservation/Reservation";
import ContactUs from "./components/ContactUs/ContactUs";
import Footer from "./components/Footer/Footer";
import ScenarioDetails from "./components/ScenarioDetails/ScenarioDetails";
import ReservationDetails from "./components/ReservationDetails/ReservationDetails";
import SplashScreen from "./components/Splash/SplashScreen";
import Price from "./components/PackPricing/Price";
import "./App.css";

/** Handle auto-scrolling to #hash anchors on route change. */
const ScrollToHash = () => {
  const location = useLocation();
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [location]);
  return null;
};

/** Our main App component */
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  // Show Hero on mobile (true), hide on desktop (false)
  const [showHero, setShowHero] = useState(isMobile);

  // Splash screen finish
  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Lock/unlock scroll based on `showHero` for mobile
  useEffect(() => {
    if (isMobile && showHero) {
      document.body.style.overflow = "hidden"; // lock scroll
    } else {
      document.body.style.overflow = "auto";   // unlock scroll
    }
  }, [isMobile, showHero]);

  // Listen to screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    window.addEventListener("resize", handleResize);

    // Fallback: hide splash after 5s if still showing
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  // Called when user clicks arrow or "Alors cliquez ici" in Hero
  const handleHeroNavigation = () => {
    setShowHero(false);
    // Optionally, scroll to Scenarios
    const section = document.getElementById("scenarios-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Called when a link in the sidebar is clicked
  const handleSidebarLinkClick = () => {
    // Hide the Hero if it's displayed on mobile
    setShowHero(false);
  };

  /******************************************************
   *  Define what "Home" looks like (the "/" route)
   ******************************************************/
  const Home = () => {
    // If mobile AND still want to show the hero
    if (isMobile && showHero) {
      return <Hero onArrowClick={handleHeroNavigation} />;
    }

    // Otherwise, show the main sections
    return (
      <>
        {/* Desktop: or Mobile after hero is hidden */}
        <div id="accueil"> 
          {/* On desktop we can still show the hero if you want. 
              If you always want hero on desktop, un-comment: */}
          {!isMobile && <Hero onArrowClick={handleHeroNavigation} />}
        </div>

        <div id="scenarios-section">
          <Scenarios />
        </div>
        <div id="teambuilding">
          <TeamBuilding />
        </div>
        <div id="pack-pricing">
          <Price />
        </div>
        <div id="reservation">
          <Reservation />
        </div>
        <div id="apropos">
          <About />
        </div>
        <div id="contact">
          <ContactUs />
        </div>
        <Footer />
      </>
    );
  };

  return (
    <Router>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <>
          {/* Always show Navbar. We'll hide "Accueil" link inside the Navbar if not on "/" */}
          <Navbar onSidebarLinkClick={handleSidebarLinkClick} />

          <ScrollToHash />

          <Routes>
            {/** HOME ROUTE */}
            <Route path="/" element={<Home />} />

            {/** OTHER ROUTES: No Hero. Just your other components. */}
            <Route path="/scenarios/:id" element={<ScenarioDetails />} />
            <Route path="/reservation-details/:id" element={<ReservationDetails />} />

            {/* If you have other custom pages, define them here */}
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
