import React, { useState } from "react";
import axios from "axios";
import "./WeatherApp.css";

const WeatherApp = () => {
  const [location, setLocation] = useState("");
  const [locationList, setLocationList] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = "5af32694ea9e40438f871621233008"; // Replace with your Weather API key

  const fetchLocationList = async (query) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`
      );
      setLocationList(response.data);
    } catch (error) {
      console.error("Error fetching location list:", error);
      setLocationList([]);
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1&aqi=no&alerts=no`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("An error occurred while fetching weather data.");
      setWeatherData(null);
    }
  };

  const handleLocationChange = (event) => {
    const newLocation = event.target.value;
    setLocation(newLocation);
    fetchLocationList(newLocation);
  };

  return (
    <div className="weather-app">
      <h1>Weather App</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={handleLocationChange}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>
      <div className="location-list">
        {locationList.length > 0 && (
          <ul>
            {locationList.map((location) => (
              <li key={location.id} onClick={() => setLocation(location.name)}>
                {location.name}, {location.country}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="weather-card">
        {error ? (
          <p className="error-message">{error}</p>
        ) : weatherData ? (
          <div>
            <h2>
              {weatherData.location.name}, {weatherData.location.country}
            </h2>
            <p>
              Temperature: {weatherData.current.temp_c}°C /{" "}
              {weatherData.current.temp_f}°F
            </p>
            <p>Weather Condition: {weatherData.current.condition.text}</p>
            <p>Humidity: {weatherData.current.humidity}%</p>
            <p>Wind Speed: {weatherData.current.wind_kph} km/h</p>
            <p>Cloud Coverage: {weatherData.current.cloud}%</p>
            <p>Last Update: {weatherData.current.last_updated}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WeatherApp;

