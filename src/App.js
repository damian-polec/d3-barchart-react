import React, { Component } from 'react';

import './App.css';

import BarChart from './Components/BarChart';
class App extends Component {
  state = {
    data: null,

  }
  
  componentDidMount() {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then(data =>  data.json())
      .then(data => data.data.map(d => d.reduce((tally) => {
        tally[data.column_names[0]] = d[0];
        tally[data.column_names[1]] = d[1];
        return tally
    }, {})))
    .then(data => {
        this.setState({data: data});
    })
      .catch(err => console.log(err))
      
  }

  render() {
    return (
      <div className="App">
        <h1 id='title'>United States GDP</h1>
        {this.state.data ? <BarChart data={this.state.data} width={this.state.width}/> : null}
      </div>
    );
  }
}

export default App;
