import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GeneticDiseaseSelector.css'; 

function GeneticDiseaseSelector() {
    const [diseases, setDiseases] = useState([]);
    const [selectedDiseases, setSelectedDiseases] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDiseases = async () => {
            try {
                const response = await axios.get('https://clinicaltables.nlm.nih.gov/api/disease_names/v3/search', {
                    params: {
                        terms: '',  
                        maxList: 1000,
                        df: 'DiseaseName'
                    }
                });
                const fetchedDiseases = response.data[3].map(item => ({
                    name: item[0],
                    id: item[1]
                }));
                setDiseases(fetchedDiseases);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching genetic diseases:', error);
                setError('Failed to fetch diseases due to an error.');
                setLoading(false);
            }
        };

        fetchDiseases();
    }, []);

    const handleCheckboxChange = (diseaseId) => {
        const newSet = new Set(selectedDiseases);
        if (newSet.has(diseaseId)) {
            newSet.delete(diseaseId);
        } else {
            newSet.add(diseaseId);
        }
        setSelectedDiseases(newSet);
    };

    if (loading) return <p>Loading diseases...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
        <h2>Select Genetic Diseases</h2>
        <ul className="scrollable-list">
            {diseases.map(disease => (
                <li key={disease.id}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedDiseases.has(disease.id)}
                            onChange={() => handleCheckboxChange(disease.id)}
                        />
                        {disease.name}
                    </label>
                </li>
            ))}
        </ul>
    </div>
    );
}

export default GeneticDiseaseSelector;