import React, { useEffect, useRef, useState } from "react";
import { CircularProgressbar,buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface TimeLeft {
  Hours: number;
  Minutes: number;
  Seconds: number;
  yearProgress: number;
}

const calculateTimeLeftInYear = (): TimeLeft => {
  const now = new Date();
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // End of the year
  const diffInMillis = endOfYear.getTime() - now.getTime();
  const daysLeft = Math.floor(diffInMillis / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((diffInMillis / (1000 * 60 * 60)) % 24) + daysLeft*24;
  const minutesLeft = Math.floor((diffInMillis / 1000 / 60) % 60);
  const secondsLeft = Math.floor((diffInMillis/ 1000) % 60);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const yearProgress = ((now.getTime() - startOfYear.getTime()) / (endOfYear.getTime() - startOfYear.getTime())) * 100;
  return { Hours: hoursLeft, Minutes: minutesLeft, Seconds: secondsLeft, yearProgress: yearProgress };
};

const CountdownTracker: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  const trackerRef = useRef<HTMLDivElement>(null);
  const currentValueRef = useRef<string>((value.toString())); // Store the current value
  useEffect(() => {
    const el = trackerRef.current;
    if (!el) return;
  
    const top = el.querySelector<HTMLDivElement>(".card__top");
    const bottom = el.querySelector<HTMLDivElement>(".card__bottom");
    const back = el.querySelector<HTMLDivElement>(".card__back");
    const backBottom = el.querySelector<HTMLDivElement>(".card__back .card__bottom");
  
    if (!top || !bottom || !back || !backBottom) return;
  
    // const formattedValue = ("0" + value).slice(-2); // Format value as 2 digits
    const formattedValue = value.toString()
  
    // Update DOM with the initial value
    if (currentValueRef.current === formattedValue) {
      top.innerText = formattedValue;
      bottom.setAttribute("data-value", formattedValue);
      back.setAttribute("data-value", formattedValue);
      backBottom.setAttribute("data-value", formattedValue);
    }
  
    // Check if the value has changed for future updates
    if (formattedValue !== currentValueRef.current) {
      back.setAttribute("data-value", currentValueRef.current); // Old value
      bottom.setAttribute("data-value", currentValueRef.current);
  
      currentValueRef.current = formattedValue; // Update current value reference
  
      top.innerText = formattedValue;
      backBottom.setAttribute("data-value", formattedValue);
  
      // Trigger flip animation
      el.classList.remove("flip");
      void el.offsetWidth; // Force reflow
      el.classList.add("flip");
    }
  }, [value]);
  

  return (
    <div ref={trackerRef} className="flip-clock__piece">
      <b className="flip-clock__card card">
        <b className="card__top"></b>
        <b className="card__bottom"></b>
        <b className="card__back">
          <b className="card__bottom"></b>
        </b>
      </b>
      <span className="flip-clock__slot">{label}</span>
    </div>
  );
};

const TimeLeftFlipClock: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeftInYear());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeftInYear());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flip-clock-progress">
      <div className="flip-clock">
        <CountdownTracker label="Hours" value={timeLeft.Hours} />
        <CountdownTracker label="Minutes" value={timeLeft.Minutes} />
        <CountdownTracker label="Seconds" value={timeLeft.Seconds} />
      </div>
      <div className="progress-container">
        <CircularProgressbar
          value={timeLeft.yearProgress}
          text={`${timeLeft.yearProgress.toFixed(1)}%`}
          styles={buildStyles({
            textColor: "#000",
            pathColor: "#4CAF50",
            trailColor: "#333",
            textSize: "16px",
            strokeLinecap: "round",
          })}
        />
      </div>
    </div>
  );
};

export default TimeLeftFlipClock;
