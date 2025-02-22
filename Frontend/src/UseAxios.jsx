import axios from "axios";

export const axiosPublic = axios.create({
  baseURL: "https://servertodo-roan.vercel.app/",
});
const UseAxios = () => {
  return axiosPublic;
};

export default UseAxios;
