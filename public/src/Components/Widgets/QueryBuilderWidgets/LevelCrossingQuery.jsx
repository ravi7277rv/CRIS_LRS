import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { operatorsList, indiaExtent, deffinitionExpression } from '../../../Templates/Template';
import { updateValues, areAllValuesSelected, } from '../../Utils/Functions';
import { loadModules } from 'esri-loader';
import UpArrowButton from '../../Buttons/UpArrowButton';
import QueryButtons from '../../Buttons/QueryButtons';
const [
    geometry,geometryEngine, Point] = await loadModules(["esri/geometry", "esri/geometry/SpatialReference", "esri/geometry/Point"], { css: true });

const LevelCrossingQuery = ({ layer, newMapObj, startLoaderForQueryBuilder, stopLoaderForQueryBuilder }) => {
    let view = newMapObj.newView;
    let id = newMapObj.id;
    const operatorRef = useRef(null);
    const manningRef = useRef(null);
    const classRef = useRef(null);
    const interlockedRef = useRef(null);
    const [operatorDropdown, setOperatorDropdown] = useState(false);
    const [manningDropdown, setManningDropdown] = useState(false);
    const [classDropdown, setClassDropdown] = useState(false);
    const [interlockedDropdown, setInterlockedDropdown] = useState(false);
    const [planningForLcClouserDropdown, setPlanningForLcClouserDropdown] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [manningValuesFromLayer, setManningValuesFromLayer] = useState([]);
    const [classValuesFromLayer, setClassValuesFromLayer] = useState([]);
    const [interlockedValuesFromLayer, setInterlockedValuesFromLayer] = useState([]);
    const [planningForLcClouserValuesFromLayer, setPlanningForLcClouserValuesFromLayer] = useState([]);
    const [selectedManningValues, setSelectedManningValues] = useState([]);
    const [selectedClassValues, setSelectedClassValues] = useState([]);
    const [selectedInterlockedValues, setSelectedInterlockedValues] = useState([]);
    const [selectedPlanningForLcClouserValues, setSelectedPlanningForLcClouserValues] = useState([]);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [resetButtonDisabled, setResetButtonDisabled] = useState(true);

    // Operator Selecting functionality start here
    const handleOperatorDropdown = () => {
        setOperatorDropdown(!operatorDropdown);
        setManningDropdown(false);
        setClassDropdown(false);
        setInterlockedDropdown(false);
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
    //#region Manning
    const closeManningDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setManningDropdown(false);
    }
    const handleManningValues = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(
            selectedValue,
            isChecked,
            manningValuesFromLayer,
            selectedManningValues
        );
        setManningValuesFromLayer(updatedValuesFromLayer);
        setSelectedManningValues(selectedValues)
    };
    const handleManningDropdown = (e) => {
        e.preventDefault()
        setOperatorDropdown(false);
        setManningDropdown(!manningDropdown);
        setClassDropdown(false);
        setInterlockedDropdown(false);
        setPlanningForLcClouserDropdown(false)
    };
    useEffect(() => {
        const manningData = async () => {
            let query = layer.createQuery();
            // query.where = deffinitionExpression;
            query.outFields = ["manning"];
            const result = await layer.queryFeatures(query);
            const uniqueValues = new Set();
            result.features.forEach((feature) => {
                const attributeValue = feature.attributes["manning"];
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
            setManningValuesFromLayer([{ value: "All", checked: true }, ...sortedValues]);
            setSelectedManningValues(sortedValues.map(v => v.value));
        }
        manningData();
    }, []);

    //#endregion
    // #region Class Values
    const handleClassDropdown = (e) => {
        e.preventDefault()
        setOperatorDropdown(false);
        setManningDropdown(false);
        setClassDropdown(!classDropdown);
        setInterlockedDropdown(false);
        setPlanningForLcClouserDropdown(false)
    };
    const closeClassDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setClassDropdown(false);
    }
    useEffect(() => {
        const classData = async () => {
            
            let query = layer.createQuery();
            // query.where = deffinitionExpression;
            query.outFields = ["routeclass"];
            const result = await layer.queryFeatures(query);
            const uniqueValues = new Set();
            result.features.forEach((feature) => {
                const attributeValue = feature.attributes["routeclass"];
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
            setClassValuesFromLayer([{ value: "All", checked: true }, ...sortedValues]);
            setSelectedClassValues(sortedValues.map(v => v.value))
        }
        classData();
    }, []);
    const handleClassValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(selectedValue, isChecked, classValuesFromLayer, selectedClassValues);
        setClassValuesFromLayer(updatedValuesFromLayer);
        setSelectedClassValues(selectedValues)
    };
    //#endregion
    // #region Interlocked
    const handleInterlockedDropdown = (e) => {
        e.preventDefault()
        setOperatorDropdown(false);
        setManningDropdown(false);
        setClassDropdown(false);
        setInterlockedDropdown(!interlockedDropdown);
        setPlanningForLcClouserDropdown(false)
    };
    const closeInterlockedDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setInterlockedDropdown(false);
    }
    const handleInterlockedValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(
            selectedValue,
            isChecked,
            interlockedValuesFromLayer,
            selectedInterlockedValues
        );
        setInterlockedValuesFromLayer(updatedValuesFromLayer);
        setSelectedInterlockedValues(selectedValues)
    };
    useEffect(() => {
        const interlockedData = async () => {
            let query = layer.createQuery();
            // query.where = deffinitionExpression;
            query.outFields = ["is_interlocked"];
            const result = await layer.queryFeatures(query);
            const uniqueValues = new Set();
            result.features.forEach((feature) => {
                const attributeValue = feature.attributes["is_interlocked"];
                if (attributeValue) {
                    const valueObject = { value: attributeValue, checked: true };
                    uniqueValues.add(JSON.stringify(valueObject));
                }
            });
            const uniqueValuesArray = Array.from(uniqueValues).map(item => JSON.parse(item));
            const comparator = (a, b) => {
                if (typeof a.value === 'string' && typeof b.value === 'string') {
                    return a.value.localeCompare(b.value);
                }
                else {
                    return String(a.value).localeCompare(String(b.value));
                }
            };
            const sortedValues = uniqueValuesArray.sort(comparator);
            setInterlockedValuesFromLayer([{ value: "All", checked: true }, ...sortedValues]);
            setSelectedInterlockedValues(sortedValues.map(v => v.value))
        }
        interlockedData();
    }, []);
    // #endregion

    //#region Planning for Lc Closure
    const closePlanningForLcClosureDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPlanningForLcClouserDropdown(false)
    }
    const handlePlanningForLcClosureValues = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(
            selectedValue,
            isChecked,
            planningForLcClouserValuesFromLayer,
            selectedPlanningForLcClouserValues
        );
        setPlanningForLcClouserValuesFromLayer(updatedValuesFromLayer);
        setSelectedPlanningForLcClouserValues(selectedValues)
    };
    const handlePlanningForLcClosureDropdown = (e) => {
        e.preventDefault()
        setPlanningForLcClouserDropdown(!planningForLcClouserDropdown)
        setOperatorDropdown(false);
        setManningDropdown(false);
        setClassDropdown(false);
        setInterlockedDropdown(false);
    };
    useEffect(() => {
        const planningForLcClosureData = async () => {
            
            let query = layer.createQuery();
            // query.where = deffinitionExpression;
            query.outFields = ["planning_for_lc_closure_by"];
            const result = await layer.queryFeatures(query);
            const uniqueValues = new Set();
            result.features.forEach((feature) => {
                const attributeValue = feature.attributes["planning_for_lc_closure_by"];
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
            setPlanningForLcClouserValuesFromLayer([{ value: "All", checked: true }, ...sortedValues]);
            setSelectedPlanningForLcClouserValues(sortedValues.map(v => v.value));
        }
        planningForLcClosureData();
    }, []);
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
        if (!selectedOperator && !inputValue && selectedManningValues.length === 0 && selectedClassValues.length === 0 && selectedInterlockedValues.length === 0 && selectedPlanningForLcClouserValues.length === 0) {
            return toast("One or more field value is empty");
        };
        if (selectedManningValues.length === 0 && selectedClassValues.length === 0 && selectedInterlockedValues.length === 0 && selectedPlanningForLcClouserValues.length === 0) {
            if (!selectedOperator || !inputValue) {
                return toast("Missing operator or input value");
            };
        }
        startLoaderForQueryBuilder(id);
        setSubmitButtonDisabled(true)
        let tvuQuery = "";
        let manningQuery = "";
        let classQuery = "";
        let interlockedQuery = "";
        let planningForLcClosureQuery = "";
        let finalQuery = "";
        if (selectedOperator && inputValue) {
            tvuQuery = `tvu ${selectedOperator} ${inputValue}`;
        }
        if (selectedManningValues.length > 0) {
            manningQuery = "manning in ('" + selectedManningValues.map(mv => mv).join("','") + "')";
        }
        if (selectedClassValues.length > 0) {
            classQuery = "routeclass in ('" + selectedClassValues.map(cv => cv).join("','") + "')";
        }
        if (selectedInterlockedValues.length > 0) {
            interlockedQuery = "is_interlocked in ('" + selectedInterlockedValues.map(iv => iv).join("','") + "')";
        }
        if (selectedPlanningForLcClouserValues.length > 0) {
            planningForLcClosureQuery = "planning_for_lc_closure_by in ('" + selectedPlanningForLcClouserValues.map(spc => spc).join("','") + "')";
        }
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (layer) {
            // finalQuery = [tvuQuery, manningQuery, classQuery, interlockedQuery].filter(Boolean).join(" AND ");
            finalQuery = cQuery !== "" ?
                [tvuQuery, manningQuery, classQuery, interlockedQuery, planningForLcClosureQuery, cQuery].filter(Boolean).join(" AND ") :
                [tvuQuery, manningQuery, classQuery, interlockedQuery, planningForLcClosureQuery].filter(Boolean).join(" AND ");
            if (storedQueryObject) {
                const updatedQueryObject = storedQueryObject.map(item =>
                    item.id === 5 ? { ...item, query: finalQuery } : item
                );
                sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
            }
            if (!finalQuery)
                finalQuery = "1=0";
            layer.definitionExpression = finalQuery;
            let query = layer.createQuery();
            query.where = finalQuery;
            query.returnGeometry = true;
            try {
                const result = await layer.queryFeatures(query);
                if (result.features.length !== 0) {
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
                else {
                    toast("No Features Found");
                }
            } catch (error) {
                console.log(`Error while querying features: ${error}`);
            }

        }
        const layerView = await view.whenLayerView(layer);
        const handle = layerView.watch("updating", (updating) => {
            if (!updating) {
                stopLoaderForQueryBuilder(id);
                handle.remove();
            }
        });
        setResetButtonDisabled(false);
        setSubmitButtonDisabled(false);
    };
    const handleResetData = async () => {
        startLoaderForQueryBuilder(id);
        setResetButtonDisabled(true);
        setSelectedOperator("");
        setInputValue("");
        setSelectedManningValues([]);
        setSelectedClassValues([]);
        setSelectedInterlockedValues([]);
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (storedQueryObject) {
            const updatedQueryObject = storedQueryObject.map(item =>
                item.id === 5 ? { ...item, query: "" } : item
            );
            sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
        }
        if (cQuery) {
            layer.definitionExpression = cQuery;
            let query = layer.createQuery();
            query.where = cQuery;
            query.returnGeometry = true;
            try {
                const result = await layer.queryFeatures(query);
                if (result.features.length !== 0) {
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
        setManningValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        setClassValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        setInterlockedValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        setPlanningForLcClouserValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        newMapObj.newView.extent = layer.fullExtent;
        const layerView = await view.whenLayerView(layer);
        const handle = layerView.watch("updating", (updating) => {
            if (!updating) {
                stopLoaderForQueryBuilder(id);
                handle.remove();
            }
        });
    }
    return (
        <div className="queryDiv" style={{ width: "410px" }}>
            <div className="queryDiv-heading">
                <h6>Query Builder</h6>
            </div>
            <div className="queryDiv-field">
                <span>Manning :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleManningDropdown} ref={manningRef}>
                    <button>
                        {selectedManningValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(manningValuesFromLayer, selectedManningValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedManningValues.map((sv, index) => (
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
                    manningDropdown &&
                    <div className="dropdownOption increaseDropdownWidth">
                        <div className="lableDiv">
                            {
                                manningValuesFromLayer && manningValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleManningValues(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeManningDropdown} />
                    </div>
                }
            </div>
            <div className="queryDiv-field">
                <span>Class :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleClassDropdown} ref={classRef}>
                    <button>
                        {selectedClassValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(classValuesFromLayer, selectedClassValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedClassValues.map((sv, index) => (
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
                    classDropdown &&
                    <div className="dropdownOption increaseDropdownWidth">
                        <div className="lableDiv">
                            {
                                classValuesFromLayer && classValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleClassValue(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeClassDropdown} />
                    </div>
                }
            </div>
            <div className="queryDiv-field">
                <span>Interlocked :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleInterlockedDropdown} ref={interlockedRef}>
                    <button>
                        {selectedInterlockedValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(interlockedValuesFromLayer, selectedInterlockedValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedInterlockedValues.map((sv, index) => (
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
                    interlockedDropdown &&
                    <div className="dropdownOption increaseDropdownWidth">
                        <div className="lableDiv">
                            {
                                interlockedValuesFromLayer && interlockedValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleInterlockedValue(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeInterlockedDropdown} />
                    </div>
                }
            </div>
            <div className="queryDiv-field">
                <span>Planning for LC Closure by:</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handlePlanningForLcClosureDropdown} ref={interlockedRef}>
                    <button>
                        {selectedPlanningForLcClouserValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(planningForLcClouserValuesFromLayer, selectedPlanningForLcClouserValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedPlanningForLcClouserValues.map((sv, index) => (
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
                    planningForLcClouserDropdown &&
                    <div className="dropdownOption increaseDropdownWidth">
                        <div className="lableDiv">
                            {
                                planningForLcClouserValuesFromLayer && planningForLcClouserValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handlePlanningForLcClosureValues(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closePlanningForLcClosureDropdown} />
                    </div>
                }
            </div>
            <div className="queryDiv-field">
                <span>TVU :</span>
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
                            placeholder='Enter value'
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

export default LevelCrossingQuery