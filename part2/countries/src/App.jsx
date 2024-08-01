/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

import countriesService from "./services/countries";

import Countries from "./components/Countries";

const Search = ({ handleSearch, searchParam }) => {
  return (
    <div>
      Find countries <input onChange={handleSearch} value={searchParam} />
    </div>
  );
};

function App() {
  const [countries, setCountries] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    countriesService.getAll().then((res) => setCountries(res.data));
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
