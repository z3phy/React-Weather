var React = require('react');



class Main extends React.Component {
  render() {
    return (
      <div className="box">
        <h1 className='info'>Enter your city</h1>
        <input className='input' />
        <button className='button'>Check Weather</button>
      </div>       
    )
  }
}

module.exports = Main;
