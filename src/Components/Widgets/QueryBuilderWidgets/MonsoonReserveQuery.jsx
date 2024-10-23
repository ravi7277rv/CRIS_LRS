import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deffinitionExpression } from '../../../Templates/Template';
import { updateValues, areAllValuesSelected } from '../../Utils/Functions';
import { loadModules } from 'esri-loader';
import UpArrowButton from '../../Buttons/UpArrowButton';
import QueryButtons from '../../Buttons/QueryButtons';
import globalUrlConfig from '../../../BaseUrlConfig';
const [
    geometry, geometryEngine, Point] = await loadModules(["esri/geometry", "esri/geometry/geometryEngine", "esri/geometry/Point"], { css: true });

const MonsoonReserveQuery = ({ layer, newMapObj, startLoaderForQueryBuilder, stopLoaderForQueryBuilder }) => {
    let view = newMapObj.newView;
    let id = newMapObj.id;
    const categoryRef = useRef(null);
    const stractureTypeRef = useRef(null);
    const [categoryDropdown, setCategoryDropdown] = useState(false);
    const [stractureTypeDropdown, setStractureTypeDropdown] = useState(false);
    const [categoryValuesFromLayer, setCategoryValuesFromLayer] = useState([]);
    const [stractureTypeValuesFromLayer, setStractureTypeValuesFromlayer] = useState([]);
    const [selectedCategoryValues, setSelectedCategoryValues] = useState([]);
    const [selectedStractureTypeValues, setSelectedStractureTypeValues] = useState([])
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [resetButtonDisabled, setResetButtonDisabled] = useState(true);

    //Binding the data to the QueryBuilder
    useEffect(() => {
        const bindBridgeORNDatas = async () => {
            try {
                const response = await fetch(`${globalUrlConfig.REACT_APP_API_BASE_URL}/getMonsoonReserveData`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                const sortedTypeOfConsumable = result.data.typeOfConsumable.map(toc => ({ value: toc, checked: true }));
                setCategoryValuesFromLayer([{ value: "All", checked: true }, ...sortedTypeOfConsumable]);
                setSelectedCategoryValues(result.data.typeOfConsumable.map(toc => toc));
                const sortedLocationType = result.data.locationType.map(lt => ({ value: lt, checked: true }));
                setStractureTypeValuesFromlayer([{ value: "All", checked: true }, ...sortedLocationType]);
                setSelectedStractureTypeValues(result.data.locationType.map(lt => lt));
            } catch (err) {
                console.log(err)
            } finally {
                //
            }
        }
        bindBridgeORNDatas();
    }, []);

    // #region Category Value selected
    const handleCategoryDropdown = () => {
        setCategoryDropdown(!categoryDropdown);
        setStractureTypeDropdown(false);
    }
    const closeCategoryDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCategoryDropdown(false);
    }
    const handleCategoryValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(selectedValue, isChecked, categoryValuesFromLayer, selectedCategoryValues);
        setCategoryValuesFromLayer(updatedValuesFromLayer);
        setSelectedCategoryValues(selectedValues)
    }
    //#endregion
    //#region Stracture Type Value
    const handleStractureTypeDropdown = () => {
        setStractureTypeDropdown(!stractureTypeDropdown);
        setCategoryDropdown(false);
    }
    const closeStractureTypeDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setStractureTypeDropdown(false);
    }
    const handleStractureTypeValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(selectedValue, isChecked, stractureTypeValuesFromLayer, selectedStractureTypeValues);
        setStractureTypeValuesFromlayer(updatedValuesFromLayer);
        setSelectedStractureTypeValues(selectedValues)
    };

    //#endregion
    //Querying the data 
    let storedQueryObject;
    let cQuery;
    const handleQueryData = async () => {
        
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        if (selectedCategoryValues.length === 0 && selectedStractureTypeValues.length === 0) {
            return toast("Please select at least one field");
        }
        startLoaderForQueryBuilder(id);
        setSubmitButtonDisabled(true)
        let categoryQuery = "";
        let stractureTypeQuery = "";
        let finalQuery = "";
        if (selectedCategoryValues.length !== 0) {
            categoryQuery = "type_of_consumable in ('" + selectedCategoryValues.map(sr => sr).join("','") + "')";
        }
        if (selectedStractureTypeValues.length !== 0) {
            stractureTypeQuery = "location_type in ('" + selectedStractureTypeValues.map(sr => sr).join("','") + "')";
        }
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (layer) {
            // finalQuery = [categoryQuery, stractureTypeQuery].filter(Boolean).join(" AND ");
            finalQuery = cQuery !== "" ?
                [categoryQuery, stractureTypeQuery, cQuery].filter(Boolean).join(" AND ") :
                [categoryQuery, stractureTypeQuery].filter(Boolean).join(" AND ");
            if (storedQueryObject) {
                const updatedQueryObject = storedQueryObject.map(item =>
                    item.id === 14 ? { ...item, query: finalQuery } : item
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
        setCategoryDropdown(false);
        setStractureTypeDropdown(false);
    };
    const handleResetData = async () => {
        startLoaderForQueryBuilder(id);
        setResetButtonDisabled(true);
        setSelectedCategoryValues([]);
        setSelectedStractureTypeValues([]);
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (storedQueryObject) {
            const updatedQueryObject = storedQueryObject.map(item =>
                item.id === 14 ? { ...item, query: "" } : item
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
        setCategoryValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        setStractureTypeValuesFromlayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        stopLoaderForQueryBuilder(id);
    }
    return (
        <div className="queryDiv" style={{ width: "388px" }}>
            <div className="queryDiv-heading">
                <h6>Query Builder</h6>
            </div>
            <div className="queryDiv-field">
                <span>Type of Consumable :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleCategoryDropdown} ref={categoryRef}>
                    <button >
                        {selectedCategoryValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(categoryValuesFromLayer, selectedCategoryValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedCategoryValues.map((sv, index) => (
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
                    categoryDropdown &&
                    // <div className="dropdownOption increaseDropdownWidth">
                    //     {
                    //         categoryValuesFromLayer && categoryValuesFromLayer.map((value, index) => (
                    //             <label key={index} className='labelWithInput'>
                    //                 <input
                    //                     type="checkbox"
                    //                     id={`checkbox-${index}`}
                    //                     value={value.value}
                    //                     onChange={handleCategoryValue(value)}
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
                                categoryValuesFromLayer && categoryValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleCategoryValue(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeCategoryDropdown} />
                    </div>
                }
            </div>
            <div className="queryDiv-field">
                <span>Location type :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleStractureTypeDropdown} ref={stractureTypeRef} >
                    <button>
                        {selectedStractureTypeValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(stractureTypeValuesFromLayer, selectedStractureTypeValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedStractureTypeValues.map((sv, index) => (
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
                    stractureTypeDropdown &&
                    // <div className="dropdownOption increaseDropdownWidth">
                    //     {
                    //         stractureTypeValuesFromLayer && stractureTypeValuesFromLayer.map((value, index) => (
                    //             <label key={index} className='labelWithInput'>
                    //                 <input
                    //                     type="checkbox"
                    //                     id={`checkbox-${index}`}
                    //                     value={value.value}
                    //                     onChange={handleStractureTypeValue(value)}
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
                                stractureTypeValuesFromLayer && stractureTypeValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleStractureTypeValue(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeStractureTypeDropdown} />
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
export default MonsoonReserveQuery