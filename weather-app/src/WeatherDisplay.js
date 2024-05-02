import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherDisplay.css';
import OpenAI from 'openai';


const WeatherDisplay = ({ updateHealthRecommendations, selectedDiseases }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [fetchData, setFetchData] = useState(false); // State to track fetch
  const [response, setResponse] = useState('');
  const [response1, setResponse1] = useState('');
  const [airPollutionData, setAirPollutionData] = useState(null);
  
  
  const API_KEY = '04ae16b1094cee2dac21deb82bf0f81b'; 

  useEffect(() => {
    const fetchWeatherDataByLocation = async () => {
      if (fetchData && location) {
        try {
          const response1 = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);
          setWeatherData(response1.data);
          handleGetRecommendation(response1.data, airPollutionData); // Call to fetch recommendations from OpenAI
          setFetchData(false); // Reset fetchData 
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };

    fetchWeatherDataByLocation();
  }, [fetchData, location, API_KEY]); // Run the effect 

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Ensure you understand security implications
  });

  const handleGetRecommendation = async (weather, airPollutionData) => {
    if (!selectedDiseases.length) return;  // Check if there are selected diseases
    const diseasesList = selectedDiseases.join(", ");
    const airQualityInfo = `Air Quality Index (AQI): ${airPollutionData.list[0].main.aqi}, PM2.5 Level: ${airPollutionData.list[0].components.pm2_5} µg/m³, Ozone (O3) Level: ${airPollutionData.list[0].components.o3} µg/m³`;
    const prompt = `Given the current weather conditions with a temperature of ${weather.main.temp}°C, humidity at ${weather.main.humidity}%, ${weather.weather[0].description}, visibility of ${weather.visibility} meters, wind speed of ${weather.wind.speed} m/s, ${airQualityInfo} air quality 1 is good 5 is very bad, and health conditions including ${diseasesList}, for the diseases and temperature should I go out, what preacautions should I take and appropriate health recommendations?`;

    

    try {
      const result = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 60,
      });
  
      console.log('API Response:', JSON.stringify(result, null, 2)); // Better visibility of the structure

      // Make sure that 'data' and 'choices' are present in the response
      if (result && result.choices && result.choices.length > 0) {
        setResponse(result.choices[0].message.content);
    } else {
        console.log('No choices in response:', result);
        setResponse('No valid response found. Check the console for details.');
    }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setResponse('Failed to fetch recommendations. Check the console for more details.');
    }
  };

  const fetchCoordinates = async (locationName) => {
    try {
        const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${API_KEY}`;
        const geocodeResponse = await axios.get(geocodeUrl);
        if (geocodeResponse.data && geocodeResponse.data.length > 0) {
            const { lat, lon } = geocodeResponse.data[0];
            fetchAirPollutionData(lat, lon);
        } else {
            alert('Unable to find location. Please check the location name and try again.');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        alert('Failed to fetch coordinates. Check the console for more details.');
    }
};

const fetchAirPollutionData = async (lat, lon) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        setAirPollutionData(response.data);
    } catch (error) {
        console.error('Error fetching air pollution data:', error);
        alert('Failed to fetch air pollution data. Please check the console for more details.');
    }
};

const handleGetAirPollution = () => {
    if (!location) {
        alert('Please enter a location name.');
        return;
    }
    fetchCoordinates(location);
};


  const handleGetData = () => {
    setFetchData(true); // Trigger the useEffect 
  };

  const handleCombinedClick = () => {
    // Perform both actions when button is clicked
    handleGetAirPollution();
    handleGetData();
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
        <button onClick={handleCombinedClick}>Get Weather</button>
      </div>
      {weatherData ? (
        <>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Condition: {weatherData.weather[0].description}</p>
          <p>Visibility Index: {weatherData.visibility}</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          {airPollutionData && (
                <>
                    <p>Air Quality Index (AQI): {airPollutionData.list[0].main.aqi}</p>
                    <p>PM2.5 Level: {airPollutionData.list[0].components.pm2_5} µg/m³</p>
                    <p>Ozone (O3) Level: {airPollutionData.list[0].components.o3} µg/m³</p>
                </>
            )}
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