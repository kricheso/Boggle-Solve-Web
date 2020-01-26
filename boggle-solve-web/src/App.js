import React from 'react';
import logo from './logo.svg';
import Grid from './components/grid';
import AlreadyUsed from './components/alreadyUsed';
import './App.css';

function App() {

  const myArr = [1, 2, 3];

  function toggleBoard() {
    console.log("Hi");
  }

  return (<>
    <h1>Boggle Solve Web</h1>
    <button onClick={toggleBoard}>Hide/Show Board</button>
    <div><br/></div>
    <Grid></Grid>
    <AlreadyUsed word={'Hello'}></AlreadyUsed>
  </>);

}

export default App;
