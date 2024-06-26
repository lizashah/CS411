import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherDisplay.css';
import OpenAI from 'openai';

// Main component for displaying weather and air quality information
const WeatherDisplay = ({ updateHealthRecommendations, selectedDiseases }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [airPollutionData, setAirPollutionData] = useState(null);  const [location, setLocation] = useState('');
  const [fetchData, setFetchData] = useState(false); // State to track fetch
  const [response, setResponse] = useState('');
  const [response1, setResponse1] = useState('');
  
  // API key for OpenWeatherMap
  const API_KEY = ''; // removed OpenWeatherMap API

  useEffect(() => {
    // Function to fetch weather data based on location
    const fetchWeatherDataByLocation = async () => {
      if (fetchData && location) {
        try {
          const response1 = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);
          setWeatherData(response1.data);
          //handleGetRecommendation(response1.data, airPollutionData); // Call to fetch recommendations from OpenAI
          setFetchData(false); // Reset fetchData 
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };

    fetchWeatherDataByLocation();
  }, [fetchData, location, API_KEY]); // Run the effect 

  // Function to fetch coordinates based on location name 
  const fetchCoordinates = async (locationName) => {
    try {
        const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${API_KEY}`;
        // Uses geocoding to get lat long
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

// Function to fetch air pollution data given latitude and longitude
const fetchAirPollutionData = async (lat, lon) => {
  try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
      setAirPollutionData(response.data);
      if (weatherData) {  // Ensure weatherData is not null
          handleGetRecommendation(weatherData, response.data);
      } else {
          console.error('Weather data not available when fetching air pollution data');
      }
  } catch (error) {
      console.error('Error fetching air pollution data:', error);
      alert('Failed to fetch air pollution data. Please check the console for more details.');
  }
};

  // Here we OpenAI client initialization 
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true 
  });
// Function to generate health recommendations
// We use Open AI's GPT-4 model 
//based on weather data and air pollution data 
  const handleGetRecommendation = async (weather, airPollutionData) => {
    if (!selectedDiseases.length) return;  // Check if there are selected diseases
    // make the selected diseases in a string with a ','
    const diseasesList = selectedDiseases.join(", ");
    // get the air quality inforamtion
    const airQualityInfo = `Air Quality Index (AQI): ${airPollutionData.list[0].main.aqi}, PM2.5 Level: ${airPollutionData.list[0].components.pm2_5} µg/m³, Ozone (O3) Level: ${airPollutionData.list[0].components.o3} µg/m³`;
    //promt that we give to Open AI API
    const prompt = `Given the current weather conditions with a temperature of ${weather.main.temp}°C, humidity at ${weather.main.humidity}%, ${weather.weather[0].description}, visibility of ${weather.visibility} meters, wind speed of ${weather.wind.speed} m/s, ${airQualityInfo} Air Quality Index: Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor, and health conditions including ${diseasesList}, for the diseases and temperature should I go out, what preacautions should I take and appropriate health recommendations? Give response in 200 words `;

    

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
        max_tokens: 1000,
      });
  
      console.log('API Response:', JSON.stringify(result, null, 2)); // Better visibility of the structure

      // Make sure that data and choices are present in the response
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

// Button click handlers
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
  
  <div className="location-input">
    <input 
      type="text" 
      placeholder="Enter location..." 
      value={location} 
      onChange={(e) => setLocation(e.target.value)}
    />
    <button onClick={handleCombinedClick}>Get Weather</button>
  </div>
  {/* Always render data blocks */}
  <div className="data-block">
    {weatherData ? (
      <>
        <p>Temperature: {weatherData.main.temp}°C</p>
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p>Condition: {weatherData.weather[0].description}</p>
        <p>Visibility Index: {weatherData.visibility}</p>
        <p>Wind Speed: {weatherData.wind.speed} m/s</p>
      </>
    ) : (
      <p>Enter Location to see Weather Data.</p>
    )}
  </div>
  <div className="data-block">
    {airPollutionData ? (
      <>
        <p>Air Quality Index (AQI): {airPollutionData.list[0].main.aqi}</p>
        <p>PM2.5 Level: {airPollutionData.list[0].components.pm2_5} µg/m³</p>
        <p>Ozone (O3) Level: {airPollutionData.list[0].components.o3} µg/m³</p>
      </>
    ) : (
      <p>Enter Location to see Air Pollution Data.</p>
    )}
  </div>
  <div className="health-recommendations">
    <h3>Health Recommendations</h3>
    {response ? <p>{response}</p> : <p>Enter Location to see Health Recommendation.</p>}
  </div>
</div>
  );
};

export default WeatherDisplay;