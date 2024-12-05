import React, { useEffect, useState } from "react";
import "./SplashScreen.css";

const SplashScreen = ({ onFinish }) => {
  return (
    <div className="splash-container">
      <video
        className="splash-video"
        src={require("../../assets/waiting_1.mp4")}
        autoPlay
        muted
        onEnded={onFinish}
      />
    </div>
  );
};

export default SplashScreen;
