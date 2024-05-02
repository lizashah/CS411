import React from 'react';
import './DiseaseSelector.css';


const diseases = [
  "Influenza",
  "Common cold",
  "Asthma",
  "Allergies",
  "Malaria",
  "Dengue fever",
  "Zika virus",
  "Lyme disease",
  "West Nile virus",
  "Cholera",
  "Leptospirosis",
  "Heat-related illnesses (heat exhaustion, heatstroke)",
  "Seasonal Affective Disorder (SAD)",
  "Eczema",
  "Psoriasis",
  "Cardiovascular diseases"
];

const DiseaseSelector = ({ selectedDiseases, onSelect }) => {
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    onSelect(checked ? name : null); // Pass the selected disease or null for deselection
  };

  return (
    <div className="disease-selector">
      <h2>Select Diseases:</h2>
      {diseases.map(disease => (
        <div key={disease}>
          <input
            type="checkbox"
            id={disease}
            name={disease}
            checked={selectedDiseases.includes(disease)}
            onChange={handleCheckboxChange}
          />
          <label htmlFor={disease}>{disease}</label>
        </div>
      ))}
    </div>
  );
};

export default DiseaseSelector;
