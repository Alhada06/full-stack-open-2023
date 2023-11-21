import axios from "axios";
const apiKey = import.meta.env.VITE_OPEN_WEATHER_MAP;
const getWeather = (lat, lon) => {
  return axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
};

export default { getW: getWeather };
