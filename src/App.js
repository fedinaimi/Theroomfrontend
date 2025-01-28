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

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [showHero, setShowHero] = useState(isMobile); // Always show Hero on mobile reload

  // Handle splash screen
  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Lock/unlock scrolling
  useEffect(() => {
    if (isMobile && showHero) {
      // Lock scrolling when Hero is displayed on mobile
      document.body.style.overflow = "hidden";
    } else {
      // Unlock scrolling
      document.body.style.overflow = "auto";
    }
  }, [isMobile, showHero]);

  // Handle resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener("resize", handleResize);

    // Fallback to hide splash if video fails or is too long
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  const handleHeroNavigation = () => {
    // Hide Hero
    setShowHero(false);

    // Smooth scroll to Scenarios
    const section = document.getElementById("scenarios-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Router>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <>
          <Navbar 
            // Pass a callback so Navbar can also hide the Hero when user opens the sidebar
            onOpenSidebar={() => setShowHero(false)}
          />
          <ScrollToHash />
          <Routes>
            <Route
              path="/"
              element={
                isMobile ? (
                  showHero ? (
                    <Hero onArrowClick={handleHeroNavigation} />
                  ) : (
                    <>
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
                  )
                ) : (
                  <>
                    <div id="accueil">
                      <Hero onArrowClick={handleHeroNavigation} />
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
                )
              }
            />
            <Route path="/scenarios/:id" element={<ScenarioDetails />} />
            <Route path="/reservation-details/:id" element={<ReservationDetails />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
