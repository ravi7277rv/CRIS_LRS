import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { operatorsList, deffinitionExpression } from '../../../Templates/Template';
import { updateValues, areAllValuesSelected, queryAndDisplayFeatures } from '../../Utils/Functions';
import UpArrowButton from '../../Buttons/UpArrowButton';
import QueryButtons from '../../Buttons/QueryButtons';
import globalUrlConfig from '../../../BaseUrlConfig';

const RailSectionQuery = ({ layer, newMapObj, startLoaderForQueryBuilder, stopLoaderForQueryBuilder }) => {
    let view = newMapObj.newView;
    let id = newMapObj.id;
    const operatorRef = useRef(null);
    const railSectionRef = useRef(null);
    const gradeOfSteelRef = useRef(null);
    const [operatorDropdown, setOperatorDropdown] = useState(false);
    const [railSectionDropdown, setRailSectionDropdown] = useState(false);
    const [gradeOfSteelDropdown, setGradeOfSteelDropdown] = useState(false);
    const [specialRouteDropdown, setSpecialRouteDropdown] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [railSectionValuesFromLayer, setRailSectionValuesFromLayer] = useState([]);
    const [gradeOfSteelValuesFromLayer, setGradeOfSteelValuesFromLayer] = useState([]);
    const [specailRouteValuesFromLayer, setSpecailRouteValuesFromLayer] = useState([]);
    const [selectedRailSectionValues, setSelectedRailSectionValues] = useState([]);
    const [selectedGradeOfSteelValues, setSelectedGradeOfSteelValues] = useState([]);
    const [selectedSpecailRouteValues, setSelectedSpecailRouteValues] = useState([]);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [resetButtonDisabled, setResetButtonDisabled] = useState(true);

    //Binding the data to the QueryBuilder
    useEffect(() => {
        const bindRailSectionDatas = async () => {
            try {
                const response = await fetch(`${globalUrlConfig.REACT_APP_API_BASE_URL}/getRailSectionData`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                const sortedRailSections = result.data.railSection.map(rs => ({ value: rs, checked: true }));
                setRailSectionValuesFromLayer([{ value: "All", checked: true }, ...sortedRailSections]);
                setSelectedRailSectionValues(result.data.railSection.map(rs => rs));
                const sortedGradeOfSteel = result.data.gradeOfSteel.map(gs => ({ value: gs, checked: true }));
                setGradeOfSteelValuesFromLayer([{ value: "All", checked: true }, ...sortedGradeOfSteel]);
                setSelectedGradeOfSteelValues(result.data.gradeOfSteel.map(gs => gs));
                const sortedFlawDetected = result.data.typeOfRoute.map(uc => ({ value: uc, checked: true }));
                setSpecailRouteValuesFromLayer([{ value: "All", checked: true }, ...sortedFlawDetected]);
                setSelectedSpecailRouteValues(result.data.typeOfRoute.map(uc => uc));
            } catch (err) {
                console.log(err)
            } finally {
                //
            }
        }
        bindRailSectionDatas();
    }, []);

    // Operator Selecting functionality start here
    const handleOperatorDropdown = () => {
        setOperatorDropdown(!operatorDropdown);
        setRailSectionDropdown(false);
        setGradeOfSteelDropdown(false);
    };
    const handleOperatorSelect = (ops) => {
        let selectedOperator = ops.value;
        setSelectedOperator(selectedOperator);
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (operatorRef.current && !operatorRef.current.contains(event.target)) {
                setTimeout(() => {
                    setOperatorDropdown(false);
                }, 1);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);
    //#region Type of Rail 
    const handleRailSectionDropdown = (e) => {
        e.preventDefault()
        setOperatorDropdown(false);
        setRailSectionDropdown(!railSectionDropdown);
        setGradeOfSteelDropdown(false);
    };
    const closeRailSectionDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setRailSectionDropdown(false);
    }
    const handleRailSectionValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(selectedValue, isChecked, railSectionValuesFromLayer, selectedRailSectionValues);
        setRailSectionValuesFromLayer(updatedValuesFromLayer);
        setSelectedRailSectionValues(selectedValues)
    };
    //#endregion
    // #region Grade of Steel functionality start here
    const handleGradeOfSteelDropdown = (e) => {
        e.preventDefault()
        setOperatorDropdown(false);
        setRailSectionDropdown(false);
        setGradeOfSteelDropdown(!gradeOfSteelDropdown);
    };
    const closeGradeOfSteelDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setGradeOfSteelDropdown(false)
    }
    const handleGradeOfSteelValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(selectedValue, isChecked, gradeOfSteelValuesFromLayer, selectedGradeOfSteelValues);
        setGradeOfSteelValuesFromLayer(updatedValuesFromLayer);
        setSelectedGradeOfSteelValues(selectedValues);
    };
    //#endregion
    // #region Specail Route functionality start here
    const handleSpecialRouteDropdown = (e) => {
        e.preventDefault()
        setOperatorDropdown(false);
        setRailSectionDropdown(false);
        setGradeOfSteelDropdown(false);
        setSpecialRouteDropdown(!specialRouteDropdown);
    };
    const closeSpecialRouteDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSpecialRouteDropdown(false)
    }

    const handleSpecialRouteValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(selectedValue, isChecked, specailRouteValuesFromLayer, selectedSpecailRouteValues);
        setSpecailRouteValuesFromLayer(updatedValuesFromLayer);
        setSelectedSpecailRouteValues(selectedValues);
    };

    //#endregion
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
        if (!selectedOperator && !inputValue && selectedRailSectionValues.length === 0 && selectedGradeOfSteelValues.length === 0) {
            return toast("One or more field value is empty");
        };
        if (selectedRailSectionValues.length === 0 && selectedGradeOfSteelValues.length === 0) {
            if (!selectedOperator || !inputValue) {
                return toast("Missing operator or input value");
            };
        }
        startLoaderForQueryBuilder(id);
        setSubmitButtonDisabled(true);
        let railSectionQuery = "";
        let gradeOfSteelQuery = "";
        let specialRouteQuery = "";
        let accumulatedGmtQuery = "";
        let finalQuery = "";
        if (selectedRailSectionValues.length > 0) {
            railSectionQuery = "rail_section in ('" + selectedRailSectionValues.map(sr => sr).join("','") + "')";
        }
        if (selectedGradeOfSteelValues.length > 0) {
            gradeOfSteelQuery = "grade_of_steel in ('" + selectedGradeOfSteelValues.map(sr => sr).join("','") + "')";
        }
        if (selectedSpecailRouteValues.length > 0) {
            specialRouteQuery = "type_of_route in ('" + selectedSpecailRouteValues.map(sr => sr).join("','") + "')";
        }
        if (selectedOperator && inputValue) {
            accumulatedGmtQuery = `accumulated_gmt ${selectedOperator} ${inputValue}`;
        }
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (layer) {
            // finalQuery = [railSectionQuery, gradeOfSteelQuery, accumulatedGmtQuery].filter(Boolean).join(" AND ");
            finalQuery = cQuery !== "" ?
                [railSectionQuery, gradeOfSteelQuery, accumulatedGmtQuery, specialRouteQuery, cQuery].filter(Boolean).join(" AND ") :
                [railSectionQuery, gradeOfSteelQuery, accumulatedGmtQuery, specialRouteQuery].filter(Boolean).join(" AND ");
            if (storedQueryObject) {
                const updatedQueryObject = storedQueryObject.map(item =>
                    item.id === 2 ? { ...item, query: finalQuery } : item
                );
                sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
            }
            if (!finalQuery)
                finalQuery = "1=1";
            layer.definitionExpression = finalQuery;
            queryAndDisplayFeatures(id, layer, finalQuery, view, toast, stopLoaderForQueryBuilder)
        }
        setResetButtonDisabled(false);
        setSubmitButtonDisabled(false);
    };
    const handleResetData = async () => {
        startLoaderForQueryBuilder(id);
        setResetButtonDisabled(true);
        setInputValue("");
        setSelectedOperator("");
        setSelectedGradeOfSteelValues([]);
        setSelectedRailSectionValues([]);
        setSelectedSpecailRouteValues([])
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (storedQueryObject) {
            const updatedQueryObject = storedQueryObject.map(item =>
                item.id === 2 ? { ...item, query: "" } : item
            );
            sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
        }
        if (cQuery) {
            layer.definitionExpression = cQuery;
            queryAndDisplayFeatures(undefined, layer, cQuery, view);
        } else {
            layer.definitionExpression = "1=1";
            newMapObj.newView.extent = layer.fullExtent;
        }
        setGradeOfSteelValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        setRailSectionValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        setSpecailRouteValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        stopLoaderForQueryBuilder(id);
    }
    return (
        <div className="queryDiv">
            <div className="queryDiv-heading">
                <h6>Query Builder</h6>
            </div>
            <div className="queryDiv-field">
                <span>Rail Section :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleRailSectionDropdown} ref={railSectionRef} >
                    <button>
                        {selectedRailSectionValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(railSectionValuesFromLayer, selectedRailSectionValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedRailSectionValues.map((sv, index) => (
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
                    railSectionDropdown &&
                    <div className="dropdownOption increaseDropdownWidth">
                        <div className="lableDiv">
                            {
                                railSectionValuesFromLayer && railSectionValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleRailSectionValue(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeRailSectionDropdown} />
                    </div>
                }
            </div>
            <div className="queryDiv-field">
                <span>Grade of Steel :</span>
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
            <div className="queryDiv-field">
                <span>Special Route :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleSpecialRouteDropdown} ref={gradeOfSteelRef} >
                    <button>
                        {selectedSpecailRouteValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(specailRouteValuesFromLayer, selectedSpecailRouteValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedSpecailRouteValues.map((sv, index) => (
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
                    specialRouteDropdown &&
                    <div className="dropdownOption increaseDropdownWidth">
                        <div className="lableDiv">
                            {
                                specailRouteValuesFromLayer && specailRouteValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleSpecialRouteValue(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeSpecialRouteDropdown} />
                    </div>
                }
            </div>
            <div className="queryDiv-field">
                <span>Accumulated GMT :</span>
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

export default RailSectionQuery