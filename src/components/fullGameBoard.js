import React, { useState, useEffect } from 'react';
import Grid from './grid';
import AlreadyUsed from './alreadyUsed';
import { useFormik } from 'formik';
import { findWords, generateTrie } from '../boggle_solver';
import jsonDictionary from '../full-wordlist';
import 'antd/dist/antd.css';
import {Col, Row} from "antd";
import firebase from 'firebase';

function FullGameBoard(props) {

    // ==================
    // MARK: - Use States
    // ==================

    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [lastWordInputted, setLastWordInputted] = useState("");
    const [isDisplayingAlreadyUsedWarning, setIsDisplayingAlreadyUsedWarning] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(new Set());
    const [validWords, setValidWords] = useState(new Set());
    const [dictionary, setDictionary] = useState(null);
    const [usersHiscore, setUsersHiscore] = useState(null);
    const [worldRecord, setWorldRecord] = useState(null);
    const [oppenentsScore, setOppenentsScore] = useState(0);

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
        if(props.singluarChallengeData) {
            firebase.firestore().collection("challenges").doc(props.singluarChallengeData.id).get().then(document=> {
                setWorldRecord(document.data().hiscore);
            });
            firebase.firestore().collection("challenges").doc(props.singluarChallengeData.id).collection("scores").doc(props.user.uid).get().then(document=> {
                if(document.data() !== undefined) {
                    setUsersHiscore(document.data().score);
                } else {
                    firebase.firestore().collection("challenges").doc(props.singluarChallengeData.id).collection("scores").doc(props.user.uid).set({"score": 0});
                    setUsersHiscore(0);
                }
            });
        }
        if(props.isPlayer1 === true) {
            const unsubscribe = firebase.firestore().collection("multiplayer").doc(props.onlineCode).onSnapshot(snapshot=> {
                setOppenentsScore(snapshot.data().user2Score);
            });
            return () => unsubscribe() 
        } else if(props.isPlayer1 === false) {
            const unsubscribe = firebase.firestore().collection("multiplayer").doc(props.onlineCode).onSnapshot(snapshot=> {
                setOppenentsScore(snapshot.data().user1Score);
            });
            return () => unsubscribe() 
        }
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
            let newScore = score + evaluateScore(lastWordInputted);
            setScore(newScore);
            updateUsersScoreOnFirebaseIfNecessary(newScore);
            updateUsersScoreOnMultiplayerIfNecessary(newScore);
        }
        setIsDisplayingAlreadyUsedWarning(false);
    }, [lastWordInputted, correctAnswers, validWords]);

    // ===============
    // MARK: Functions
    // ===============

    function updateUsersScoreOnMultiplayerIfNecessary(score) {
        if(props.isPlayer1 === undefined) { return; }
        if(props.onlineCode === undefined || props.onlineCode === null) { return; }
        if(props.isPlayer1) {
            firebase.firestore().collection("multiplayer").doc(props.onlineCode).set({
                "user1Score": score
            }, { merge: true }).then(() => {
                console.log("Score written!"); 
            }).catch((error) => {
                console.error("Error adding document: ", error); 
            });
        } else {
            firebase.firestore().collection("multiplayer").doc(props.onlineCode).set({
                "user2Score": score
            }, { merge: true }).then(() => {
                console.log("Score written!"); 
            }).catch((error) => {
                console.error("Error adding document: ", error); 
            });
        }
    }

    function updateUsersScoreOnFirebaseIfNecessary(score) {
        if(props.singluarChallengeData === null || props.singluarChallengeData === undefined) { return; }
        if(props.user === null) { return; }
        if(usersHiscore === null) { return; }
        if(worldRecord === null) { return; }
        if(score > usersHiscore) {
            firebase.firestore().collection("challenges").doc(props.singluarChallengeData.id).collection("scores").doc(props.user.uid).set({
                "score": score
            }, { merge: true }).then(() => {
                console.log("Score written!"); 
                setUsersHiscore(score);
            }).catch((error) => {
                console.error("Error adding document: ", error); 
            });
            if (score > worldRecord) {
                firebase.firestore().collection("challenges").doc(props.singluarChallengeData.id).set({
                    "hiscore": score
                }, { merge: true }).then(() => {
                    console.log("Hiscore written!"); 
                    setUsersHiscore(score);
                }).catch((error) => {
                    console.error("Error adding document: ", error); 
                });
            }
        }
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
            {props.onlineCode !== undefined && <div>Oppenent's Score: {oppenentsScore}</div>}
            {props.singluarChallengeData && <div>Your Hiscore for this challenge: {usersHiscore}</div>}
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
