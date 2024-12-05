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
import "./App.css";
import SplashScreen from "./components/Splash/SplashScreen";

// Smooth scrolling logic
const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  return null;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Hide splash screen after video ends
  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <Router>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <>
          <Navbar />
          <ScrollToHash />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div id="accueil">
                    <Hero />
                  </div>
                  <div id="scenarios-section">
                    <Scenarios />
                  </div>
                  <div id="apropos">
                    <About />
                  </div>
                  <div id="teambuilding">
                    <TeamBuilding />
                  </div>
                  <div id="reservation">
                    <Reservation />
                  </div>
                  <div id="contact">
                    <ContactUs />
                  </div>
                  <Footer />
                </>
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