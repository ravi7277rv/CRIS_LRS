import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { operatorsList } from '../../../Templates/Template';
import { updateValues, areAllValuesSelected } from '../../Utils/Functions';
import { loadModules } from 'esri-loader';
import UpArrowButton from '../../Buttons/UpArrowButton';
import QueryButtons from '../../Buttons/QueryButtons';
import globalUrlConfig from '../../../BaseUrlConfig';
const [
    geometry, geometryEngine, Point] = await loadModules(["esri/geometry", "esri/geometry/geometryEngine", "esri/geometry/Point"], { css: true });


const RailFractureQuery = ({ layer, newMapObj, startLoaderForQueryBuilder, stopLoaderForQueryBuilder }) => {
    let view = newMapObj.newView;
    let id = newMapObj.id;
    const operatorRef = useRef(null);
    const typeOfRailRef = useRef(null);
    const gradeOfSteelRef = useRef(null);
    const flawDetectedRef = useRef(null);
    const [operatorDropdown, setOperatorDropdown] = useState(false);
    const [typeOfRailDropdown, setTypeOfRailDropdown] = useState(false);
    const [gradeOfSteelDropdown, setGradeOfSteelDropdown] = useState(false);
    const [flawDetectedDropdown, setFlawDetectedDropdown] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [typeOfRailValuesFromLayer, setTypeOfRailValuesFromLayer] = useState([]);
    const [gradeOfSteelValuesFromLayer, setGradeOfSteelValuesFromLayer] = useState([]);
    const [flawDetectedValuesFromLayer, setFlawDetectedValuesFromLayer] = useState([]);
    const [selectedTypeOfRailValues, setSelectedTypeOfRailValues] = useState([]);
    const [selectedGradeOfSteelValues, setSelectedGradeOfSteelValues] = useState([]);
    const [selectedFlawDetectedValues, setSelectedFlawDetectedValues] = useState([]);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [resetButtonDisabled, setResetButtonDisabled] = useState(true);


    //Binding the data to the QueryBuilder
    useEffect(() => {
        const bindRailFractureDatas = async () => {
            try {
                const response = await fetch(`${globalUrlConfig.REACT_APP_API_BASE_URL}/getRailFractureData`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                const sortedRailSections = result.data.railSection.map(rs => ({ value: rs, checked: true }));
                setTypeOfRailValuesFromLayer([{ value: "All", checked: true }, ...sortedRailSections]);
                setSelectedTypeOfRailValues(result.data.railSection.map(rs => rs));
                const sortedGradeOfSteel = result.data.gradeOfSteel.map(gs => ({ value: gs, checked: true }));
                setGradeOfSteelValuesFromLayer([{ value: "All", checked: true }, ...sortedGradeOfSteel]);
                setSelectedGradeOfSteelValues(result.data.gradeOfSteel.map(gs => gs));
                const sortedFlawDetected = result.data.usfdClassification.map(uc => ({ value: uc, checked: true }));
                setFlawDetectedValuesFromLayer([{ value: "All", checked: true }, ...sortedFlawDetected]);
                setSelectedFlawDetectedValues(result.data.usfdClassification.map(uc => uc));
            } catch (err) {
                console.log(err)
            } finally {
                //
            }
        }
        bindRailFractureDatas();
    }, []);
    // Operator Selecting functionality start here
    const handleOperatorDropdown = () => {
        setOperatorDropdown(!operatorDropdown);
        setTypeOfRailDropdown(false);
        setGradeOfSteelDropdown(false);
        setFlawDetectedDropdown(false);
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
    //#region Type of Rail 
    const handleTypeOfRailDropdown = (e) => {
        e.preventDefault()
        setOperatorDropdown(false);
        setTypeOfRailDropdown(!typeOfRailDropdown);
        setGradeOfSteelDropdown(false);
        setFlawDetectedDropdown(false);
    };
    const closeTypeOfRailDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setTypeOfRailDropdown(false);
    }
    const handleTypeOfRailValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(
            selectedValue,
            isChecked,
            typeOfRailValuesFromLayer,
            selectedTypeOfRailValues
        );
        setTypeOfRailValuesFromLayer(updatedValuesFromLayer);
        setSelectedTypeOfRailValues(selectedValues)
    };

    //#endregion
    // #region Grade of Steel functionality start here
    const handleGradeOfSteelDropdown = (e) => {
        e.preventDefault()
        setOperatorDropdown(false);
        setTypeOfRailDropdown(false);
        setGradeOfSteelDropdown(!gradeOfSteelDropdown);
        setFlawDetectedDropdown(false);
    };
    const closeGradeOfSteelDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setGradeOfSteelDropdown(false);
    }
    const handleGradeOfSteelValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(selectedValue, isChecked, gradeOfSteelValuesFromLayer, selectedGradeOfSteelValues);
        setGradeOfSteelValuesFromLayer(updatedValuesFromLayer);
        setSelectedGradeOfSteelValues(selectedValues);
    };
    //#endregion
    // #region Whether Flaw Detected
    const handleFlawDetectedDropdown = (e) => {
        e.preventDefault()
        setOperatorDropdown(false);
        setTypeOfRailDropdown(false);
        setGradeOfSteelDropdown(false);
        setFlawDetectedDropdown(!flawDetectedDropdown);
    };
    const closeFlawDetectedDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFlawDetectedDropdown(false);
    }
    const handleFlawDetectedValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(
            selectedValue,
            isChecked,
            flawDetectedValuesFromLayer,
            selectedFlawDetectedValues
        );
        setFlawDetectedValuesFromLayer(updatedValuesFromLayer);
        setSelectedFlawDetectedValues(selectedValues)
    };

    // #endregion
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
    let years;
    const handleQueryData = async () => {
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        years = storedQueryObject.filter(f => f.id === id)[0].years;
        if (years.length === 0) {
            return toast("No yearwise data on map");
        }
        if (!selectedOperator && !inputValue && selectedTypeOfRailValues.length === 0 && selectedGradeOfSteelValues.length === 0 && selectedFlawDetectedValues.length === 0) {
            return toast("One or more field value is empty");
        };
        if (selectedTypeOfRailValues.length === 0 && selectedGradeOfSteelValues.length === 0 && selectedFlawDetectedValues.length === 0) {
            if (!selectedOperator || !inputValue) {
                return toast("Missing operator or input value");
            };
        }
        startLoaderForQueryBuilder(id);
        setSubmitButtonDisabled(true)
        let accumulatedGmtQuery = "";
        let typeOfRailQuery = "";
        let gradeOfSteelQuery = "";
        let flawDetectedQuery = "";
        let yearQuery = "";
        let finalQuery = "";
        if (selectedOperator && inputValue) {
            accumulatedGmtQuery = `accumulated_gmt ${selectedOperator} ${inputValue}`;
        }
        if (selectedTypeOfRailValues.length > 0) {
            typeOfRailQuery = "rail_section in ('" + selectedTypeOfRailValues.map(sr => sr).join("','") + "')";
        }
        if (selectedGradeOfSteelValues.length > 0) {
            gradeOfSteelQuery = "grade_of_steel in ('" + selectedGradeOfSteelValues.map(sr => sr).join("','") + "')";
        }
        if (selectedFlawDetectedValues.length > 0) {
            flawDetectedQuery = "usfd_classification in ('" + selectedFlawDetectedValues.map(sr => sr).join("','") + "')";
        }
        if (years.length !== 0) {
            yearQuery = "year in (" + years.join(",") + ")";
        }
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (layer) {
            finalQuery = cQuery !== "" ?
                [accumulatedGmtQuery, typeOfRailQuery, gradeOfSteelQuery, flawDetectedQuery, yearQuery, cQuery].filter(Boolean).join(" AND ") :
                [accumulatedGmtQuery, typeOfRailQuery, gradeOfSteelQuery, flawDetectedQuery, yearQuery].filter(Boolean).join(" AND ");
            if (storedQueryObject) {
                const updatedQueryObject = storedQueryObject.map(item =>
                    item.id === 4 ? { ...item, query: finalQuery } : item
                );
                sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
            }
            if (!finalQuery)
                finalQuery = "1=1";
            layer.definitionExpression = finalQuery;

            let query = layer.createQuery();
            query.where = finalQuery;
            query.returnGeometry = true;  // Ensure geometries are returned
            try {
                const result = await layer.queryFeatures(query);
                if (result.features.length !== 0) {
                    // Filter out features with invalid x and y coordinates
                    const validFeatures = result.features.filter(feature => {
                        const geometry = feature.geometry;
                        return geometry && ((geometry.type === "point" && geometry.x !== 0 && geometry.y !== 0) ||
                            (geometry.type !== "point" && geometry.extent));
                    });

                    if (validFeatures.length === 0) {
                        return toast("No valid features found");
                    }

                    const geometries = validFeatures.map(feature => feature.geometry);
                    let graphicsExtent;

                    if (geometries.length > 1) {
                        graphicsExtent = geometryEngine.union(geometries).extent;
                    } else if (geometries.length === 1) {
                        const pointGeometry = geometries[0];
                        const pointLat = pointGeometry.latitude;
                        const pointLon = pointGeometry.longitude;

                        const point = new Point({
                            latitude: pointLat,
                            longitude: pointLon,
                            spatialReference: { wkid: 4326 }
                        });

                        const buffer = 0.8;

                        graphicsExtent = new geometry.Extent({
                            xmin: point.longitude - buffer,
                            ymin: point.latitude - buffer,
                            xmax: point.longitude + buffer,
                            ymax: point.latitude + buffer,
                            spatialReference: { wkid: 4326 }
                        });
                    }
                    if (graphicsExtent) {
                        const expandedExtent = graphicsExtent.expand(1.2);
                        await view.goTo(expandedExtent);
                        stopLoaderForQueryBuilder(id);
                    }
                }
                else {
                    toast("No Features Found");
                    stopLoaderForQueryBuilder(id);
                }
            } catch (error) {
                console.log(`Error while querying features: ${error}`);
            }

        }
        setResetButtonDisabled(false);
        setSubmitButtonDisabled(false);
        setOperatorDropdown(false);
        setTypeOfRailDropdown(false);
        setGradeOfSteelDropdown(false);
        setFlawDetectedDropdown(false);
    };
    const handleResetData = async () => {
        startLoaderForQueryBuilder(id);
        setResetButtonDisabled(true);
        setSelectedOperator("");
        setInputValue("");
        setSelectedTypeOfRailValues([]);
        setSelectedGradeOfSteelValues([]);
        setSelectedFlawDetectedValues([]);
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        years = storedQueryObject.filter(f => f.id === id)[0].years;
        if (years.length !== 0) {
            let yearQuery = "year in (" + years.join(",") + ")";
            cQuery = [cQuery, yearQuery].filter(Boolean).join(" AND ");
        }
        if (storedQueryObject) {
            const updatedQueryObject = storedQueryObject.map(item =>
                item.id === 4 ? { ...item, query: "" } : item
            );
            sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
        }
        if (cQuery) {
            layer.definitionExpression = cQuery;
            let query = layer.createQuery();
            query.where = cQuery;
            query.returnGeometry = true;  // Ensure geometries are returned
            try {
                const result = await layer.queryFeatures(query);
                if (result.features.length !== 0) {
                    // Filter out features with invalid x and y coordinates
                    const validFeatures = result.features.filter(feature => {
                        const geometry = feature.geometry;
                        return geometry && ((geometry.type === "point" && geometry.x !== 0 && geometry.y !== 0) ||
                            (geometry.type !== "point" && geometry.extent));
                    });

                    if (validFeatures.length === 0) {
                        return toast("No valid features found");
                    }

                    const geometries = validFeatures.map(feature => feature.geometry);
                    let graphicsExtent;

                    if (geometries.length > 1) {
                        graphicsExtent = geometryEngine.union(geometries).extent;
                    } else if (geometries.length === 1) {
                        const pointGeometry = geometries[0];
                        const pointLat = pointGeometry.latitude;
                        const pointLon = pointGeometry.longitude;

                        const point = new Point({
                            latitude: pointLat,
                            longitude: pointLon,
                            spatialReference: { wkid: 4326 }
                        });

                        const buffer = 0.8;

                        graphicsExtent = new geometry.Extent({
                            xmin: point.longitude - buffer,
                            ymin: point.latitude - buffer,
                            xmax: point.longitude + buffer,
                            ymax: point.latitude + buffer,
                            spatialReference: { wkid: 4326 }
                        });
                    }
                    if (graphicsExtent) {
                        const expandedExtent = graphicsExtent.expand(1.2);
                        await view.goTo(expandedExtent);
                    }
                }
            } catch (error) {
                console.log(`Error while querying features: ${error}`);
            }
        } else {
            layer.definitionExpression = "1=1";
            newMapObj.newView.extent = layer.fullExtent;
        }
        setTypeOfRailValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        setGradeOfSteelValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        setFlawDetectedValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        stopLoaderForQueryBuilder(id);
    }
    return (
        <div className="queryDiv">
            <div className="queryDiv-heading">
                <h6>Query Builder</h6>
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
            <div className="queryDiv-field">
                <span>Type of Rail :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleTypeOfRailDropdown} ref={typeOfRailRef} >
                    <button>
                        {selectedTypeOfRailValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(typeOfRailValuesFromLayer, selectedTypeOfRailValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedTypeOfRailValues.map((sv, index) => (
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
                    typeOfRailDropdown &&
                    <div className="dropdownOption increaseDropdownWidth">
                        <div className="lableDiv">
                            {
                                typeOfRailValuesFromLayer && typeOfRailValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleTypeOfRailValue(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeTypeOfRailDropdown} />
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
                <span>USFD Classification :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleFlawDetectedDropdown} ref={flawDetectedRef} >
                    <button>
                        {selectedFlawDetectedValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(flawDetectedValuesFromLayer, selectedFlawDetectedValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedFlawDetectedValues.map((sv, index) => (
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
                    flawDetectedDropdown &&
                    <div className="dropdownOption increaseDropdownWidth">
                        <div className="lableDiv">
                            {
                                flawDetectedValuesFromLayer && flawDetectedValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleFlawDetectedValue(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeFlawDetectedDropdown} />
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

export default RailFractureQuery