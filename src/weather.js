import React, { useState, useEffect } from "react";
import "./App.css";

const WeatherDashboard = () => {
  const [city, setCity] = useState("Thiruvallur");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    const apiKey = "2e15e35f492e703def255b5b17a8d7eb";
    if (!apiKey) {
      setError("API key is missing. Set REACT_APP_WEATHER_API_KEY in .env");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const weatherData = await weatherRes.json();
      
      if (weatherData.cod === 200) {
        setWeather(weatherData);
      } else {
        setError("City not found. Please check the spelling and try again.");
        return;
      }

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const forecastData = await forecastRes.json();
      
      if (forecastData.cod === "200") {
        const dailyForecast = forecastData.list.filter((item) => 
          item.dt_txt.includes("12:00:00")
        );
        setForecast(dailyForecast);
      }
    } catch (error) {
      setError("Error fetching weather data. Please try again.");
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
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
      mist: "🌫️",
      fog: "🌫️",
      haze: "🌫️",
      smoke: "🌫️",
      dust: "🌫️",
      sand: "🌫️",
      ash: "🌫️",
      squall: "💨",
      tornado: "🌪️"
    };
    
    return icons[Object.keys(icons).find((key) => 
      description.toLowerCase().includes(key)
    )] || "🌡️";
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`app ${darkMode ? "dark-theme" : "light-theme"}`}>
      <button 
        className="theme-toggle" 
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="container">
        {/* Left: Search Section */}
        <div className="search-section card">
          <h1>Weather Dashboard</h1>
          <form className="search-container" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-bar"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="City name"
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={loading}
            >
              {loading ? "..." : "🔍"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>


        {/* Right: Weather Report */}
        {weather && weather.main && (
          <div className="weather-section card">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <span className="weather-icon">
              {getWeatherIcon(weather.weather[0].description)}
            </span>
            <h3>{Math.round(weather.main.temp)}°C</h3>
            <p>{weather.weather[0].description}</p>
            <div className="weather-details">
              <div>🌡️ Feels Like: {Math.round(weather.main.feels_like)}°C</div>
              <div>💧 Humidity: {weather.main.humidity}%</div>
              <div>🌬️ Wind: {Math.round(weather.wind.speed)} m/s</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom: 5-Day Forecast */}
      {forecast.length > 0 && (
        <div className="forecast-container">
          <h2>5-Day Forecast</h2>
          <div className="forecast-cards">
            {forecast.map((day) => (
              <div key={day.dt} className="forecast-card">
                <div className="forecast-date">{formatDate(day.dt)}</div>
                <div className="forecast-icon">{getWeatherIcon(day.weather[0].description)}</div>
                <div className="forecast-temp">{Math.round(day.main.temp)}°C</div>
                <div className="forecast-description">{day.weather[0].description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;