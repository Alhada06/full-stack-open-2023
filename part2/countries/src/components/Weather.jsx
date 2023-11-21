/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import weatherService from "../services/weather";

const Weather = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    weatherService
      .getW(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1])
      .then((res) => {
        setWeatherData(res.data);
      });
  }, []);

  return (
    <>
      <h2>Weather in {country.capital}</h2>
      {weatherData && (
        <>
          <p>temperature {weatherData?.main.temp} Celcius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}@2x.png`}
            alt={weatherData?.weather[0].description}
            width="100"
            height="100"
          />
          <p>temperature {weatherData?.wind.speed} m/s</p>
        </>
      )}
    </>
  );
};

export default Weather;
