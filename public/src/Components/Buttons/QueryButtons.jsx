import React from 'react';
import './QueryButton.css';

const QueryButtons = ({ handleQueryData, handleResetData, submitButtonDisabled,resetButtonDisabled }) => {
    return (
        <div className="queryDiv-button">
            <button onClick={() => handleQueryData()} disabled={submitButtonDisabled} style={{
                 opacity:`${submitButtonDisabled ? "0.5" : "1"}`,
                pointerEvents:`${submitButtonDisabled ? "none" : "auto"}`
            }} >Submit</button>
            <button onClick={() => handleResetData()} disabled={resetButtonDisabled} style={{
                opacity:`${resetButtonDisabled ? "0.5" : "1"}`,
                pointerEvents:`${resetButtonDisabled ? "none" : "auto"}`
            }} >Reset</button>
        </div>
    )
}

export default QueryButtons