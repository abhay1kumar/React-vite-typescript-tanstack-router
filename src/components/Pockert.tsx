import { useState, useEffect } from "react";

import "./welcom.css";

const WelcomeBonus = () => {
  const numbers = [
    11, 99, 199, 333, 28, 10, 188, 199, 55, 77, 88, 123, 456, 789, 101, 202,
  ];
  const frameIndices = [0, 1, 2, 3, 4, 6, 8, 10, 15, 14, 13, 12, 11, 9, 7, 5];
  const [currentStep, setCurrentStep] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const gameSpeed = 350;
  const minValue = Math.min(...numbers);
  const prizeProbabilities = [
    10, 15, 20, 10, 5, 10, 5, 5, 5, 5, 3, 2, 1, 1, 1, 2,
  ];
  const cardPrizeLimit = [11, 5, 4, 2, 30, 3, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5];
  const minIndex = numbers.indexOf(minValue);
  const getWinningCard = () => {
    const random = Math.random() * 100;
    console.log("random", random);
    let cumulativeProbability = 0;
    for (let i = 0; i < prizeProbabilities.length; i++) {
      cumulativeProbability += prizeProbabilities[i];
      if (random <= cumulativeProbability && cardPrizeLimit[i] > 0) {
        return i; // Return the index of the winning card
      }
      if (prizeProbabilities.length - 1 == i) {
        return minIndex;
      }
    }
    return prizeProbabilities.length - 1; // Fallback to the last card
  };
  useEffect(() => {
    const intervalId = null;
    if (gameRunning) {
      const winningCard = getWinningCard();
      let step = 0;
      const intervalId = window.setInterval(() => {
        step++;
        setCurrentStep(frameIndices[step % frameIndices.length]);
        if (step === frameIndices.length + winningCard) {
          clearInterval(intervalId);
          setGameRunning(false);
        }
      }, gameSpeed);
      console.log("Interval ID:_winningCard", winningCard);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameRunning]);

  console.log("Interval ID+___currentStep:", currentStep);

  const startGame = () => {
    if (!gameRunning) {
      setCurrentStep(0); // Start from the first frame
      setGameRunning(true);
    }
  };

  return (
    <div
      style={{
        background: "blue",
      }}
      className="background-welcome bg-blue"
    >
      <div className="welcome-image">
        {/* <img src={welcomebonus} alt="Background" /> */}
        <div className="box-container">
          <div className="number-card">
            {numbers.map((number, index) => (
              <div
                className={`image-card ${currentStep === index ? "active " : ""}`}
                key={index}
              >
                {/* <img
                  src={bluebox}
                  alt={Card ${index + 1}}
                  className="bluebox-img"
                /> */}
                {currentStep === index && (
                  <img
                    src={"bigRedActive"}
                    alt="Active"
                    className="active-img"
                    // style={{ width: "92px", marginBottom: "4px", height: "90px" }}
                  />
                )}
                <div className="overlay">{number}</div>
              </div>
            ))}
            <button className="big-number">1188</button>
          </div>
          <button
            className="start-button"
            onClick={startGame}
            disabled={gameRunning}
          >
            {/* <img src={redStart} alt="Start" /> */}
            <span className="start-text">START</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBonus;
