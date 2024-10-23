import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { indiaExtent, deffinitionExpression } from '../../../Templates/Template';
import { updateValues, areAllValuesSelected, queryAndDisplayFeatures, addCircularBoundaries } from '../../Utils/Functions';
import UpArrowButton from '../../Buttons/UpArrowButton';
import QueryButtons from '../../Buttons/QueryButtons';
import globalUrlConfig from '../../../BaseUrlConfig';

const BridgeORN1or2Query = ({ layer, newMapObj, startLoaderForQueryBuilder, stopLoaderForQueryBuilder }) => {
    let view = newMapObj.newView;
    let id = newMapObj.id;
    const categoryRef = useRef(null);
    const stractureTypeRef = useRef(null);
    const ornRef = useRef(null);
    const stdOfLoadingRef = useRef(null);
    const [categoryDropdown, setCategoryDropdown] = useState(false);
    const [stractureTypeDropdown, setStractureTypeDropdown] = useState(false);
    const [ornDropdown, setOrnDropdown] = useState(false);
    const [stdOfLoadingDropdown, setStdOfLoadingDropdwon] = useState(false);
    const [overstressedBridgeDropdown, setOverstressedBridgeDropdown] = useState(false)
    const [categoryValuesFromLayer, setCategoryValuesFromLayer] = useState([]);
    const [stractureTypeValuesFromLayer, setStractureTypeValuesFromlayer] = useState([]);
    const [ornValuesFromLayer, setOrnValuesFromLayer] = useState([]);
    const [stdOfLoadingValuesFromLayer, setStdOfLoadingValuesFromLayer] = useState([])
    const [overstressedBridgeValuesFromLayer, setOverstressedBridgeValuesFromLayer] = useState([])
    const [selectedCategoryValues, setSelectedCategoryValues] = useState([]);
    const [selectedStractureTypeValues, setSelectedStractureTypeValues] = useState([])
    const [selectedOrnValues, setSelectedOrnValues] = useState([]);
    const [selectedStdOfLoadingValues, setSelectedStdOfLoadingValues] = useState([])
    const [selectedOverstressedBridgeValues, setSelectedOverstressedBridgeValues] = useState([]);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [resetButtonDisabled, setResetButtonDisabled] = useState(true);

    //Binding the data to the QueryBuilder
    useEffect(() => {
        const bindBridgeORNDatas = async () => {
            try {
                const response = await fetch(`${globalUrlConfig.REACT_APP_API_BASE_URL}/getBridgeOrnData`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                const sortedCategory = result.data.category.map(c => ({ value: c, checked: true }));
                setCategoryValuesFromLayer([{ value: "All", checked: true }, ...sortedCategory]);
                setSelectedCategoryValues(result.data.category.map(c => c));
                const sortedStructureType = result.data.structure_type.map(st => ({ value: st, checked: true }));
                setStractureTypeValuesFromlayer([{ value: "All", checked: true }, ...sortedStructureType]);
                setSelectedStractureTypeValues(result.data.structure_type.map(st => st));
                const sortedORN = result.data.orn.map(or => ({ value: or, checked: true }));
                setOrnValuesFromLayer([{ value: "All", checked: true }, ...sortedORN]);
                setSelectedOrnValues(result.data.orn.map(or => or));
                const sortedStdOFLoading = result.data.std_of_loading_fit_for.map(slff => ({ value: slff, checked: true }));
                setStdOfLoadingValuesFromLayer([{ value: "All", checked: true }, ...sortedStdOFLoading]);
                setSelectedStdOfLoadingValues(result.data.std_of_loading_fit_for.map(slff => slff));
                const sortedOverstressed = result.data.overstressed.map(os => ({ value: os, checked: true }));
                setOverstressedBridgeValuesFromLayer([{ value: "All", checked: true }, ...sortedOverstressed]);
                setSelectedOverstressedBridgeValues(result.data.overstressed.map(os => os));
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
        setOrnDropdown(false);
        setStractureTypeDropdown(false);
        setStdOfLoadingDropdwon(false);
    }
    const closeCategoryDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCategoryDropdown(false);
    }
    const handleCategoryValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        let updatedCategoryValueFromLayer;
        if (selectedValue === "All") {
            updatedCategoryValueFromLayer = categoryValuesFromLayer.map((v) => ({ ...v, checked: isChecked }));
            setSelectedCategoryValues(isChecked ? categoryValuesFromLayer.map((v) => v.value) : []);
        } else {
            updatedCategoryValueFromLayer = categoryValuesFromLayer.map((v) => v.value === selectedValue ? { ...v, checked: isChecked } : v);
            if (isChecked) {
                const allValuesSelected = updatedCategoryValueFromLayer.every((v) => v.value === "All" || v.checked);
                if (allValuesSelected) {
                    updatedCategoryValueFromLayer = updatedCategoryValueFromLayer.map((v) => v.value === "All" ? { ...v, checked: true } : v);
                }
                setSelectedCategoryValues(prev => [...prev, selectedValue]);
            } else {
                updatedCategoryValueFromLayer = updatedCategoryValueFromLayer.map((v) => v.value === "All" ? { ...v, checked: false } : v);
                setSelectedCategoryValues(prev => {
                    let sValue = prev.filter(f => f !== "All" && f !== selectedValue);
                    return sValue;
                });
            }
        }
        setCategoryValuesFromLayer(updatedCategoryValueFromLayer);
    }
    //#endregion
    //#region Stracture Type Value
    const handleStractureTypeDropdown = () => {
        setStractureTypeDropdown(!stractureTypeDropdown);
        setCategoryDropdown(false);
        setOrnDropdown(false);
        setStdOfLoadingDropdwon(false);
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
    //#region ORN Values
    const handleORNDropdown = () => {
        setOrnDropdown(!ornDropdown);
        setCategoryDropdown(false);
        setStractureTypeDropdown(false);
        setStdOfLoadingDropdwon(false);
    };
    const closeOrnDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOrnDropdown(false);
    }
    const handleORNValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(selectedValue, isChecked, ornValuesFromLayer, selectedOrnValues);
        setOrnValuesFromLayer(updatedValuesFromLayer);
        setSelectedOrnValues(selectedValues)
    }
    //#endregion
    //#region Std. of Loading Values
    const handleStdOfLoadingDropdown = () => {
        setStdOfLoadingDropdwon(!stdOfLoadingDropdown);
        setCategoryDropdown(false)
        setOrnDropdown(false);
        setStractureTypeDropdown(false);
    };
    const closeStdOfLoadingFitForDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setStdOfLoadingDropdwon(false)
    }
    const handleStdOfLoadingValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(selectedValue, isChecked, stdOfLoadingValuesFromLayer, selectedStdOfLoadingValues);
        setStdOfLoadingValuesFromLayer(updatedValuesFromLayer);
        setSelectedStdOfLoadingValues(selectedValues)
    };
    //#endregion
    //#region 
    const closeOverstressedDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOverstressedBridgeDropdown(false)
    }
    const handleOverstressedValue = (value) => (event) => {
        let selectedValue = value.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateValues(selectedValue, isChecked, overstressedBridgeValuesFromLayer, selectedOverstressedBridgeValues);
        setOverstressedBridgeValuesFromLayer(updatedValuesFromLayer);
        setSelectedOverstressedBridgeValues(selectedValues)
    };
    const handleOverstressedDropdown = () => {
        setOverstressedBridgeDropdown(!overstressedBridgeDropdown);
    }
    //#endregion
    //Querying the data 
    let storedQueryObject;
    let cQuery;
    const handleQueryData = async () => {
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        if (selectedCategoryValues.length === 0 && selectedStractureTypeValues.length === 0 && selectedOrnValues.length === 0 && selectedStdOfLoadingValues.length === 0 && selectedOverstressedBridgeValues.length === 0) {
            return toast("One or more field value is empty");
        };
        startLoaderForQueryBuilder(id);
        setSubmitButtonDisabled(true)
        let categoryQuery = "";
        let stractureTypeQuery = "";
        let ornQuery = "";
        let stdOfLoadingQuery = "";
        let overStressed = "";
        let finalQuery = "";
        if (selectedCategoryValues.length !== 0) {
            categoryQuery = "category in ('" + selectedCategoryValues.map(mv => mv).join("','") + "')";
        }
        if (selectedStractureTypeValues.length !== 0) {
            stractureTypeQuery = "structure_type in ('" + selectedStractureTypeValues.map(mv => mv).join("','") + "')";
        }
        if (selectedOrnValues.length !== 0) {
            ornQuery = "orn in (" + selectedOrnValues.map(mv => mv).join(",") + ")";
        }
        if (selectedStdOfLoadingValues.length !== 0) {
            stdOfLoadingQuery = "std_of_loading_fit_for in ('" + selectedStdOfLoadingValues.map(mv => mv).join("','") + "')";
        }
        if (selectedOverstressedBridgeValues.length !== 0) {
            stdOfLoadingQuery = "overstressed in ('" + selectedOverstressedBridgeValues.map(mv => mv).join("','") + "')";
        }
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (layer) {
            finalQuery = cQuery !== "" ?
                [categoryQuery, stractureTypeQuery, ornQuery, stdOfLoadingQuery, overStressed, cQuery].filter(Boolean).join(" AND ") :
                [categoryQuery, stractureTypeQuery, ornQuery, stdOfLoadingQuery, overStressed].filter(Boolean).join(" AND ");
            if (storedQueryObject) {
                const updatedQueryObject = storedQueryObject.map(item =>
                    item.id === 13 ? { ...item, query: finalQuery } : item
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
        setCategoryDropdown(false);
        setStractureTypeDropdown(false);
        setOrnDropdown(false);
        setStdOfLoadingDropdwon(false);
        setOverstressedBridgeDropdown(false);
    };
    const handleResetData = async () => {
        startLoaderForQueryBuilder(id);
        setResetButtonDisabled(true);
        setSelectedCategoryValues([]);
        setSelectedOrnValues([]);
        setSelectedStractureTypeValues([]);
        setSelectedStdOfLoadingValues([]);
        setSelectedOverstressedBridgeValues([]);
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (cQuery) {
            layer.definitionExpression = cQuery;
            queryAndDisplayFeatures(layer, cQuery, view);
        } else {
            layer.definitionExpression = "1=1";
            newMapObj.newView.extent = layer.fullExtent;
        }
        if (storedQueryObject) {
            const updatedQueryObject = storedQueryObject.map(item =>
                item.id === id ? { ...item, query: "" } : item
            );
            sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
        }
        setCategoryValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        setStractureTypeValuesFromlayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        setOrnValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        setStdOfLoadingValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })))
        setOverstressedBridgeValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })))
        stopLoaderForQueryBuilder(id);
    }
    return (
        <div className="queryDiv" style={{ width: "390px" }}>
            <div className="queryDiv-heading">
                <h6>Query Builder</h6>
            </div>
            <div className="queryDiv-field">
                <span>Category :</span>
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
                <span>Structure type :</span>
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
            <div className="queryDiv-field">
                <span>ORN :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleORNDropdown} ref={ornRef} >
                    <button>
                        {selectedOrnValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(ornValuesFromLayer, selectedOrnValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedOrnValues.map((sv, index) => (
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
                    ornDropdown &&
                    // <div className="dropdownOption increaseDropdownWidth">
                    //     {
                    //         ornValuesFromLayer && ornValuesFromLayer.map((value, index) => (
                    //             <label key={index} className='labelWithInput'>
                    //                 <input
                    //                     type="checkbox"
                    //                     id={`checkbox-${index}`}
                    //                     value={value.value}
                    //                     onChange={handleORNValue(value)}
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
                                ornValuesFromLayer && ornValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleORNValue(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeOrnDropdown} />
                    </div>
                }
            </div>
            <div className="queryDiv-field">
                <span>Std. of Loading fit for :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleStdOfLoadingDropdown} ref={stdOfLoadingRef} >
                    <button>
                        {selectedStdOfLoadingValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(stdOfLoadingValuesFromLayer, selectedStdOfLoadingValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedStdOfLoadingValues.map((sv, index) => (
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
                    stdOfLoadingDropdown &&
                    <div className="dropdownOption increaseDropdownWidth">
                        <div className="lableDiv">
                            {
                                stdOfLoadingValuesFromLayer && stdOfLoadingValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleStdOfLoadingValue(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeStdOfLoadingFitForDropdown} />
                    </div>
                }
            </div>
            <div className="queryDiv-field">
                <span>Overstressed Bridge :</span>
                <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleOverstressedDropdown} ref={stdOfLoadingRef} >
                    <button>
                        {selectedOverstressedBridgeValues.length > 0 ? (
                            <>
                                {areAllValuesSelected(overstressedBridgeValuesFromLayer, selectedOverstressedBridgeValues) ? (
                                    <span key="all" className='displayValue'>All</span>
                                ) : (
                                    selectedOverstressedBridgeValues.map((sv, index) => (
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
                    overstressedBridgeDropdown &&
                    <div className="dropdownOption increaseDropdownWidth">
                        <div className="lableDiv">
                            {
                                overstressedBridgeValuesFromLayer && overstressedBridgeValuesFromLayer.map((value, index) => (
                                    <label key={index} className='labelWithInput'>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${index}`}
                                            value={value.value}
                                            onChange={handleOverstressedValue(value)}
                                            checked={value.checked}
                                        />
                                        {value.value}
                                    </label>
                                ))
                            }
                        </div>
                        <UpArrowButton closeDropdown={closeOverstressedDropdown} />
                    </div>
                }
            </div>
            <QueryButtons
                handleQueryData={handleQueryData}
                handleResetData={handleResetData}
                submitButtonDisabled={submitButtonDisabled}
                resetButtonDisabled={resetButtonDisabled} />
        </div>
    );
}
//style={{width:"132px", right:"105px"}}
export default BridgeORN1or2Query