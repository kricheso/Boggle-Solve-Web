import React, { useState, useEffect } from 'react';
import Grid from './grid';
import AlreadyUsed from './alreadyUsed';
import { useFormik } from 'formik';
import { findWords, generateTrie } from '../boggle_solver';
import jsonDictionary from '../full-wordlist';
import { useTimer } from 'react-timer-hook';
import 'antd/dist/antd.css';

function FullGameBoard(props) {

    // ==================
    // MARK: - Use States
    // ==================

    const [word, setWord] = useState('');
    const [enteredWord, setEnteredWord] = useState('');
    const [alreadyEntered, setAlreadyEntered] = useState(true);
    const [correctAnswers, setCorrectAnswers] = useState(new Set());
    const [validWords, setValidWords] = useState(new Set());
    const [dictionary, setDictionary] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

    // =================
    // MARK: - Constants
    // =================

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

    // ===================
    // MARK: - Use Effects
    // ===================

    useEffect(() => {
        setDictionary(generateTrie(jsonDictionary.words));
        const time = new Date();
        time.setSeconds(time.getSeconds() + 10);
        setTimeLeft(time);
    }, []);

    useEffect(() => {
        if (props.grid === null || dictionary === null) { return }
        setValidWords(findWords(props.grid, dictionary));
    }, [props.grid, dictionary]);

    useEffect(() => {
        setWord(formik.values.word);
    } ,[formik.values]);

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
    }, [enteredWord, correctAnswers, validWords]);

    // ===============
    // MARK: Functions
    // ===============

    function MyTimer({ expiryTimestamp }) {
        const { seconds } = useTimer({
            expiryTimestamp, onExpire: () => {
                console.warn('onExpire called');
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

    function arrayToFormattedStr(arr) {
        let theStr = '';
        arr.forEach(str => {
            theStr += str + '\n';
        });
        return theStr;
    }

    // =========
    // MARK: JSX
    // =========

    return (<>
        {timeLeft !== 0 ?
            (
                <div>Timer!</div>
            ) : (
                <div>Ended!</div>
            )
        }
        <div>
            <MyTimer expiryTimestamp={timeLeft} />
            <h2>Last Word Entered: {enteredWord}</h2>
            {alreadyEntered && <AlreadyUsed word={enteredWord}></AlreadyUsed>}
        </div>
        <div><br/></div>
        <Grid grid={props.grid}></Grid>
        <div>
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
        </div>
    </>);

}

export default FullGameBoard;
