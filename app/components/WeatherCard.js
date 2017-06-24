const React = require('react');
const Api = require('../utils/api.js');
const Convert = require('../utils/apiConverter.js');

function Tabs(props) {
  return (
    <ul>
      {
        props.tabs.map(tab => {
          return (
            <li
              className={tab[1] === 0 ? "tab top-left" : tab[1] === 4 ? "tab top-right" : "tab"}
              style={tab[1] === props.selectedDay ? {backgroundColor: "white", opacity: 1} : null}
              key={tab[1]}
              onClick={props.onSelect.bind(null, tab[1])}>
              <img src={"app/images/" + tab[0] + ".svg"}/>
            </li>
          )
        })
      }
    </ul>
  )
}

function Information(props) {
  return (
    <div className="information">
      <p className="weather">{props.description}</p>
      <p className="date">{props.date}</p>
      {props.current ? <p>{"The current temperature is: " + props.current + "°C"}</p> : null}
      {props.highest ? <p>{"The highest temperature is: " + props.highest + "°C"}</p> : null}
      {props.lowest ? <p>{"The lowest temperature is: " + props.lowest + "°C"}</p> : null}
    </div>
  )
}

function News(props) {
  return (
    <div className="news">
      <p>Latest headline:</p>
      <a href={props.url}>{props.title}</a>
      <a href={props.comments}>Reddit Comments</a>
    </div>
  )
}

function Times(props) {

  return (
    <ul className="times">
    {
      props.bool ?
        props.times.map(time => {
          return (
            <li key={time[0]} onMouseEnter={props.hover.bind(null, time[0])}>
              <p className="time">{time[0]}</p>
              <img src={"app/images/" + time[1] + ".svg"}/>
            </li>
          )
        }) :
      props.temps.map(temp => {
        return (
          <li key={temp[0]} onMouseLeave={props.hover.bind(null, temp[0])}>
            <p className="time">{temp[0]}</p>
            <p className="temp">{temp[1] + "°C"}</p>
          </li>
        )
      })
    }
    </ul>
  )
}

class WeatherCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDay: 0,
      bool: true
    };
    this.updateTab = this.updateTab.bind(this);
    this.showTemp = this.showTemp.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      city: nextProps.city,
      tabs: nextProps.tabs,
      title: nextProps.title,
      url: nextProps.url,
      comments: nextProps.comments,
      weatherData: nextProps.weatherData
    })
  }
  updateTab(day) {
    this.setState({
      selectedDay: day
    })
  }
  showTemp(time) {
    if (this.state.bool) {
      this.setState({
        bool: false
      })
    } else {
      this.setState({
        bool: true
      })
    }
  }
  render() {
    if (this.state.tabs) {
      return (
        <div className="card">
          <Tabs
            tabs={this.state.tabs}
            day={null}
            onSelect={this.updateTab}
            selectedDay={this.state.selectedDay} />
          <div className="weatherinfo">
            <Times
              hover={this.showTemp}
              bool={this.state.bool}
              temps={this.state.weatherData[this.state.selectedDay].timeTemp}
              times={this.state.weatherData[this.state.selectedDay].timeIcon}/>
            <Information
              description={this.state.weatherData[this.state.selectedDay].description}
              date={this.state.weatherData[this.state.selectedDay].date}
              current={this.state.weatherData[this.state.selectedDay].currentTemp}
              lowest={this.state.weatherData[this.state.selectedDay].minTemp}
              highest={this.state.weatherData[this.state.selectedDay].maxTemp}/>
            <News
              title={this.state.title}
              url={this.state.url}
              comments={this.state.comments}/>
          </div>

        </div>
      )
    }
    else {
      return (
        <div>
        </div>
      )
    }
  };
}

module.exports = WeatherCard;
