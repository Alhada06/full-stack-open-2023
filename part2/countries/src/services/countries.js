import axios from "axios";
const baseApiUrl = "https://studies.cs.helsinki.fi/restcountries/";

const getAll = () => {
  return axios.get(baseApiUrl + "api/all");
};
export default { getAll: getAll };
