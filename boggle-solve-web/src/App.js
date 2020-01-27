import React, { useState, useEffect } from 'react';
import Grid from './components/grid';
import AlreadyUsed from './components/alreadyUsed';
import './App.css';
import { useFormik } from 'formik';
import {findWords, generateTrie} from './boggle_solver';
import jsonDictionary from './full-wordlist';

function App() {
  const [boardIsVisible, setBoardIsVisible] = useState(false);
  const [word, setWord] = useState('');
  const [enteredWord, setEnteredWord] = useState('');
  const [alreadyEntered, setAlreadyEntered] = useState(true);
  const [correctAnswers, setCorrectAnswers] = useState(new Set());
  const [gameGrid, setGameGrid] = useState(null);
  const [validWords, setValidWords] = useState(new Set());
  const [dictionary, setDictionary] = useState(null);

  const formik = useFormik({
    initialValues: {
      word: '',
    },
    onSubmit: (values, actions) => {
      setEnteredWord("");
      setEnteredWord(values.word);
      setWord('');
      formik.values.word = '';
      actions.setSubmitting(false);
      actions.resetForm();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    setWord(formik.values.word);
  } ,[formik.values]);

  function toggleBoard() {
    if(!boardIsVisible){
      const newGrid = generateGrid();
      setCorrectAnswers(new Set());
      setValidWords(findWords(newGrid, dictionary));
    } else {

    }
    setBoardIsVisible(!boardIsVisible);
  }

  function difference(setA, setB) {
    if(setA && setB) {
      let _difference = new Set(setA);
      for (const elem of setB) {
        _difference.delete(elem)
      }
      return _difference
    }
    return [];
  }

  // only runs once
  useEffect(() => {
    setDictionary(generateTrie(jsonDictionary.words));
  }, []);

  useEffect(() => {
    if(enteredWord === "") {
      setAlreadyEntered(false);
      return;
    }
    if(validWords.has(enteredWord)){
      if(!correctAnswers.has(enteredWord)) {
        let newCorrectAnswers = correctAnswers;
        newCorrectAnswers.add(enteredWord);
        setCorrectAnswers(newCorrectAnswers);
        setAlreadyEntered(false);
      } else {
        setAlreadyEntered(true);
      }
    } else {
      setAlreadyEntered(false);
    }
  }, [enteredWord]);

  function generateGrid() {
    // Returns a random 5x5 board, using the official letter distribution.
    // prettier-ignore
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
    setGameGrid(grid);
    return grid;
  };

  function arrayToFormattedStr(arr) {
    let theStr = '';
    arr.forEach(str => {
      theStr += str + '\n';
    });
    return theStr;
  }

  return (<>
    <h1>Boggle Solve Web</h1>
    <h2>(<a href="https://apps.apple.com/us/app/boggle-solve/id1496483167">Mobile app here!</a>)</h2>
    {boardIsVisible ?
        (<div>
        <h2>Last Word Entered: {enteredWord}</h2>
          {alreadyEntered && <AlreadyUsed word={enteredWord}></AlreadyUsed>}
      </div>) :
        <div></div>
    }
    <button onClick={toggleBoard}>{
      boardIsVisible ?
          ('End Game') :
          ('New Game')
    }</button>
    <div><br/></div>
    {
      boardIsVisible && gameGrid && <Grid grid={gameGrid}></Grid>
    }
    {boardIsVisible ?
        (<div>
          <h2>Current Word: {word}</h2>
        <form onSubmit={formik.handleSubmit} id='wordInput'>
          <label htmlFor="word"></label>
          <input
              id="word"
              name="word"
              type="word"
              onChange={formik.handleChange}
              value={formik.values.word}
          />
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>

        <h2>Correct Answers: {
          arrayToFormattedStr(Array.from(correctAnswers))
        }</h2>

      </div>) :
        <div>
        </div>
      }
    {validWords.size > 0 && !boardIsVisible ?
        <h3>Remaining Answers: {
          arrayToFormattedStr(Array.from(difference(validWords, correctAnswers)))
        }</h3>
        :
        <div></div>
    }
  </>);

}

export default App;
