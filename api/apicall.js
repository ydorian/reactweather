import axios from "axios";

const apiKey = '17d0bef2d535480aabe172533242002'
const apiCallForecast = params => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const apiCallSearch = params => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    }

    try {
        const response = await axios.request(options);
        return response.data;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export const getWeather = async (params) => {
    return apiCall(apiCallForecast(params));
}

export const getLocations = async (params) => {
    return apiCall(apiCallSearch(params));
}