// App.js
import React, { useState } from "react";
import "./App.css";

const WeatherDashboard = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const fetchWeather = async () => {
    const apiKey = "2e15e35f492e703def255b5b17a8d7eb";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    setWeather(data);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() !== "") fetchWeather();
  };

  const getWeatherIcon = (description) => {
    const icons = {
      clear: "☀️",
      clouds: "☁️",
      rain: "🌧️",
      snow: "❄️",
      thunderstorm: "⛈️",
      drizzle: "🌦️",
      mist: "🌫️"
    };
    
    const key = Object.keys(icons).find(key => 
      description.toLowerCase().includes(key)
    );
    
    return icons[key] || "🌡️";
  };

  return (
    <div className={`app ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="header">
        <h1>Weather Dashboard</h1>
        <button 
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <form className="search-container" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-bar"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {weather && weather.main && (
        <div className="weather-card">
          <div className="city-name">
            {weather.name}
          </div>
          <div className="temperature">
            {Math.round(weather.main.temp)}°C
          </div>
          <div className="weather-info">
            <span className="weather-icon">
              {getWeatherIcon(weather.weather[0].description)}
            </span>
            <span className="weather-description">
              {weather.weather[0].description}
            </span>
          </div>
          <div className="details">
            <div className="detail-item">
              <span>Humidity:</span> {weather.main.humidity}%
            </div>
            <div className="detail-item">
              <span>Wind Speed:</span> {weather.wind.speed} m/s
            </div>
            <div className="detail-item">
              <span>Feels Like:</span> {Math.round(weather.main.feels_like)}°C
            </div>
            <div className="detail-item">
              <span>Pressure:</span> {weather.main.pressure} hPa
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
