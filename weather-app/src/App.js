import React, { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import './App.css';
import WeatherDisplay from './WeatherDisplay';
import HealthTips from './HealthTips';

function App() {
  const [user, setUser] = useState({});
  // Define state for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    const signInDiv = document.getElementById("signInDiv");
    if (signInDiv) signInDiv.hidden = true;
  }

  function handleSignOut(event) {
    setUser({});
    const signInDiv = document.getElementById("signInDiv");
    if (signInDiv) signInDiv.hidden = false;
  }

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
            </div>
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <button className="login-btn">Login</button>
            <div className="separator">Or</div>
            <div id="signInDiv"></div>
          </div>
        </div>
      ) : (<div className="content">
      <header className="App-header">
        <h1>Welcome to Weather and Health Advisor</h1>
        <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
      </header>
      <main className="info-display">
        <WeatherDisplay />
        <HealthTips />
      </main>
    </div>
  )}
</div>
);
}

export default App;
