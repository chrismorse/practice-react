import React from 'react';
var _ = require('lodash');

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};


const Stars = (props) => {
  return (
    <div className="col-5">
      {_.range(props.numberOfStars).map((num,i) => <i key={i} className="fa fa-star"></i>)}
    </div>
  )
}

const Button = (props) => {
  let button;
  switch(props.answerIsCorrect) {
    case true:
      button = 
        <button className="btn btn-success" onClick={props.acceptAnswer}>
          <i className="fa fa-check"></i>
        </button>
      break;
    case false:
      button = 
        <button className="btn btn-danger">
          <i className="fa fa-times"></i>
        </button>
      break;
    default:
      button = <button className="btn" onClick={props.checkAnswer} disabled={props.selectedNumbers.length === 0}>=</button>
      break;

  }
  
  return (
    <div className="col-2 text-center">
        {button}
        <br /> <br />
        <button onClick={props.redraw} className="btn btn-warning btn-sm"
          disabled={props.redraw === 0}>
          <i className="fa fa-refresh"></i> {props.redraws}
        </button>
    </div>
  )
}

const Answer = (props) => {
  return (
    <div className="col-5">
      {props.selectedNumbers.map((num,i) =>
        <span key={i} onClick={() => props.unselectNumber(num)}>{num}</span>
      )}
    </div>
  )
}

const Numbers = (props) => {
  const numberClassName = (num) => {
    if (props.usedNumbers.includes(num))
      return "used"
    
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


const DoneFrame = (props) => {
  return (
    <div className="text-center">
      <h2>{props.doneStatus}</h2>
      <br />
      <button className="btn btn-secondary" onClick={props.resetGame}>Play Again</button>
    </div>
  );
}




class Game extends React.Component {

  static randomNumber = () => 1 + Math.floor(Math.random()*9);
  static initialState = () => ({
    selectedNumbers: [],
    usedNumbers: [], 
    numberOfStars: Game.randomNumber(),
    answerIsCorrect: null,
    redraws: 5,
    doneStatus: null,
  });


  state = Game.initialState();

  resetGame = () => this.setState(Game.initialState());

  selectNumber = (num) => {
    if (this.state.selectedNumbers.includes(num) || this.state.usedNumbers.includes(num)) {return;}
    
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.concat(num)
    }));
  }

  unselectNumber = (num) => {
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.filter(number => num !== number)
    }));
  }

  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect: prevState.numberOfStars === prevState.selectedNumbers.reduce((acc,n) => acc + n, 0)
    }));
  }

  acceptAnswer = () => {
    this.setState(prevState => ({
      usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      numberOfStars: Game.randomNumber(),
    }), this.updateDoneStatus);
  }

  redraw = () => {
    if (this.state.redraws !== 0) {
      this.setState(prevState => ({
        numberOfStars: Game.randomNumber(),
        answerIsCorrect: null,
        selectedNumbers: [],
        redraws: prevState.redraws - 1
      }), this.updateDoneStatus);
    }
  }  

  possibleSolutions = ({numberOfStars, usedNumbers}) => {
    const possibleNumbers = _.range(1,10).filter(number => 
      usedNumbers.indexOf(number) === -1
    );
    return possibleCombinationSum(possibleNumbers, numberOfStars);
  }

  updateDoneStatus = () => {
    this.setState(prevState => {
      if (prevState.usedNumbers.length === 9)  {
        return { doneStatus: 'Done. Nice!!'};
      }

      if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
        return { doneStatus: 'Game Over!'};
      }
    });
  }


  render() {
    const {
      selectedNumbers, 
      numberOfStars, 
      answerIsCorrect, 
      usedNumbers,
      redraws,
      doneStatus
    } = this.state;

    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={numberOfStars}/>
          <Button checkAnswer={this.checkAnswer} 
                  answerIsCorrect={answerIsCorrect} 
                  selectedNumbers={selectedNumbers} 
                  acceptAnswer = {this.acceptAnswer}
                  redraw = {this.redraw}
                  numberOfStars={numberOfStars} 
                  redraws = {redraws} />
          <Answer selectedNumbers={selectedNumbers} 
                  unselectNumber={this.unselectNumber}/>
        </div>
        <br />
        {doneStatus ? 
          <DoneFrame 
            doneStatus={doneStatus}
            resetGame={this.resetGame} 
          /> :
          <Numbers selectNumber={this.selectNumber} selectedNumbers={selectedNumbers} usedNumbers={usedNumbers} />
        }
        <br />
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
