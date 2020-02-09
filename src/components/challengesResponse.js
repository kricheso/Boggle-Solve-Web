import React, { useState, useEffect } from 'react'; 
import firebase from 'firebase';

function ChallengesResponse() {

    // ==================
    // MARK: - Use States
    // ==================

    const [dataList, setDataList] = useState([]);

    // ===================
    // MARK: - Use Effects
    // ===================

    useEffect(() => {
        const unsubscribe = firebase.firestore().collection("challenges").onSnapshot((querySnapshot) => {
            var firestoreData = []; 
            querySnapshot.forEach(function(doc) {
                firestoreData.push({
                    id: doc.id,
                    hiscore: doc.data().hiscore,  
                }); 
            });
          setDataList(firestoreData);
        });
        return () => unsubscribe() 
    }, [])


    // =========
    // MARK: JSX
    // =========

    return (
    <div><ul>
    {dataList.map((data) => {
        return (<li key={data.id}>{data.id}, {data.hiscore}</li>) 
    })
    }
    </ul></div>);

 };

export default ChallengesResponse;