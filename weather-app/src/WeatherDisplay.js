import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherDisplay.css'; // Assuming you create a separate CSS file for styling

const WeatherDisplay = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [fetchData, setFetchData] = useState(false); // State to track if fetch data button is clicked
  const API_KEY = '04ae16b1094cee2dac21deb82bf0f81b'; // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key

  useEffect(() => {
    // Function to fetch weather data based on user's input location
    const fetchWeatherDataByLocation = async () => {
      try {
        // Make GET request to OpenWeatherMap API using user's input location
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);

        // Update state with fetched weather data
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Call the fetchWeatherDataByLocation function when the fetchData state is true
    if (fetchData && location) {
      fetchWeatherDataByLocation();
      setFetchData(false); // Reset fetchData state after fetching data
    }
  }, [fetchData, location, API_KEY]); // Run the effect whenever fetchData, location, or API_KEY changes

  const handleGetData = () => {
    setFetchData(true); // Set fetchData state to true when "Get Weather" button is clicked
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
        </>
      ) : (
        <p>Please enter a location and click "Get Weather" to fetch weather data.</p>
      )}
    </div>
  );
};

export default WeatherDisplay;
