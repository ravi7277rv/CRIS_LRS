import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { operatorsList,indiaExtent, deffinitionExpression } from '../../../Templates/Template';
import { updateValues, areAllValuesSelected, queryAndDisplayFeatures } from '../../Utils/Functions';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import $ from 'jquery';
import UpArrowButton from '../../Buttons/UpArrowButton';
import QueryButtons from '../../Buttons/QueryButtons';


const BridgeWaterLevelQuery = ({ layer, newMapObj, startLoaderForQueryBuilder, stopLoaderForQueryBuilder }) => {
    let view = newMapObj.newView;
    let id = newMapObj.id;
    const categoryRef = useRef(null);
    const stractureTypeRef = useRef(null);
    const operatorRef = useRef(null);
    const [categoryDropdown, setCategoryDropdown] = useState(false);
    const [stractureTypeDropdown, setStractureTypeDropdown] = useState(false);
    const [operatorDropdown, setOperatorDropdown] = useState(false);
    const [categoryValuesFromLayer, setCategoryValuesFromLayer] = useState([]);
    const [stractureTypeValuesFromLayer, setStractureTypeValuesFromlayer] = useState([]);
    const [selectedCategoryValues, setSelectedCategoryValues] = useState([]);
    const [selectedStractureTypeValues, setSelectedStractureTypeValues] = useState([])
    const [selectedOperator, setSelectedOperator] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [waterLevelData, setWaterLevelData] = useState([]);
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
    useEffect(() => {
        const categoryData = async () => {
            let query = layer.createQuery();
            // query.where = deffinitionExpression;
            query.outFields = ["category"];
            const result = await layer.queryFeatures(query);
            const uniqueValues = new Set();
            result.features.forEach((feature) => {
                const attributeValue = feature.attributes["category"];
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
            setCategoryValuesFromLayer([{ value: "All", checked: true }, ...sortedValues]);
            setSelectedCategoryValues(sortedValues.map(v => v.value));
        }
        categoryData();
    }, []);
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
    useEffect(() => {
        const categoryData = async () => {
            let query = layer.createQuery();
            // query.where = deffinitionExpression;
            query.outFields = ["structure_type"];
            const result = await layer.queryFeatures(query);
            const uniqueValues = new Set();
            result.features.forEach((feature) => {
                const attributeValue = feature.attributes["structure_type"];
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
            setStractureTypeValuesFromlayer([{ value: "All", checked: true }, ...sortedValues]);
            setSelectedStractureTypeValues(sortedValues.map(v => v.value));
        }
        categoryData();
    }, []);

    //#endregion

    const handleShowBarChat = () => {
        $('.popup-open').show();
        $('.popup-content').show();
    }
    const handleCloseBtn = () => {
        $('.popup-open').hide();
        $('.popup-content').hide();
    }
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    };
    useEffect(() => {
        const currentDate = new Date(); // Ensure currentDate is defined
        const datesArray = [];
        let waterLevel = 100;
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() - i);
            const previousDate = formatDate(date); // Assuming formatDate is a function that formats your date
            let data = { Date: previousDate, WaterLevel: waterLevel }
            datesArray.push(data);
            waterLevel = waterLevel + 100;
        }
        setWaterLevelData(datesArray); // Update state once with the complete array
    }, []);
    //Querying the data 
    let storedQueryObject;
    let cQuery;
    const handleQueryData = async () => {
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        if (!selectedOperator && !inputValue && selectedCategoryValues.length === 0 && selectedStractureTypeValues.length === 0) {
            return toast("One or more field value is empty");
        };
        if (selectedCategoryValues.length === 0 && selectedStractureTypeValues.length === 0) {
            if (!selectedOperator || !inputValue) {
                return toast("Missing operator or input value");
            };
        }
        startLoaderForQueryBuilder(id);
        setSubmitButtonDisabled(true)
        let categoryQuery = "";
        let stractureTypeQuery = "";
        let waterLevelQuery = "";
        let finalQuery = "";
        if (selectedCategoryValues.length > 0) {
            categoryQuery = "category in ('" + selectedCategoryValues.map(sr => sr).join("','") + "')";
        }
        if (selectedStractureTypeValues.length > 0) {
            stractureTypeQuery = "structure_type in ('" + selectedStractureTypeValues.map(sr => sr).join("','") + "')";
        }
        if (selectedOperator && inputValue) {
            waterLevelQuery = `dl_wl1_diff ${selectedOperator} ${inputValue}`;
        }
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (layer) {
            // finalQuery = [categoryQuery, stractureTypeQuery, waterLevelQuery].filter(Boolean).join(" AND ");

            finalQuery = cQuery !== "" ?
                [categoryQuery, stractureTypeQuery, waterLevelQuery, cQuery].filter(Boolean).join(" AND ") :
                [categoryQuery, stractureTypeQuery, waterLevelQuery].filter(Boolean).join(" AND ");
            if (storedQueryObject) {
                const updatedQueryObject = storedQueryObject.map(item =>
                    item.id === 15 ? { ...item, query: finalQuery } : item
                );
                sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
            }
            if (!finalQuery)
                finalQuery = "1=1";
            layer.definitionExpression = finalQuery;
            queryAndDisplayFeatures(id,layer, finalQuery, view, toast, stopLoaderForQueryBuilder);
        }
        setResetButtonDisabled(false);
        setSubmitButtonDisabled(false);
    };
    const handleResetData = async() => {
        startLoaderForQueryBuilder(id);
        setResetButtonDisabled(true);
        setSelectedCategoryValues([]);
        setSelectedStractureTypeValues([]);
        setSelectedOperator("");
        setInputValue("");
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
        if (storedQueryObject) {
            const updatedQueryObject = storedQueryObject.map(item =>
                item.id === 15 ? { ...item, query: "" } : item
            );
            sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
        }
        setCategoryValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        setStractureTypeValuesFromlayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
        if (cQuery) {
            layer.definitionExpression = cQuery;
            queryAndDisplayFeatures(layer, cQuery, view);
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
        <div className="queryDiv" style={{ width: "350px" }} >
            <div className="queryDiv-heading">
                <h6>Query Builder</h6>
            </div>
            {/* <div class="graph-icon" onClick={handleShowBarChat} style={{ position: "absolute", left: "19.8rem", top: "0.2rem" }} >
                <svg width="25px" height="25px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                    <g id="SVGRepo_bgCarrier" stroke-width="0" />
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                        <path d="M405.333333 469.333333h213.333334v426.666667H405.333333zM128 256h213.333333v640H128zM682.666667 128h213.333333v768H682.666667z" fill="#0077be" />
                    </g>
                    <title>Bar Graph</title>
                </svg>

            </div> */}
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
            <div className="queryDiv-field" style={{ margin: "17px 0px 0px 0px" }}>
                <span>Difference b/w <br></br> DL & WL on present day(meter) :</span>
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
            <div className="popupClass">
                <div className="popup-content">Water Level in last 7 days
                    <button className="close-btn" onClick={handleCloseBtn} >
                        &times;
                    </button>
                    <ResponsiveContainer width="105%" height={200}>
                        <BarChart data={waterLevelData} margin={{ top: 20, right: 30, left: -22, bottom: 5 }}>
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis dataKey="Date" tick={{ fontSize: "12px" }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="WaterLevel" fill="#0077be" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>




    );
}
//style={{width:"132px", right:"105px"}}
export default BridgeWaterLevelQuery