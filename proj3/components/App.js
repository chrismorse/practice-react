import React from 'react';
var _ = require('lodash');

const Stars = (props) => {
  return (
    <div className="col-5">
      {_.range(props.numberOfStars).map((num,i) => <i key={i} className="fa fa-star"></i>)}
    </div>
  )
}

const Button = (props) => {
  return (
    <div className="col-2">
      <button className="btn" disabled={props.selectedNumbers.length === 0}>=</button>
    </div>
  )
}

const Answer = (props) => {

  return (
    <div className="col-5">
      {props.selectedNumbers.map((num,i) =>
        <span key={i} onClick={() => props.unSelectNumber(num)}>{num}</span>
      )}
    </div>
  )
}

const Numbers = (props) => {
  const numberClassName = (num) => {
    if (props.selectedNumbers.includes(num))
      return "selected"; 
  }
  return (
    <div className="card text-center">
      <div>
        {Numbers.list.map((num,i) => 
          <span key={i} onClick={() => props.selectNumber(num)} className={numberClassName(num)}>{num}</span>
        )}
      </div>
    </div>
  )
}
Numbers.list = _.range(1,10);



class Game extends React.Component {
  state = {
    selectedNumbers: [], 
    numberOfStars: 1 + Math.floor(Math.random()*9)
  }

  selectNumber = (num) => {
    if (this.state.selectedNumbers.includes(num)) {return;}
    
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.concat(num)
    }));
  }

  unSelectNumber = (num) => {
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.filter(number => num !== number)
    }));
  }


  render() {
    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={this.state.numberOfStars}/>
          <Button selectedNumbers={this.state.selectedNumbers} />
          <Answer selectedNumbers={this.state.selectedNumbers} unSelectNumber={this.unSelectNumber}/>
        </div>
        <br />
        <Numbers selectNumber={this.selectNumber} selectedNumbers={this.state.selectedNumbers} />
      </div>
    );
  }
}


class App extends React.Component {
  render() {
    return (
      <div>
        <Game />
      </div>
    );
  }
}

module.exports = App;
