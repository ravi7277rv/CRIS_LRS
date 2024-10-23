import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { operatorsList, deffinitionExpression } from '../../../Templates/Template';
import { updateValues, areAllValuesSelected } from '../../Utils/Functions';
import { loadModules } from 'esri-loader';
import UpArrowButton from '../../Buttons/UpArrowButton';
import QueryButtons from '../../Buttons/QueryButtons';
const [
    geometry, geometryEngine, Point] = await loadModules(["esri/geometry", "esri/geometry/SpatialReference", "esri/geometry/Point"], { css: true });

const NBMLUMLLocationQuery = ({ layer, newMapObj, startLoaderForQueryBuilder, stopLoaderForQueryBuilder }) => {
    let view = newMapObj.newView;
    let id = newMapObj.id;
    const parameterRef = useRef(null);
    const operatorRef = useRef(null);
    const [operatorDropdown, setOperatorDropdown] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [parameterDropdown, setParameterDropdown] = useState(false);
    const [parameterValuesFromLayer, setParameterValuesFromLayer] = useState([]);
    const [selectedParameterValues, setSelectedParameterValues] = useState([]);
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
    //region Parameter
    const handleParameterDropdown = (e) => {
        e.preventDefault()
        setOperatorDropdown(false);
        setParameterDropdown(!parameterDropdown);
    };
    const closeParameterDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setParameterDropdown(false);
    }
    const handleParameterValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(selectedValue, isChecked, parameterValuesFromLayer, selectedParameterValues);
        setParameterValuesFromLayer(updatedValuesFromLayer);
        setSelectedParameterValues(selectedValues)
    };
    useEffect(() => {

        const parameterData = async () => {
            let query = layer.createQuery();
            // query.where = deffinitionExpression;
            query.outFields = ["param"];
            const result = await layer.queryFeatures(query);
            const uniqueValues = new Set();
            result.features.forEach((feature) => {
                const attributeValue = feature.attributes["param"];
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
            setParameterValuesFromLayer([{ value: "All", checked: true }, ...sortedValues]);
            setSelectedParameterValues(sortedValues.map(v => v.value));
        }
        parameterData();
    }, []);
    //#endregion
    //Querying the data 
    let storedQueryObject;
    let cQuery;
    const handleQueryData = async () => {
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        if (!selectedOperator && !inputValue && selectedParameterValues.length === 0) {
            return toast("One or more field value is empty");
        };
        if (selectedParameterValues.length === 0) {
            if (!selectedOperator || !inputValue) {
                return toast("Missing operator or input value");
            };
        }
        startLoaderForQueryBuilder(id);
        setSubmitButtonDisabled(true)
        let parameterQuery = "";
        let peakQuery = "";
        let finalQuery = "";
        if (selectedOperator && inputValue) {
            peakQuery = `peak ${selectedOperator} ${inputValue}`;
        }
        if (selectedParameterValues.length > 0) {
            parameterQuery = "param in ('" + selectedParameterValues.map(sr => sr).join("','") + "')";
        }
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (layer) {
            finalQuery = cQuery !== "" ?
                [peakQuery, parameterQuery, cQuery].filter(Boolean).join(" AND ") :
                [peakQuery, parameterQuery].filter(Boolean).join(" AND ");
            if (storedQueryObject) {
                const updatedQueryObject = storedQueryObject.map(item =>
                    item.id === 11 ? { ...item, query: finalQuery } : item
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
        setSelectedParameterValues([]);
        setParameterValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (storedQueryObject) {
            const updatedQueryObject = storedQueryObject.map(item =>
                item.id === 11 ? { ...item, query: "" } : item
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
                <h6>Query Builder for UML Location</h6>
            </div>
            <div className="queryDiv-field">
                <span>Parameter :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleParameterDropdown} ref={parameterRef} >
                    <button>
                        {selectedParameterValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(parameterValuesFromLayer, selectedParameterValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedParameterValues.map((sv, index) => (
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
                    parameterDropdown &&
                    // <div className="dropdownOption increaseDropdownWidth">
                    //     {
                    //         parameterValuesFromLayer && parameterValuesFromLayer.map((value, index) => (
                    //             <label key={index} className='labelWithInput'>
                    //                 <input
                    //                     type="checkbox"
                    //                     id={`checkbox-${index}`}
                    //                     value={value.value}
                    //                     onChange={handleParameterValue(value)}
                    //                     checked={value.checked}
                    //                 />
                    //                 {value.value}
                    //             </label>
                    //         ))
                    //     }

                    // </div>
                    <div className="dropdownOption increaseDropdownWidth">
                        <div className="lableDiv">
                            {
                                parameterValuesFromLayer && parameterValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleParameterValue(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeParameterDropdown} />
                    </div>
                }
            </div>
            <div className="queryDiv-field">
                <span>Peak Value :</span>
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

export default NBMLUMLLocationQuery