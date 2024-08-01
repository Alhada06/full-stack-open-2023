/* eslint-disable react/prop-types */
import { useState } from "react";
import Weather from "./Weather";
const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((lang, i) => (
          <li key={i}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.svg} alt="flag" width="200" height="200" />
      <Weather country={country} />
    </div>
  );
};
const CountryAccordion = ({ country }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "close" : "show"}
      </button>
      <>{isOpen && <Country country={country} />}</>
    </>
  );
};
const CountriesList = ({ countries }) => {
  return countries.map((country, i) => (
    <div key={i}>
      {country.name.common} <CountryAccordion country={country} />
    </div>
  ));
};
const Countries = ({ countries, searchParam }) => {
  if (countries.length > 10 && searchParam) {
    return <p>Too many matches, specify another filter</p>;
  }
  if (countries.length <= 10 && countries.length > 1 && searchParam) {
    return <CountriesList countries={countries} />;
  }
  if (countries.length === 1 && searchParam) {
    return <Country country={countries[0]} />;
  }
  return null;
};

export default Countries;
