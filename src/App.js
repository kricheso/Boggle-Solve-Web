import React, { useState, useEffect } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Alert } from 'antd';
import LoginButton from './components/loginButton.js';
import FullGameBoard from './components/fullGameBoard';
import ChallengesResponse from './components/challengesResponse';
import OnlineResponse from './components/onlineResponse';
import firebase from 'firebase';

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

  const [randomOnlineGrid, setRandomOnlineGrid] = useState(null);
  const [onlineCode, setOnlineCode] = useState(null);
  const [onlineCodeToJoin, setOnlineCodeToJoin] = useState(null);
  const [onlineP1, setOnlineP1] = useState(null);
  const [onlineP2, setOnlineP2] = useState(null);
  const [isInOnlineGame, setIsInOnlineGame] = useState(false);

  // ===================
  // MARK: - Use Effects
  // ===================

  useEffect(() => {
    console.log("First Render");
  }, []);

  useEffect(() => {
    setOnlineCode(null);
  }, [isCurrentlyPlayingGame, user]);

  // ===============
  // MARK: Functions
  // ===============

  function toggleLocalPlayerGame() {
    if(isCurrentlyPlayingGame) {
      setDidPressLoadChallenges(false);
    }
    setIsCurrentlyPlayingGame(!isCurrentlyPlayingGame);
    setSingluarChallengeData(null);
    setGrid(generateGrid());
    setOnlineCodeToJoin(null);
  }

  function toggleChallengeGame(e) {
    setIsCurrentlyPlayingGame(!isCurrentlyPlayingGame);
    setSingluarChallengeData(e);
    setGrid(stringToGrid(e.grid));
  }

  function loadChallenges() {
    setDidPressLoadChallenges(true);
  }

  function logout() {
    firebase.auth().signOut().then(function() {
      console.log("Logged out.");
      setUser(null);
    }).catch(function(error) {
      console.log(error);
    });
  }

  function createRoom() {
    if (user == null) { return; }
    console.log("Hi");
    let randomGrid = generateGrid();
    let randomString = Math.random().toString(36).substring(7);
    setRandomOnlineGrid(randomGrid);
    setOnlineCode(randomString);
    firebase.firestore().collection("multiplayer").doc(randomString).set({
      "grid": gridToString(randomGrid),
      "user1Id": user.uid,
      "user1Score": 0,
      "user2Id": "",
      "user2Score": 0
    }).catch((error) => {
      console.log(error)
      return;
    });
    setOnlineP1(user.uid);
  }

  function joinRoom() {
    if (user == null) { return; }
    const promptResponse = prompt("Enter room code!");
    if(promptResponse === null) { return; }

    firebase.firestore().collection("multiplayer").doc(promptResponse).get().then(document=> {
      if(document.data() === undefined) {
        alert("Bro that that is invalid code!");
      } else {
        // We have a valid code
        firebase.firestore().collection("multiplayer").doc(promptResponse).set({
          "user2Id": user.uid,
        }, { merge: true }).catch((error) => {
          console.log(error)
          return;
        });
        setOnlineCodeToJoin(promptResponse);
        setOnlineP2(user.uid);
      }
    });
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
        grid[row][col] = chars[SIZE * row + col];
        if (grid[row][col] === "Q") grid[row][col] = "Qu";
      }
    }
    return grid;
  }

  /**
   * @return {string}
   */
  function gridToString(g) {
    let result = "";
    for(const array of g) {
      for(const element of array) {
        let char = element;
        if (char === "Qu") {
          char = "Q"
        }
        result += char;
      }
    }
    return result;
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
    {user && isCurrentlyPlayingGame &&
      <div>Welcome, {user.displayName} ({user.email})</div>
    }
    {user && !isCurrentlyPlayingGame &&
      <div>Welcome, {user.displayName} ({user.email})<button onClick={ logout }>Logout</button></div>
    }
    <br/><br/>
    <button onClick={ toggleLocalPlayerGame }> { isCurrentlyPlayingGame ? ('Main Menu') : ('New Local Game') } </button>
    <br/><br/>
    {user !== null && !isCurrentlyPlayingGame &&
    <>
      <button onClick={ createRoom }>Create New Multiplayer Room</button>
      <br/>
      {onlineCode &&
        <>
        <p>Tell your friend to join with the code: <b>{onlineCode}</b><br/> The game will start automatically when the other player is ready.</p>
        </>
      }
    </>
    }
    {onlineP1 !== null && onlineCode !== null &&
      <>
      <p>Don't Boggle and Drive</p>
      <OnlineResponse grid={randomOnlineGrid} onlineCode={onlineCode} isPlayer1={true}></OnlineResponse>
      </>
    }
    {user !== null && !isCurrentlyPlayingGame &&
      <>
      <br/>
      <button onClick={ joinRoom }>Join Existing Multiplayer Room</button>
      {onlineCodeToJoin &&
        <>
        <p>Don't Boggle and Drive</p>
        <OnlineResponse grid={generateGrid()} onlineCode={onlineCodeToJoin} isPlayer1={false}></OnlineResponse>
        </>
      }
      </>
    }

    {user === null && !isCurrentlyPlayingGame &&
      <LoginButton setUser={(user) => setUser(user)} />
    }
    <br/><br/>
    {user !== null && !didPressLoadChallenges && !isCurrentlyPlayingGame &&
      <>
      <button onClick={ loadChallenges }>Load Challenges</button>
      <ChallengesResponse setChallengeData={setChallengeData}/>
      </>
    }
    {user !== null && challengeData.length > 0 && didPressLoadChallenges && !isCurrentlyPlayingGame &&
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
