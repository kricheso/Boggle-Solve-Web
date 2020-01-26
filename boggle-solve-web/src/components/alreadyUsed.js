import React from 'react';

function AlreadyUsed(props) {
    return (<>
        <div>
            <h3>
                {props.word} is already used!
            </h3>
        </div>
    </>);
}

export default AlreadyUsed;