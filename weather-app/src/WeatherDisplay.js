import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherDisplay.css';

const WeatherDisplay = ({ updateHealthRecommendations, selectedDiseases }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [fetchData, setFetchData] = useState(false); // State to track fetch
  const [response, setResponse] = useState('');
  const API_KEY = '04ae16b1094cee2dac21deb82bf0f81b'; 
  const OPENAI_API_KEY = 'sk-proj-s6akVjnwsEbu69O81jnVT3BlbkFJX9E2mqSyICIdY7my7yJM';

  useEffect(() => {
    const fetchWeatherDataByLocation = async () => {
      if (fetchData && location) {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);
          setWeatherData(response.data);
          fetchOpenAIHealthRecommendations(response.data); // Call to fetch recommendations from OpenAI
          setFetchData(false); // Reset fetchData 
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };

    fetchWeatherDataByLocation();
  }, [fetchData, location, API_KEY]); // Run the effect 

  const fetchOpenAIHealthRecommendations = async (weather) => {
    if (!selectedDiseases.length) return; // No need to fetch if no diseases are selected
    const diseasesList = selectedDiseases.join(", ");
    const prompt = `Given the weather conditions with a temperature of ${weather.main.temp}°C, humidity ${weather.main.humidity}%, and wind speed ${weather.wind.speed} m/s in ${location}, along with health conditions such as ${diseasesList}, what are the appropriate health recommendations?`;
    try {
      const result = await axios.post('https://api.openai.com/v1/engines/davinci-002/completions', {
        prompt: prompt,
        max_tokens: 100
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      setResponse(result.data.choices[0].text);
      updateHealthRecommendations(result.data.choices[0].text);
    } catch (error) {
      console.error('Error fetching health recommendations from OpenAI:', error);
      setResponse('Failed to fetch recommendations. Check the console for more details.');
    }
  };

  const handleGetData = () => {
    setFetchData(true); // Trigger the useEffect 
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
          <h3>Health Recommendations</h3>
          <p>{response}</p>
        </>
      ) : (
        <p>Please enter a location and click "Get Weather" to fetch weather data.</p>
      )}
    </div>
  );
};

export default WeatherDisplay;
