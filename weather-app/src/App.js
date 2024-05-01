import React, { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import './App.css';
import WeatherDisplay from './WeatherDisplay';
import HealthTips from './HealthTips';
import GeneticDiseaseSelector from './GeneticDiseaseSelector';
import { ref, set } from "firebase/database";
import { db } from './firebase-config'; // Make sure this path is correct

function App() {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [healthRecommendations, setHealthRecommendations] = useState(null);
  const [selectedDiseases, setSelectedDiseases] = useState(new Set());

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    setUser(userObject);
    saveUserData(userObject.sub, userObject.name, userObject.email); // Save to Firebase
    const signInDiv = document.getElementById("signInDiv");
    if (signInDiv) signInDiv.hidden = true;
  }

  function handleSignOut() {
    setUser({});
    const signInDiv = document.getElementById("signInDiv");
    if (signInDiv) signInDiv.hidden = false;
  }

  const saveUserData = (userId, name, email) => {
    set(ref(db, 'users/' + userId), {
      username: name,
      email: email
    });
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "850002868075-riog8tkerkj6rm9p4981v1c208i7fi64.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );

    google.accounts.id.prompt();
  }, []);


  const updateHealthRecommendations = (data) => {
    setHealthRecommendations({
      //uv: getUVRecommendation(data.uvi),
      temperature: getTemperatureRecommendation(data.main.temp),
      humidity: getHumidityRecommendation(data.main.humidity),
      windSpeed: getWindSpeedRecommendation(data.wind.speed),
      visibility: getVisibilityRecommendation(data.visibility)
    });
  };

  const getUVRecommendation = (uvIndex) => {
    if (uvIndex < 3) {
      return 'Low UV Index: No protection needed.';
    } else if (uvIndex < 6) {
      return 'Moderate UV Index: Wear sunscreen and protective clothing.';
    } else if (uvIndex < 8) {
      return 'High UV Index: Take extra precautions, such as seeking shade and wearing a hat.';
    } else if (uvIndex < 11) {
      return 'Very High UV Index: Avoid sun exposure during midday hours.';
    } else {
      return 'Extreme UV Index: Minimize sun exposure and take all precautions.';
    }
  };

  const getTemperatureRecommendation = (temp) => {
    if (temp > 30) {
      return 'High Temperature: Stay hydrated and avoid prolonged outdoor activities.';
    } else if (temp < 5) {
      return 'Low Temperature: Dress warmly and limit exposure to cold air.';
    } else {
      return 'Temperature is comfortable.';
    }
  };
  const getVisibilityRecommendation = (visibility) => {
    if (visibility < 1000) {
      return 'Low Visibility: Take extra caution when driving or walking.';
    } else if (visibility < 5000) {
      return 'Moderate Visibility: Be aware of reduced visibility.';
    } else {
      return 'Good Visibility: Clear conditions for outdoor activities.';
    }
  };

  const getHumidityRecommendation = (humidity) => {
    if (humidity > 70) {
      return 'High Humidity: Stay hydrated and avoid overexertion.';
    } else if (humidity < 30) {
      return 'Low Humidity: Drink plenty of fluids to prevent dehydration.';
    } else {
      return 'Humidity is moderate.';
    }
  };

  const getWindSpeedRecommendation = (windSpeed) => {
    if (windSpeed > 10) {
      return 'High Wind Speed: Secure loose objects and use caution when outdoors.';
    } else {
      return 'Wind speed is moderate.';
    }
  };

  return (
    <div className="App">
      {!user.name ? (
        <div className="login-form-container">
          <div className="login-form">
            <h2>Login Here</h2>
            <div className="input-group">
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button className="login-btn">Login</button>
              <div className="separator">Or</div>
              <div id="signInDiv"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="content">
          <header className="App-header">
            <h1>Welcome to Weather and Health Advisor</h1>
            <button onClick={handleSignOut}>Sign Out</button>
          </header>
          <main className="info-display">
            <WeatherDisplay updateHealthRecommendations={updateHealthRecommendations} />
            <HealthTips recommendations={healthRecommendations} />
            <GeneticDiseaseSelector />
            
          </main>
        </div>
      )}
    </div>

  );
}

export default App;