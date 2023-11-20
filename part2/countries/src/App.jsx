/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
const Search = ({ handleSearch, searchParam }) => {
  return (
    <div>
      Find countries <input onChange={handleSearch} value={searchParam} />
    </div>
  );
};
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
function App() {
  const [countries, setCountries] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res) => setCountries(res.data));
  }, []);

  const handleSearch = (event) => {
    setSearchParam(event.target.value);
    if (searchParam) {
      setSearching(true);
    } else {
      setSearching(false);
    }
  };
  const search = () => {
    return countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchParam)
    );
  };
  const countriesFilter = searching ? search() : countries;

  return (
    <div>
      <Search searchParam={searchParam} handleSearch={handleSearch} />
      <Countries countries={countriesFilter} searchParam={searchParam} />
    </div>
  );
}

export default App;
