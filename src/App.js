import React, { useState, useEffect } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Alert } from 'antd';
import LoginButton from './components/loginButton.js';
import FullGameBoard from './components/fullGameBoard';
import TextInput from './components/textInput';
import ChallengesResponse from './components/challengesResponse';

function App() {

  // ==================
  // MARK: - Use States
  // ==================

  const [user, setUser] = useState(null);
  const [isCurrentlyPlayingGame, setIsCurrentlyPlayingGame] = useState(false);
  const [grid, setGrid] = useState(null);
  const [challengeData, setChallengeData] = useState([]);
  const [singluarChallengeData, setSingluarChallengeData] = useState(null);
  const [didPressLoadChallenges, setDidPressLoadChallenges] = useState(false);

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
    setSingluarChallengeData(null);
    setGrid(generateGrid());
  }

  function toggleChallengeGame(e) {
    console.log(e);
    setIsCurrentlyPlayingGame(!isCurrentlyPlayingGame);
    setSingluarChallengeData(e);
    setGrid(stringToGrid(e.grid));
  }

  function loadChallenges() {
    setDidPressLoadChallenges(true);
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
    return grid;
  }

  function stringToGrid(s) {
    if (s.length !== 25) { return }
    let chars = s.split('');
    const SIZE = 5;
    let grid = [];
    for (let row = 0; row < SIZE; row++) {
      grid[row] = [];
      for (let col = 0; col < SIZE; ++col) {
        grid[row][col] = chars[SIZE * row + col]
        if (grid[row][col] === "Q") grid[row][col] = "Qu";
      }
    }
    return grid;
  }

    // =========
    // MARK: JSX
    // =========

  return (<>
    <br/>
    <Alert
        message="Boggle Solve Web"
        type='warning'
        style={{width: '400px', display: 'inline-block', color: 'black', backgroundColor: '#FFCD00', border: '1px solid black', fontSize: '40px'}}
    />
    <h2><u><a style={{color: '#A84F31'}} href="https://apps.apple.com/us/app/boggle-solve/id1496483167">Mobile app here!</a></u></h2>
    {user && 
      <>
      <p>Welcome, {user.displayName} ({user.email})<TextInput promptText="Change Nick Name??" field="name" user={user} /></p>
      </>
    }
    <br/><br/>
    <button onClick={ toggleLocalPlayerGame }> { isCurrentlyPlayingGame ? ('End Game') : ('New Local Game') } </button>
    <br/><br/>
    {user === null &&
      <LoginButton setUser={(user) => setUser(user)} />
    }
    {user !== null && !didPressLoadChallenges &&
      <>
      <button onClick={ loadChallenges }>Load Challenges</button>
      <ChallengesResponse setChallengeData={setChallengeData}/>
      </>
    }
    {user !== null && challengeData.length > 0 && didPressLoadChallenges &&
      challengeData.map((data) => {
        return (<div key={data.name}>
          <button onClick={() => toggleChallengeGame(data)}>
            {data.name} (world record: {data.hiscore})
          </button><br/><br/>
        </div>) 
      })
    }
    {isCurrentlyPlayingGame && grid ? (<FullGameBoard grid={grid} user={user} singluarChallengeData={singluarChallengeData}/>) : (<div></div>)}
  </>);

}

export default App;
