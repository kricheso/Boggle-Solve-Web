import React from 'react';

function AlreadyUsed(props) {
    return (<>
        <div>
            <h2>
                {props.word} is already used!
            </h2>
        </div>
    </>);
}

export default AlreadyUsed;