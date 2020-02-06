import React, { useState, useEffect } from 'react';
import Grid from './grid';
import AlreadyUsed from './alreadyUsed';
import { useFormik } from 'formik';
import { findWords, generateTrie } from '../boggle_solver';
import jsonDictionary from '../full-wordlist';
import 'antd/dist/antd.css';
import {Col, Row} from "antd";

function FullGameBoard(props) {

    // ==================
    // MARK: - Use States
    // ==================

    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [lastWordInputted, setLastWordInputted] = useState("");
    const [isDisplayingAlreadyUsedWarning, setIsDisplayingAlreadyUsedWarning] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(new Set());
    const [validWords, setValidWords] = useState(new Set());
    const [dictionary, setDictionary] = useState(null);

    // =================
    // MARK: - Constants
    // =================

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: { word: "" },
        onSubmit: (values, actions) => {
            // Setting twice to make sure the use effect is triggered.
            setLastWordInputted("");
            setLastWordInputted(values.word.toLowerCase());
            formik.values.word = "";
            actions.setSubmitting(false);
            actions.resetForm();
        }
    });

    // ===================
    // MARK: - Use Effects
    // ===================

    useEffect(() => {
        setDictionary(generateTrie(jsonDictionary.words));
    }, []);

    useEffect(() => {
        if (timeLeft === 0) { return; }
        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => {
            clearInterval(intervalId);
        }
    }, [timeLeft]);

    useEffect(() => {
        if (props.grid === null || dictionary === null) { return; }
        setValidWords(findWords(props.grid, dictionary));
    }, [props.grid, dictionary]);

    useEffect(() => {
        if (validWords.has(lastWordInputted)) {
            if (correctAnswers.has(lastWordInputted)) {
                setIsDisplayingAlreadyUsedWarning(true);
                return;
            }
            setCorrectAnswers(correctAnswers.add(lastWordInputted));
            setScore(score + evaluateScore(lastWordInputted))
        }
        setIsDisplayingAlreadyUsedWarning(false);
    }, [lastWordInputted, correctAnswers, validWords]);

    // ===============
    // MARK: Functions
    // ===============

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

    function evaluateScore(word) {
        switch(word.length) {
            case 0: return 0;
            case 1: return 0;
            case 2: return 0;
            case 3: return 100;
            case 4: return 300;
            case 5: return 600;
            case 6: return 1000;
            case 7: return 1500;
            case 8: return 2100;
            case 9: return 2800;
            default: return 5000;
        }
    }

    function stringify(collection) {
        let result = '';
        collection.forEach(str => {
            result += str + '\n';
        });
        return result;
    }

    function toFormattedArray(array) {
        let sortedArray = array.sort();
        let result = [];
        let myArray = [];
        let count = 0;
        for(const element of sortedArray) {
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

    // =========
    // MARK: JSX
    // =========

    return (<>
        <div>
            <div>Score: {score}</div>
            <div>Time: {timeLeft}</div>
            {isDisplayingAlreadyUsedWarning && <AlreadyUsed word={lastWordInputted}></AlreadyUsed>}
        </div>

        {timeLeft !== 0 ? (
            <div>
                <Grid grid={props.grid}></Grid>
                <form onSubmit={formik.handleSubmit} id='wordInput'>
                    <label htmlFor="word"></label>
                    <input
                        autoComplete="off"
                        id="word"
                        name="word"
                        type="word"
                        onChange={formik.handleChange}
                        value={formik.values.word}
                    />
                    <button type="submit">Submit</button>
                </form>
                <div><br/></div>
                <h2 style={{width: '60%', margin: '0 20% 0 20%'}}>Correct Answers: { stringify(correctAnswers) }</h2>
            </div>
        ) : (
            <div>
                <h2><u><b>Remaining Answers:</b></u></h2>
                <div><br/></div>
                <h3>
                    {toFormattedArray(Array.from(difference(validWords, correctAnswers))).map(function(element, i) {
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
            </div>
        )}
    </>);

}

export default FullGameBoard;
