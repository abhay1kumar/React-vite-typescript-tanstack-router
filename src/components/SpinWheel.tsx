import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";

const segments = [
  { fillStyle: "#eae56f", text: "aaaa", prize: 11111, percentage: 0.01 },
  { fillStyle: "#89f26e", text: "bbbb", prize: 0, percentage: 0.002 },
  { fillStyle: "#7de6ef", text: "ccccc", prize: 999, percentage: 0.1 },
  { fillStyle: "#e7706f", text: "ddddd", prize: 666, percentage: 0.3 },
  { fillStyle: "#eae56f", text: "eeee", prize: 0, percentage: 70 },
  { fillStyle: "#89f26e", text: "fffff", prize: 1888, percentage: 0.09 },
  { fillStyle: "#7de6ef", text: "ggggg", prize: 11, percentage: 9.5 },
  { fillStyle: "#e7706f", text: "hhhhh", prize: 0, percentage: 30 },
];

// Helper function to calculate cumulative probabilities
const getWeightedPrizeIndex = () => {
  const cumulativeWeights = [];
  let cumulativeSum = 0;

  segments.forEach((segment) => {
    cumulativeSum += segment.percentage;
    cumulativeWeights.push(cumulativeSum);
  });

  const random = Math.random() * 100; // Generate random number between 0 and 100
  for (let i = 0; i < cumulativeWeights.length; i++) {
    if (random <= cumulativeWeights[i]) {
      return i;
    }
  }
  return segments.length - 1; // Default to the last segment in case of rounding errors
};

export default function SpinWheel() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    const newPrizeIndex = getWeightedPrizeIndex(); // Get prize index based on weighted probabilities
    setPrizeNumber(newPrizeIndex);
    setMustSpin(true);
  };

  return (
    <>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={segments.map((segment) => ({
          option: segment.text,
          style: { backgroundColor: segment.fillStyle },
        }))}
        outerBorderColor={["#f2f2f2"]}
        outerBorderWidth={[10]}
        innerBorderColor={["#f2f2f2"]}
        radiusLineColor={["#dedede"]}
        radiusLineWidth={[1]}
        fontSize={15}
        textColors={["#ffffff"]}
        backgroundColors={segments.map((segment) => segment.fillStyle)}
        onStopSpinning={() => {
          setMustSpin(false);
          console.log("Prize Won:", segments[prizeNumber]);
        }}
      />
      <button onClick={handleSpinClick}>SPIN</button>
      {!mustSpin ? (
        <p>Congratulations! You won: {segments[prizeNumber].text}</p>
      ) : (
        "Spinning..."
      )}
    </>
  );
}
