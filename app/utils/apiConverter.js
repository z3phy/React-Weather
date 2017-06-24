var Api = require('./api.js');
var dateConverter = require('./dateConverter.js');

function militaryToRegular(time) {
  if (time > 12) {
    return time - 12 + "pm"
  } else if (time < 10) {
    return String(time).slice(1, 2) + "am"
  } else {
    return time + "am"
  }
}

function getTabs(current, forecast) {
  let tabs = [];
  let counter = 0;
  for (var time = 0; time < forecast.list.length; time++) {
    if (forecast.list[time].dt_txt.slice(11, 13) === '12') {
      tabs.push([forecast.list[time].weather[0].icon, counter]);
      counter++
    }
  }
  if (tabs.length === 4) {
    tabs.unshift([current.weather[0].icon, 0])
    for (var time = 1; time < tabs.length; time++) {
      tabs[time][1]++
    }
  }
  return tabs;
}

function getWeatherData(current, forecast) {

  let day = '';
  let timer = 0;
  let Obj = {};

  for (var time = 0; time < forecast.list.length; time++) {

    // Variables for readability
    let jsonDate = forecast.list[time].dt_txt.slice(0, 10);
    let jsonTime = forecast.list[time].dt_txt.slice(11, 13);
    let jsonIcon = forecast.list[time].weather[0].icon;

    if (jsonDate === day) {

      // Adds tab header to the Obj
      if (jsonTime === '12') {
        Obj[timer]['tab'] = jsonIcon
      }

      // Formats and adds date to the Obj
      Obj[timer]['date'] = jsonDate.slice(8, 10) + '/' + jsonDate.slice(6, 7) + '/' + jsonDate.slice(0,4)

      // Adds times, future temp and icons to the Obj
      if (Number(jsonTime) > 8 && Number(jsonTime) < 22) {
        Obj[timer]['timeIcon'].push([militaryToRegular(jsonTime), jsonIcon])
        Obj[timer]['timeTemp'].push([militaryToRegular(jsonTime), Math.round(forecast.list[time].main.temp - 273.15)])
      }

      // Adds humidity, rain, description, wind and clouds to Obj
      Obj[timer]['humidity'].push(forecast.list[time].main.humidity)
      Obj[timer]['rain'] += forecast.list[time].rain['3h']
      Obj[timer]['description'] = forecast.list[time].weather[0].main
      Obj[timer]['wind'] = forecast.list[time].wind['speed']
      Obj[timer]['clouds'] = forecast.list[time].clouds['all']

      // OpenWeatherMap is giving stupid numbers for humidity.
      // If I was ethical and didn't have space to fill, I wouldn't include it, but...
      // Averages humidity
      let avgHumTotal = 0;
      for (var x = 0; x < Obj[timer]['humidity'].length; x++) {
        avgHumTotal += Obj[timer]['humidity'][x]
      }
      Obj[timer]['avgHumidity'] = Math.round(avgHumTotal / Obj[timer]['humidity'].length)

      // Averages temp
      let avgTempTotal = 0;
      for (var x = 0; x < Obj[timer]['timeTemp'].length; x++) {
        avgTempTotal += Obj[timer]['timeTemp'][x]
      }
      Obj[timer]['avgTemp'] = Math.round(avgTempTotal / Obj[timer]['timeTemp'].length)

      // Max and Min temps
      Obj[timer]['temps'].push(Math.round(forecast.list[time].main.temp - 273.15))
      Obj[timer]['maxTemp'] = Math.max.apply(null, Obj[timer]['temps'])
      Obj[timer]['minTemp'] = Math.min.apply(null, Obj[timer]['temps'])



    } else if (jsonDate !== day) {

      if (Object.keys(Obj).length !== 0) {
        timer++
        Obj[timer] = {};
        Obj[timer]['timeIcon'] = [];
        Obj[timer]['rain'] = 0;
        Obj[timer]['timeTemp'] = [];
        Obj[timer]['temps'] = [];
        Obj[timer]['humidity'] = [];
      } else {
        Obj[timer] = {};
        Obj[timer]['timeIcon'] = [];
        Obj[timer]['rain'] = 0;
        Obj[timer]['temps'] = [];
        Obj[timer]['timeTemp'] = [];
        Obj[timer]['humidity'] = [];
      }

      day = jsonDate;
    }

  }

  // Sets current info
  Obj[0]['tab'] = current.weather[0].icon
  Obj[0]['currentTemp'] = Math.round(current.main.temp - 273.15)
  Obj[0]['humidity'] = current.main.humidity
  Obj[0]['description'] = current.weather[0].main
  // converts from Epoch
  Obj[0]['date'] = dateConverter(current.dt)

  // Sometimes openweathermap gets annoying and adds in another day
  if (Obj[5]) {
    delete Obj[5]
  }

  return Obj;

}


module.exports = {
  getTabs: getTabs,
  getWeatherData: getWeatherData
}
