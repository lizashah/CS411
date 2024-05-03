# CS411
CS411 Repository for Aleeza Shah, Muhammad Ghani, Ishita Agrawal

# Weather and Health Advisor

This project provides real-time weather and health recommendations based on user-selected diseases and current weather conditions. It uses Google OAuth for user authentication and Firebase for data storage, seamlessly integrating these services to enhance user experience.

## Features

- User Authentication: Users can sign in using Google authentication. Upon login, user information is saved to Firebase to maintain session state and user preferences.
- Disease Selection: Users can select various diseases from a list that is stored and retrieved from Firebase under the 'diseases' key. Selected diseases are saved to the user's profile in the database, and upon returning to the application, these selections are pre-loaded based on the user's last session.
- Weather and Health Recommendations: Utilizes the OpenWeather API to fetch current weather data and air quality indices based on geocoded latitude and longitude from the entered location. The application sends all weather data, air quality information, and the user's selected disease list to OpenAI, which then generates personalized health recommendations.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (LTS version)
- npm (usually comes with Node.js)
- A modern web browser

## Installation

1. Clone the repository:

   git clone https://github.com/lizashah/CS411/tree/main
   cd CS411


2. Install dependencies:

   npm install


3. Set up Firebase:

   Ensure you have a Firebase project set up and obtain your Firebase configuration. Update the `firebase-config.js` with your project's specific settings:

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     databaseURL: "YOUR_DATABASE_URL",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };


4. Configure Environment Variables:

   Create a `.env` file in the root of your project and add the following line:

   "REACT_APP_OPENAI_API_KEY=Your_OpenAI_API_Key"

   Replace `Your_OpenAI_API_Key` with your actual OpenAI API key.

## Running the Application

1. Start the development server:

   npm start

   This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits.

2. Build the application for production:
   
   npm run build
   
   This builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.
