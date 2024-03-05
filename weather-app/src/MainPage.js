
import React from 'react';
import WeatherDisplay from './WeatherDisplay';
import HealthTips from './HealthTips';

const MainPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Weather and Health Advisor</h1>
      </header>
      <main>
        <WeatherDisplay />
        <HealthTips />
      </main>
    </div>
  );
}

export default MainPage;
