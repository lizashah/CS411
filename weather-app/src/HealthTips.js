import React from 'react';
import './HealthTips.css';

const HealthTips = ({ recommendations }) => {
  return (
    <div className="health-tips">
      <h2>Health Tips</h2>
      <ul>
        {recommendations ? (
          <>
            
            <li>{recommendations.temperature}</li>
            <li>{recommendations.humidity}</li>
            <li>{recommendations.windSpeed}</li>
            <li>{recommendations.visibility}</li>
          </>
        ) : (
          <li>Enter a location to get health recommendations.</li>
        )}
      </ul>
    </div>
  );
};

export default HealthTips;
