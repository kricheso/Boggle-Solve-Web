import React, { useState, useEffect } from 'react'; 
import firebase from 'firebase';

function DataService() {
    
    const [dataa, setData] = useState(["default value"]);

    useEffect(() => {
        setData(["Bro"]);
    }, [])

}

return <p>{dataa}</p>

export default DataService;