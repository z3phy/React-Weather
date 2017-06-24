var React = require('react');
var WeatherCard = require('./WeatherCard.js');
var Api = require('../utils/api.js');
var Convert = require('../utils/apiConverter.js');

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getNews = this.getNews.bind(this);
    this.getData = this.getData.bind(this);
  }
  getNews() {
    Api.getNews.then(json => {
      this.setState({
        title: json.data.data.children[0].data.title,
        url: json.data.data.children[0].data.url,
        comments: "https://www.reddit.com" + json.data.data.children[0].data.permalink + "?sort=confidence"
      })
    })
  };
  getData(city) {
    Api.getCurrentWeather(city).then(current => {
      Api.getForecast(city).then(forecast => {
        this.setState({
          currentData: current.data,
          forecastData: forecast.data,
          tabs: Convert.getTabs(current.data, forecast.data),
          weatherData: Convert.getWeatherData(current.data, forecast.data)
        })
      })
    })
  };
  handleChange(event) {
    this.setState({
      city: event.target.value
    })
  }
  handleSubmit(event) {
    event.preventDefault();
    this.getData(this.state.city);
    this.getNews();
  }
  render() {
    return (
      <div>
        <form className='form' onSubmit={this.handleSubmit}>
          <h1 className='info'>React Weather</h1>
          <input
            className='input'
            placeholder='Enter your city'
            type='text'
            value={this.state.city}
            onChange={this.handleChange} />
          <button
            className='button'
            type='submit'
            disabled={!this.state.city}>
            Check Weather
          </button>
          <WeatherCard
            // move this out of the 'form' div and change the css accordingly
            weatherData={this.state.weatherData}
            tabs={this.state.tabs}
            title={this.state.title}
            comments={this.state.comments}
            url={this.state.url}
            city={this.state.city} />
        </form>
      </div>
    )
  }
}




module.exports = Main;
