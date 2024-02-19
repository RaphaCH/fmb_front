import axios from 'axios';
const URL = 'https://maps.googleapis.com/maps/api/geocode';
const key = process.env.GOOGLE_API_KEY;

const GetCoordinates = async (address) => {
  const addressInfos = await axios
    .get(`${URL}/json?address=${address}&key=${key}`)
    .then((res) => {
      return res.data.results[0];
    })
    .catch((error) => {
      return error;
    });
  return addressInfos;
};

export default GetCoordinates;
