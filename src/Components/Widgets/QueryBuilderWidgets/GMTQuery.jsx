import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { operatorsList, indiaExtent, deffinitionExpression } from '../../../Templates/Template';
import { updateValues, areAllValuesSelected, queryAndDisplayFeatures } from '../../Utils/Functions';
import UpArrowButton from '../../Buttons/UpArrowButton';
import QueryButtons from '../../Buttons/QueryButtons';
import globalUrlConfig from '../../../BaseUrlConfig';

const GMTQuery = ({ layer, newMapObj, startLoaderForQueryBuilder, stopLoaderForQueryBuilder }) => {
  let view = newMapObj.newView;
  let id = newMapObj.id;
  const operatorRef = useRef(null);
  const typeOfRailRef = useRef(null);
  const gradeOfSteelRef = useRef(null);
  const gmtRef = useRef(null);
  const [operatorDropdown, setOperatorDropdown] = useState(false);
  const [typeOfRailDropdown, setTypeOfRailDropdown] = useState(false);
  const [gradeOfSteelDropdown, setGradeOfSteelDropdown] = useState(false);
  const [gmtDropdown, setGmtDropdown] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [gmtSelectedIs, setGmtSelectedIs] = useState("Select Value");
  const [typeOfRailValuesFromLayer, setTypeOfRailValuesFromLayer] = useState([]);
  const [gradeOfSteelValuesFromLayer, setGradeOfSteelValuesFromLayer] = useState([]);
  const [gmtValues, setGmtValues] = useState([
    { label: "All", value: "All", checked: false },
    { label: ">=50 <60", value: "(life_slab_percent BETWEEN 50 AND 59)", checked: false },
    { label: ">=60 <70", value: "(life_slab_percent BETWEEN 60 AND 69)", checked: false },
    { label: ">=70 <80", value: "(life_slab_percent BETWEEN 70 AND 79)", checked: false },
    { label: ">=80 <90", value: "(life_slab_percent BETWEEN 80 AND 89)", checked: false },
    { label: ">=90 <100", value: "(life_slab_percent BETWEEN 90 AND 99)", checked: false },
    { label: ">100", value: "(life_slab_percent > 100)", checked: false },
  ]);
  const [selectedTypeOfRailValues, setSelectedTypeOfRailValues] = useState([]);
  const [selectedGradeOfSteelValues, setSelectedGradeOfSteelValues] = useState([]);
  const [selectedGmtValues, setSelectedGmtValues] = useState([]);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [resetButtonDisabled, setResetButtonDisabled] = useState(true);


  //Binding the data to the QueryBuilder
  useEffect(() => {
    const bindGMTDetailsDatas = async () => {
      try {
        const response = await fetch(`${globalUrlConfig.REACT_APP_API_BASE_URL}/getGMTDetailsData`);
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
      } catch (err) {
        console.log(err)
      } finally {
        //
      }
    }
    bindGMTDetailsDatas();
  }, []);

  // Operator Selecting functionality start here
  const handleOperatorDropdown = () => {
    setOperatorDropdown(!operatorDropdown);
    setTypeOfRailDropdown(false);
    setGradeOfSteelDropdown(false);
    setGmtDropdown(false);
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
    setGmtDropdown(false);
  };
  const closeTypeOfRailDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTypeOfRailDropdown(false);
  }
  const handleTypeOfRailValue = (value) => (event) => {
    let selectedValue = value.value;
    let isChecked = event.target.checked;
    const { updatedValuesFromLayer, selectedValues } = updateValues(selectedValue, isChecked, typeOfRailValuesFromLayer, selectedTypeOfRailValues);
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
    setGmtDropdown(false);
  };
  const closeGradeOfSteelDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setGradeOfSteelDropdown(false);
  }
  const handleGradeOfSteelValue = (value) => async (event) => {
    let selectedValue = value.value;
    let isChecked = event.target.checked;
    const { updatedValuesFromLayer, selectedValues } = updateValues(selectedValue, isChecked, gradeOfSteelValuesFromLayer, selectedGradeOfSteelValues);
    setGradeOfSteelValuesFromLayer(updatedValuesFromLayer);
    setSelectedGradeOfSteelValues(selectedValues)
  };
  //#endregion
  //#region GMT
  const handleGmtDropdown = (e) => {
    e.preventDefault()
    setOperatorDropdown(false);
    setTypeOfRailDropdown(false);
    setGradeOfSteelDropdown(false);
    setGmtDropdown(!gmtDropdown);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gmtRef.current && !gmtRef.current.contains(event.target)) {
        setTimeout(() => {
          setGmtDropdown(false);
        }, 1);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const handleGmtValue = (value) => (event) => {
    const selectedValue = value.value;
    const isChecked = event.target.checked;

    let updatedValuesFromLayer;
    let selectedValues = [...selectedGmtValues];

    if (selectedValue === "All") {
      updatedValuesFromLayer = gmtValues.map((v) => ({ ...v, checked: isChecked }));
      selectedValues = isChecked ? gmtValues.map((v) => v.value) : [];
    } else {
      updatedValuesFromLayer = gmtValues.map((v) =>
        v.value === selectedValue ? { ...v, checked: isChecked } : v
      );

      if (isChecked) {
        const allValuesSelected = updatedValuesFromLayer.every((v) => v.value === "All" || v.checked);
        if (allValuesSelected) {
          updatedValuesFromLayer = updatedValuesFromLayer.map((v) =>
            v.value === "All" ? { ...v, checked: true } : v
          );
        }
        selectedValues = [...selectedValues, selectedValue];
      } else {
        updatedValuesFromLayer = updatedValuesFromLayer.map((v) =>
          v.value === "All" ? { ...v, checked: false } : v
        );
        selectedValues = selectedValues.filter(f => f !== "All" && f !== selectedValue);
      }
    }
    setGmtValues(updatedValuesFromLayer);
    setSelectedGmtValues(selectedValues);
  };

  // #endregion
  const handleRadioBtnChange = (e) => {
    console.log(`selected value : ${e.target.value}`)
    setGmtSelectedIs(e.target.value);
  }
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
    if (!selectedOperator && !inputValue && selectedTypeOfRailValues.length === 0 && selectedGradeOfSteelValues.length === 0) {
      return toast("One or more field value is empty");
    };
    if (selectedTypeOfRailValues.length === 0 && selectedGradeOfSteelValues.length === 0) {
      if (gmtSelectedIs == "Select Value") {
        if (!selectedOperator || !inputValue) {
          return toast("Missing operator or input value");
        };
      }
    }
    startLoaderForQueryBuilder(id);
    setSubmitButtonDisabled(true)
    let typeOfRailQuery = "";
    let gradeOfSteelQuery = "";
    let gmtQuery = "";
    let finalQuery = "";
    if (gmtSelectedIs == "Select Value") {
      if (selectedOperator && inputValue) {
        gmtQuery = `accumulated_gmt ${selectedOperator} ${inputValue}`;
      }
    } else {
      if (selectedGmtValues.length !== 0){
        const filteredGmtValues = selectedGmtValues.filter(value => value !== "All");
        gmtQuery = "(" + filteredGmtValues.map(sr => sr).join(" or ") + ")";
      }
    }
    if (selectedTypeOfRailValues.length > 0) {
      typeOfRailQuery = "rail_section in ('" + selectedTypeOfRailValues.map(sr => sr).join("','") + "')";
    }
    if (selectedGradeOfSteelValues.length > 0) {
      gradeOfSteelQuery = "grade_of_steel in ('" + selectedGradeOfSteelValues.map(sr => sr).join("','") + "')";
    }
    cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
    if (layer) {
      finalQuery = cQuery !== "" ?
        [gmtQuery, typeOfRailQuery, gradeOfSteelQuery, cQuery].filter(Boolean).join(" AND ") :
        [gmtQuery, typeOfRailQuery, gradeOfSteelQuery].filter(Boolean).join(" AND ");
      if (storedQueryObject) {
        const updatedQueryObject = storedQueryObject.map(item =>
          item.id === 3 ? { ...item, query: finalQuery } : item
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
    setSelectedTypeOfRailValues([]);
    setSelectedGradeOfSteelValues([]);
    setSelectedGmtValues([]);
    storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
    cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
    if (cQuery) {
      layer.definitionExpression = cQuery;
      queryAndDisplayFeatures(undefined, layer, cQuery, view);
    } else {
      layer.definitionExpression = "1=1";
      newMapObj.newView.extent = layer.fullExtent;
    }
    if (storedQueryObject) {
      const updatedQueryObject = storedQueryObject.map(item =>
        item.id === 3 ? { ...item, query: "" } : item
      );
      sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
    }
    setTypeOfRailValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
    setGradeOfSteelValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
    newMapObj.newView.extent = layer.fullExtent;
    stopLoaderForQueryBuilder(id);
  }
  return (
    <div className="queryDiv" style={{ width: "375px" }}>
      <div className="queryDiv-heading">
        <h6>Query Builder</h6>
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
        <span>Accumulated GMT :</span>
        <div className="queryDiv-field-input">
          <div className="valueselect">
            <input
              type="radio"
              value="Select Value"
              checked={gmtSelectedIs === "Select Value"}
              onChange={handleRadioBtnChange}
            />Select Value
          </div>
          <div className="percentselect">
            <input
              type="radio"
              value="Select % Slab"
              checked={gmtSelectedIs === "Select % Slab"}
              onChange={handleRadioBtnChange}
            />% life Slab
          </div>
        </div>
      </div>
      <div className="queryDiv-field-gmt">
        {
          gmtSelectedIs === "Select Value" ? (
            <>
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
            </>
          ) : (
            <>
              <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handleGmtDropdown} ref={gmtRef} >
                <button>
                  {selectedGmtValues.length > 0 ? (
                    <>
                      {areAllValuesSelected(gmtValues, selectedGmtValues) ? (
                        <span key="all" className='displayValue'>All</span>
                      ) : (
                        selectedGmtValues.map((sv, index) => {
                          const matchedValue = gmtValues.find(v => v.value === sv);
                          return (
                            <span key={index} className='displayValue'>
                              {matchedValue ? matchedValue.label : sv}
                            </span>
                          );
                        })
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
                gmtDropdown &&
                <div className="dropdownOption increaseDropdownWidth" style={{
                  width: "132px",
                  right: "104px"
                }}>
                  {
                    gmtValues && gmtValues.map((value, index) => (
                      <label key={index} className='labelWithInput'>
                        <input
                          type="checkbox"
                          id={`checkbox-${index}`}
                          value={value.value}
                          onChange={handleGmtValue(value)}
                          checked={value.checked}
                        />
                        {value.label}
                      </label>
                    ))
                  }
                </div>
              }
            </>
          )
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

export default GMTQuery