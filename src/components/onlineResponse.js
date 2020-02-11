import React, { useState, useEffect } from 'react'; 
import firebase from 'firebase';
import FullGameBoard from './fullGameBoard';

function OnlineResponse(props) {

    const [user1Id, setUser1Id] = useState(null);
    const [user2Id, setUser2Id] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.firestore().collection("multiplayer").doc(props.onlineCode).onSnapshot(snapshot=> {
            if(snapshot.data() === undefined) {
                setUser1Id(null);
                setUser2Id(null);
                return;
            }
            setUser1Id(snapshot.data().user1Id)
            setUser2Id(snapshot.data().user2Id)
        });
        return () => unsubscribe() 
    }, [])

  return (<>
    {user1Id && user2Id &&
        <>
        <FullGameBoard grid={props.grid} onlineCode={props.onlineCode} isPlayer1={props.isPlayer1}/>
        </>
    }
    {!user1Id || !user2Id &&
        <p>Waiting...</p>
    }
  </>);

 }

export default OnlineResponse;