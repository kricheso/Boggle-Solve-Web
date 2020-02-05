import React, { useState, useEffect } from 'react';
import Grid from './components/grid';
import AlreadyUsed from './components/alreadyUsed';
import './App.css';
import { useFormik } from 'formik';
import {findWords, generateTrie} from './boggle_solver';
import jsonDictionary from './full-wordlist';
import { useTimer } from 'react-timer-hook';
import { Row, Col } from 'antd';
import 'antd/dist/antd.css';
import { Alert } from 'antd';
import FullGameBoard from './components/fullGameBoard'

function App() {

  const [boardIsVisible, setBoardIsVisible] = useState(false);
  const [word, setWord] = useState('');
  const [enteredWord, setEnteredWord] = useState('');
  const [alreadyEntered, setAlreadyEntered] = useState(true);
  const [correctAnswers, setCorrectAnswers] = useState(new Set());
  const [gameGrid, setGameGrid] = useState(null);
  const [sampleGrid, setSampleGrid] = useState(null);
  const [validWords, setValidWords] = useState(new Set());
  const [dictionary, setDictionary] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  function MyTimer({ expiryTimestamp }) {
    const {
      seconds
    } = useTimer({
      expiryTimestamp, onExpire: () => {
        console.warn('onExpire called');
        toggleBoard(!boardIsVisible);
      }
    });
    return (
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '50px'}}>
            Time: <span>{seconds}</span>
          </div>
        </div>
    );
  }

  const formik = useFormik({
    initialValues: {
      word: '',
    },
    onSubmit: (values, actions) => {
      setEnteredWord("");
      setEnteredWord(values.word.toLowerCase());
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
      const time = new Date();
      time.setSeconds(time.getSeconds() + 60);
      setTimeLeft(time);
      const newGrid = generateGrid();
      setCorrectAnswers(new Set());
      setValidWords(findWords(newGrid, dictionary));
    } else {
      formik.handleSubmit();
      formik.handleSubmit();
      setEnteredWord('');
      setWord('');
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
    generateSampleGrid();
    return () => {};
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

  function generateSampleGrid() {
    let matrix = [
      ["T", "E", "I", "D", "O"],
      ["A", "Z", "A", "E", "S"],
      ["O", "M", "N", "N", "C"],
      ["Y", "G", "I", "I", "E"],
      ["H", "F", "M", "D", "N"]
    ];
    setSampleGrid(matrix);
    return matrix;
  }

  function arrayToFormattedStr(arr) {
    let theStr = '';
    arr.forEach(str => {
      theStr += str + '\n';
    });
    return theStr;
  }

  function toNestedArray(bro) {
    let broo = bro.sort();
    let result = [];
    let myArray = [];
    let count = 0;
    for(const element of broo) {
      myArray.push(element);
      count += 1;
      if(count === 6) {
        result.push(myArray);
        myArray = [];
        count = 0;
      }
    }
    return result;
  }

  return (<>
    <div><br/></div>
    <Alert
        message="Boggle Solve Web"
        type='warning'
        style={{width: '400px', display: 'inline-block', color: 'black', backgroundColor: '#FFCD00', border: '1px solid black', fontSize: '40px'}}
    />
    <div><br/></div>
    <h2><u><a style={{color: '#A84F31'}} href="https://apps.apple.com/us/app/boggle-solve/id1496483167">Mobile app here!</a></u></h2>
    <div><br/></div>
    {boardIsVisible ?
        (<div>
          <MyTimer expiryTimestamp={timeLeft} />
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
          <button type="submit">Submit</button>
        </form>
          <div><br/></div>

        <h2 style={{width: '60%', margin: '0 20% 0 20%'}}>Correct Answers: {
          arrayToFormattedStr(Array.from(correctAnswers))
        }</h2>

      </div>) :
        <div>
        </div>
      }
    {validWords.size > 0 && !boardIsVisible ?<>
          <h2><u><b>Remaining Answers:</b></u></h2>
          <div><br/></div>
        <h3>
          {toNestedArray(Array.from(difference(validWords, correctAnswers))).map(function(element, i) {
            return(<Row style={{width: '60%', fontSize: '12px', margin: '0 20% 0 20%'}}>
              <Col span={4}>{element[0]}</Col>
              <Col span={4}>{element[1]}</Col>
              <Col span={4}>{element[2]}</Col>
              <Col span={4}>{element[3]}</Col>
              <Col span={4}>{element[4]}</Col>
              <Col span={4}>{element[5]}</Col>
            </Row>);
          })}
        </h3>
        </>
        :
        <div></div>
    }


    Hi!!

    {sampleGrid ? (<FullGameBoard grid={sampleGrid}/>) : (<div>fd</div>)}

  </>);

}

export default App;
