// src/components/WelcomePopup.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../index.css"; // importa il file CSS globale
import "../style/Popup.css"; // importa il file CSS per il popup

export default function WelcomePopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenWelcomePopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
      localStorage.setItem("hasSeenWelcomePopup", "true");
    }
  }, []);

  const handleRedPill = () => {
    setShowDiscount(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 5000);
  };

  const handleBluePill = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <>
      <div className="popup-overlay">
        <div className="popup ">
          <h4>Benvenuto Nel Mondo Reale!</h4>
          {showDiscount && (
            <p className="discount-reveal">
              codice sconto: WELCOME10
            </p>
          )}
          <p > blu, resti nell'illusione; rossa, scopri la verità</p>
          {/* <img src="/BinaRabbit.png" alt="rabbit" className="rabbit-image" /> */}
          <button className="blue-pill gift-icon" onClick={handleBluePill}>BLU</button>
          <button className="red-pill gift-icon" onClick={handleRedPill}>ROSSA</button>
        </div>
      </div>
    </>
  );
}
