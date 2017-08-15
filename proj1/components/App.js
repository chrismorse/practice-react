import React from 'react';

class App extends React.Component {
	state = { counter: 0 }
  
  handleClick = () => {
  	this.setState({
    	counter: this.state.counter + 1
    })
  };
  
  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.counter}
      </button>
    );
  }
}

module.exports = App;