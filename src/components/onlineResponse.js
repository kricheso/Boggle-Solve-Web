import React, { useState, useEffect } from 'react'; 
import firebase from 'firebase';

function OnlineResponse(props) {

    const [user1Id, setUser1Id] = useState(null);
    const [user2Id, setUser2Id] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.firestore().collection("multiplayer").doc(props.onlineCode).get().then(document=> {
            if(document.data() === undefined) {
                setP1Id(null);
                setP2Id(null);
                return;
            }
            setUser1Id(document.data().user1Id)
            setUser2Id(document.data().user2Id)
        });
        return () => unsubscribe() 
    }, [])

  return (<>
    {user1Id && user2Id &&
        <FullGameBoard grid={props.grid} online={true}/>
    }
  </>);

 }

export default OnlineResponse;