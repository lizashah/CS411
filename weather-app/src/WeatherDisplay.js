import React from 'react';
import './WeatherDisplay.css'; // Assuming you create a separate CSS file for styling

const WeatherDisplay = () => {
  return (
    <div className="weather-display">
      <h2>Current Weather</h2>
      <p>Temperature: 25°C</p>
      <p>Humidity: 60%</p>
      <p>Condition: Sunny</p>
    </div>
  );
};

export default WeatherDisplay;
