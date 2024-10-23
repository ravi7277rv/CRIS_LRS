import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { operatorsList } from '../../../Templates/Template';
import { updateValues, areAllValuesSelected, queryAndDisplayFeatures } from '../../Utils/Functions';
import UpArrowButton from '../../Buttons/UpArrowButton';
import QueryButtons from '../../Buttons/QueryButtons';
const TrackQuallityQuery = ({ layer, newMapObj, startLoaderForQueryBuilder, stopLoaderForQueryBuilder }) => {
    let view = newMapObj.newView;
    let id = newMapObj.id;
    const operatorRef = useRef(null);
    const [operatorDropdown, setOperatorDropdown] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState("");
    const [inputValue, setInputValue] = useState("");
    const gradeOfSteelRef = useRef(null);
    const [gradeOfSteelDropdown, setGradeOfSteelDropdown] = useState(false);
    const [gradeOfSteelValuesFromLayer, setGradeOfSteelValuesFromLayer] = useState([]);
    const [selectedGradeOfSteelValues, setSelectedGradeOfSteelValues] = useState([]);
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
    // #region Grade of Steel functionality start here
    const handleGradeOfSteelDropdown = (e) => {
        e.preventDefault()
        setOperatorDropdown(false);
        setGradeOfSteelDropdown(!gradeOfSteelDropdown);
    };
    const closeGradeOfSteelDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setGradeOfSteelDropdown(false);
    }
    useEffect(() => {
        const gradeOfSteelData = async () => {
            let query = layer.createQuery();
            query.where = "loc_error = 'NO ERROR' OR loc_error = 'PARTIAL MATCH FOR THE FROM-MEASURE' OR loc_error = 'PARTIAL MATCH FOR THE TO-MEASURE' OR loc_error = 'PARTIAL MATCH FOR THE FROM-MEASURE AND TO-MEASURE' ";
            query.outFields = ["performance"];
            const result = await layer.queryFeatures(query);
            const uniqueValues = new Set();
            result.features.forEach((feature) => {
                const attributeValue = feature.attributes["performance"];
                if (attributeValue) {
                    const valueObject = { value: attributeValue, checked: true };
                    uniqueValues.add(JSON.stringify(valueObject));
                }
            });
            const uniqueValuesArray = Array.from(uniqueValues).map(item => JSON.parse(item));
            const comparator = (a, b) => {
                if (typeof a.value === 'number' && typeof b.value === 'number') {
                    return a.value - b.value;
                } else if (typeof a.value === 'string' && typeof b.value === 'string') {
                    return a.value.localeCompare(b.value);
                }
                else {
                    return String(a.value).localeCompare(String(b.value));
                }
            };
            const sortedValues = uniqueValuesArray.sort(comparator);
            setGradeOfSteelValuesFromLayer([{ value: "All", checked: true }, ...sortedValues]);
            setSelectedGradeOfSteelValues(sortedValues.map(v => v.value));
        }
        gradeOfSteelData();
    }, []);
    const handleGradeOfSteelValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(
            selectedValue,
            isChecked,
            gradeOfSteelValuesFromLayer,
            selectedGradeOfSteelValues
        );
        setGradeOfSteelValuesFromLayer(updatedValuesFromLayer);
        setSelectedGradeOfSteelValues(selectedValues);
    };
    //#endregion
    //Querying the data 
    let storedQueryObject;
    let cQuery;
    const handleQueryData = async () => {
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        if (!selectedOperator && !inputValue && selectedGradeOfSteelValues.length === 0) {
            return toast("One or more field value is empty");
        };
        if (selectedGradeOfSteelValues.length === 0) {
            if (!selectedOperator || !inputValue) {
                return toast("Missing operator or input value");
            };
        }
        startLoaderForQueryBuilder(id);
        setSubmitButtonDisabled(true);
        let speedQuery = "";
        let trackQuallityQuery = "";
        let finalQuery = "";
        if (selectedOperator && inputValue) {
            speedQuery = `sectionalspeed ${selectedOperator} ${inputValue}`;
        }
        if (selectedGradeOfSteelValues.length !== 0) {
            trackQuallityQuery = "performance in ('" + selectedGradeOfSteelValues.map(sr => sr).join("','") + "')";
        }
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (layer) {
            // finalQuery = [speedQuery, trackQuallityQuery].filter(Boolean).join(" AND ");
            finalQuery = cQuery !== "" ?
                [speedQuery, trackQuallityQuery, cQuery].filter(Boolean).join(" AND ") :
                [speedQuery, trackQuallityQuery].filter(Boolean).join(" AND ");
            if (storedQueryObject) {
                const updatedQueryObject = storedQueryObject.map(item =>
                    item.id === 10 ? { ...item, query: finalQuery } : item
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
        setSelectedGradeOfSteelValues([]);
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (storedQueryObject) {
            const updatedQueryObject = storedQueryObject.map(item =>
                item.id === 10 ? { ...item, query: "" } : item
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
        <div className="queryDiv" style={{ width: "347px" }}>
            <div className="queryDiv-heading">
                <h6>Query Builder</h6>
            </div>
            <div className="queryDiv-field">
                <span>Speed (Kmph) :</span>
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
            <div className="queryDiv-field">
                <span>Track Quality :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleGradeOfSteelDropdown} ref={gradeOfSteelRef} >
                    <button>
                        {selectedGradeOfSteelValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(gradeOfSteelValuesFromLayer, selectedGradeOfSteelValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedGradeOfSteelValues.map((sv, index) => (
                                        <span key={index} className='displayValue'>{sv}</span>
                                    ))
                                )}
                            </>
                        ) : (
                            <span>Select Value</span>
                        )}
                    </button>
                    <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z" fill="#000000" />
                    </svg>
                </div>
                {
                    gradeOfSteelDropdown &&
                    <div className="dropdownOption increaseDropdownWidth">
                        <div className="lableDiv">
                            {
                                gradeOfSteelValuesFromLayer && gradeOfSteelValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleGradeOfSteelValue(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeGradeOfSteelDropdown} />
                    </div>
                }
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

export default TrackQuallityQuery