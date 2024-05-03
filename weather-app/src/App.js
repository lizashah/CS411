import React, { useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import './App.css';
import DiseaseSelector from './DiseaseSelector';
import WeatherDisplay from './WeatherDisplay';
import { ref, set, get, child } from "firebase/database";
import { db } from './firebase-config';

function App() {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [showDiseaseSelection, setShowDiseaseSelection] = useState(false);
  const [healthRecommendations, setHealthRecommendations] = useState(null);
  const [showWeatherAndHealthInfo, setShowWeatherAndHealthInfo] = useState(false);


  //google login 
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "850002868075-riog8tkerkj6rm9p4981v1c208i7fi64.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), { theme: "outline", size: "large" });
    google.accounts.id.prompt();
  }, []);

  //Sign in callback 
  function handleCallbackResponse(response) {
    var userObject = jwt_decode(response.credential);
    setUser(userObject);
    checkAndSaveUserData(userObject.sub, userObject.name, userObject.email);
    fetchExistingDiseases(userObject.sub);
    setShowDiseaseSelection(true);
  }

  //google sign out 
  function handleSignOut() {
    setUser({});
    setShowDiseaseSelection(false);
    setShowWeatherAndHealthInfo(false);
  }
  

  // firebase 
  const checkAndSaveUserData = (userId, name, email) => {
    const userRef = ref(db, 'users/' + userId);
    get(userRef).then((snapshot) => {
      if (!snapshot.exists()) {
        set(userRef, { username: name, email: email });
      }
    }).catch((error) => console.error("Failed to check or save user data", error));
  };


  // Disease Selector part to fetch diseases
  const fetchExistingDiseases = (userId) => {
    get(child(ref(db), `users/${userId}/selectedDiseases`)).then((snapshot) => {
      if (snapshot.exists() && Array.isArray(snapshot.val())) {
        setSelectedDiseases(snapshot.val());
      } else {
        console.log("No diseases found for user or data format incorrect.");
        setSelectedDiseases([]);
      }
    }).catch((error) => console.error("Failed to retrieve data", error));
  };
    // Disease Selector part to append diseases to firebase database
  const handleDiseaseSelectionSubmit = () => {
    set(ref(db, 'users/' + user.sub + '/selectedDiseases'), Array.from(selectedDiseases));
    setShowWeatherAndHealthInfo(true);
  };

  

  const updateHealthRecommendations = (data) => {
    setHealthRecommendations({
      //uv: getUVRecommendation(data.uvi),
      temperature: getTemperatureRecommendation(data.main.temp),
      humidity: getHumidityRecommendation(data.main.humidity),
      windSpeed: getWindSpeedRecommendation(data.wind.speed),
      visibility: getVisibilityRecommendation(data.visibility)
    });
  };

  // this is old integration when we were given recommendations mannually 
  //not used now 
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
            {showDiseaseSelection && !showWeatherAndHealthInfo && (
              <DiseaseSelector selectedDiseases={selectedDiseases} onSelect={(disease) => {
                const updatedSelections = new Set(selectedDiseases);
                if (updatedSelections.has(disease)) {
                  updatedSelections.delete(disease);
                } else {
                  updatedSelections.add(disease);
                }
                setSelectedDiseases(Array.from(updatedSelections));
              }} />
            )}
            {showDiseaseSelection && !showWeatherAndHealthInfo && (
              <button onClick={handleDiseaseSelectionSubmit} className="sub-btn">Submit Selections</button>
            )}
            {showWeatherAndHealthInfo && (
              <>
                <WeatherDisplay updateHealthRecommendations={setHealthRecommendations} selectedDiseases={selectedDiseases} />
            
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;