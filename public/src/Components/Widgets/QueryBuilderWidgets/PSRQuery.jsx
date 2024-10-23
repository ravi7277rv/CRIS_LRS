import React, { useState, useEffect, useRef, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { operatorsList } from '../../../Templates/Template';
import { queryAndDisplayFeatures } from '../../Utils/Functions';
import QueryButtons from '../../Buttons/QueryButtons';

const PSRQuery = ({ layer, newMapObj, startLoaderForQueryBuilder, stopLoaderForQueryBuilder }) => {
    // const { setScreenQueries } = useContext(UserContext)
    let view = newMapObj.newView;
    let id = newMapObj.id;
    const operatorRef = useRef(null);
    const [operatorDropdown, setOperatorDropdown] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [resetButtonDisabled, setResetButtonDisabled] = useState(true);

    // Operator Selecting functionality start here
    const handleOperatorDropdown = () => {
        setOperatorDropdown(!operatorDropdown);
    };
    const handleOperatorSelect = (ops) => {
        let selectedOperator = ops.value;
        setSelectedOperator(selectedOperator);

    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (operatorRef.current && !operatorRef.current.contains(event.target)) {
                setOperatorDropdown(false);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);
    const handleInputValueChange = (event) => {
        let inputValue = event.target.value;
        const numericRegex = /^-?\d*\.?\d*$/;
        if (numericRegex.test(inputValue)) {
            setInputValue(inputValue);
        } else {
            toast('Please enter a valid numeric value.');
        }
    };
    //Querying the data 
    let storedQueryObject;
    let cQuery;
    const handleQueryData = async () => {
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        if (!selectedOperator || !inputValue) {
            return toast("Please select Operator and enter value");
        }
        startLoaderForQueryBuilder(id);
        setSubmitButtonDisabled(true);
        let psrQuery = "";
        let finalQuery = "";
        if (selectedOperator && inputValue) {
            psrQuery = `psr ${selectedOperator} ${inputValue}`;
        }
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (layer) {
            finalQuery = cQuery !== "" ? [psrQuery, cQuery].filter(Boolean).join(" AND ") : psrQuery;
            if (storedQueryObject) {
                const updatedQueryObject = storedQueryObject.map(item =>
                    item.id === 1 ? { ...item, query: finalQuery } : item
                );
                sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
            }
            if (!finalQuery)
                finalQuery = "1=1";
            layer.definitionExpression = finalQuery;
            queryAndDisplayFeatures(id, layer, finalQuery, view, toast, stopLoaderForQueryBuilder);
        }
        setResetButtonDisabled(false);
        setSubmitButtonDisabled(false);
    };
    const handleResetData = async () => {
        startLoaderForQueryBuilder(id);
        setResetButtonDisabled(true);
        setSelectedOperator(""); 
        setInputValue("");
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (storedQueryObject) {
            const updatedQueryObject = storedQueryObject.map(item =>
                item.id === 1 ? { ...item, query: "" } : item
            );
            sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
        }
        if (cQuery) {
            layer.definitionExpression = cQuery;
            queryAndDisplayFeatures(undefined,layer, cQuery, view);
        } else {
            layer.definitionExpression = "1=1";
            newMapObj.newView.extent = layer.fullExtent;  
        }

        const layerView = await view.whenLayerView(layer);
        const handle = layerView.watch("updating", (updating) => {
            if (!updating) {
                stopLoaderForQueryBuilder(id);
                handle.remove();
            }
        });
    } 
    return (
        <div className="queryDiv" style={{ width: "350px" }}>
            <div className="queryDiv-heading">
                <h6>Query Builder</h6>
            </div>
            <div className="queryDiv-field">
                <span>PSR :</span>
                <div className="queryDiv-InputDropdownField">
                    <div className="queryDiv-field-btn" onClick={handleOperatorDropdown} ref={operatorRef}>
                        <button>{selectedOperator !== "" ? operatorsList.filter(o => o.value === selectedOperator)[0].label : "Select Operator"}</button>
                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z" fill="#000000" />
                        </svg>
                    </div>
                    {
                        operatorDropdown &&
                        <div className="dropdownOption operatorDropdown">
                            {
                                operatorsList && operatorsList.map((ops, index) => (
                                    <label key={index} onClick={() => handleOperatorSelect(ops)} className='operatorDisplay'>
                                        <span>{ops.label}</span>
                                    </label>
                                ))
                            }

                        </div>
                    }
                    <div className="inputDiv">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputValueChange}
                            placeholder='Value'
                        />
                    </div>
                </div>
            </div>
            <QueryButtons
                handleQueryData={handleQueryData}
                handleResetData={handleResetData}
                submitButtonDisabled={submitButtonDisabled}
                resetButtonDisabled={resetButtonDisabled}
            />
        </div>
    );
}
//style={{width:"132px", right:"105px"}}
export default PSRQuery