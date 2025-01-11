import React, { useState } from "react";
import "./App.css";

const WeatherDashboard = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    const apiKey = "2e15e35f492e703def255b5b17a8d7eb";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    setWeather(data);
  };

  const handleSearch = () => {
    if (city.trim() !== "") fetchWeather();
  };

  return (
    <div className="weather-app">
      <header className="header">
        <h1>Weather Dashboard</h1>
      </header>

      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {weather && weather.main && (
        <div className="weather-card">
          <h2 className="city-name">{weather.name}</h2>
          <div className="temperature">{Math.round(weather.main.temp)}°C</div>
          <div className="weather-info">
            <img
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p className="weather-description">
              {weather.weather[0].description}
            </p>
          </div>
          <div className="details">
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
