var React = require('react');
var Main = require('./Main');

class App extends React.Component {
  render() {
    return(
      <div className='home-container'>
        <Main />
      </div>
    )
  }
}

module.exports = App;
