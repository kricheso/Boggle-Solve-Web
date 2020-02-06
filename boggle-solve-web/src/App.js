import React, { useState, useEffect } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Alert } from 'antd';
import FullGameBoard from './components/fullGameBoard'

function App() {

  // ==================
  // MARK: - Use States
  // ==================

  const [isCurrentlyPlayingGame, setIsCurrentlyPlayingGame] = useState(false);
  const [grid, setGrid] = useState(null);

  // ===================
  // MARK: - Use Effects
  // ===================

  useEffect(() => {
    console.log("First Render");
  }, []);

  // ===============
  // MARK: Functions
  // ===============

  function toggleLocalPlayerGame() {
    setIsCurrentlyPlayingGame(!isCurrentlyPlayingGame);
    generateGrid();
  }

  function generateGrid() {
    const dice = ["AAAFRS", "AAEEEE", "AAFIRS", "ADENNN", "AEEEEM",
      "AEEGMU", "AEGMNN", "AFIRSY", "BJKQXZ", "CCNSTW",
      "CEIILT", "CEILPT", "CEIPST", "DHHNOT", "DHHLOR",
      "DHLNOR", "DDLNOR", "EIIITT", "EMOTTT", "ENSSSU",
      "FIPRSY", "GORRVW", "HIPRRY", "NOOTUW", "OOOTTU"];
    let chars = dice.map(cube => cube[Math.floor(Math.random() * cube.length)]);
    chars.sort(() => Math.random() - 0.5); // Shuffle the letters.
    const SIZE = 5;
    let grid = [];
    for (let row = 0; row < SIZE; row++) {
      grid[row] = [];
      for (let col = 0; col < SIZE; ++col) {
        grid[row][col] = chars[SIZE * row + col];
        if (grid[row][col] === "Q") grid[row][col] = "Qu";
      }
    }
    setGrid(grid);
    return grid;
  }

  return (<>
    <br/>
    <Alert
        message="Boggle Solve Web"
        type='warning'
        style={{width: '400px', display: 'inline-block', color: 'black', backgroundColor: '#FFCD00', border: '1px solid black', fontSize: '40px'}}
    />
    <h2><u><a style={{color: '#A84F31'}} href="https://apps.apple.com/us/app/boggle-solve/id1496483167">Mobile app here!</a></u></h2>
    <br/><br/>
    <button onClick={ toggleLocalPlayerGame }> { isCurrentlyPlayingGame ? ('End Game') : ('New Local Game') } </button>
    <br/><br/>
    <button onClick={ toggleLocalPlayerGame }> Login or Register! </button>
    {isCurrentlyPlayingGame && grid ? (<FullGameBoard grid={grid}/>) : (<div></div>)}
  </>);

}

export default App;
