var axios = require('axios');

var _APIKEY = '8e5f7303405c6588a15d32c26cf1cead';
var _baseURL = 'http://api.openweathermap.org/data/2.5/';

const prepRouteParams = queryStringData => {
  return Object.keys(queryStringData)
    .map(key => {
      return key + '=' + encodeURIComponent(queryStringData[key]);
    }).join('&')
}

function prepUrl (type, queryStringData) {
  return _baseURL + type + '?' + prepRouteParams(queryStringData);
}

const getQueryStringData = city => {
  return {
    q: city,
    type: 'accurate',
    APPID: _APIKEY,
    cnt: 50
  }
}

const getCurrentWeather = city => new Promise((resolve, reject) => {
  let queryStringData = getQueryStringData(city);
  let url = prepUrl('weather', queryStringData);
  let json = axios.get(url)

  resolve(json)
  reject("error")
})

const getForecast = city => new Promise((resolve, reject) => {
  let queryStringData = getQueryStringData(city);
  let url = prepUrl('forecast', queryStringData);
  let json = axios.get(url)

  resolve(json)
  reject("error")
})

const getNews = new Promise((resolve, reject) => {
  const url = axios.get('https://www.reddit.com/r/worldnews/rising.json')
  resolve(url)
  reject("error")
})

module.exports = {
  getCurrentWeather: getCurrentWeather,
  getForecast: getForecast,
  getNews: getNews
};
