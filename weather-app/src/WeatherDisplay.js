import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherDisplay.css';

const WeatherDisplay = ({ updateHealthRecommendations }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [fetchData, setFetchData] = useState(false); // State to track if fetch data button is clicked
  const API_KEY = '04ae16b1094cee2dac21deb82bf0f81b'; // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key

  useEffect(() => {
    const fetchWeatherDataByLocation = async () => {
      if (fetchData && location) {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);
          setWeatherData(response.data);
          updateHealthRecommendations(response.data); // Call to update the health recommendations in the App component
          setFetchData(false); // Reset fetchData state after fetching data
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };

    fetchWeatherDataByLocation();
  }, [fetchData, location, API_KEY]); // Run the effect whenever fetchData, location, or API_KEY changes

  const handleGetData = () => {
    setFetchData(true); // Trigger the useEffect to fetch weather data
  };

  return (
    <div className="weather-display">
      <h2>Weather Forecast</h2>
      <div className="location-input">
        <input 
          type="text" 
          placeholder="Enter location..." 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
        />
        <button onClick={handleGetData}>Get Weather</button>
      </div>
      {weatherData ? (
        <>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Condition: {weatherData.weather[0].description}</p>
          <p>Visibility Index: {weatherData.visibility}</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </>
      ) : (
        <p>Please enter a location and click "Get Weather" to fetch weather data.</p>
      )}
    </div>
  );
};

export default WeatherDisplay;
