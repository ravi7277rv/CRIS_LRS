import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deffinitionExpression } from '../../../Templates/Template';
import { updateValues, areAllValuesSelected, queryAndDisplayFeatures } from '../../Utils/Functions';
import UpArrowButton from '../../Buttons/UpArrowButton';
import QueryButtons from '../../Buttons/QueryButtons';
import globalUrlConfig from '../../../BaseUrlConfig';

const SpecialRouteQuery = ({ layer, newMapObj, startLoaderForQueryBuilder, stopLoaderForQueryBuilder }) => {
  let view = newMapObj.newView;
  let id = newMapObj.id;
  const typeOfRoute = useRef(null);
  const sectionalSpeedRef = useRef(null);
  const sectionalGMTRef = useRef(null);
  const [typeOfRouteDropdown, setTypeOfRouteDropdown] = useState(false);
  const [sectionalSpeedDropdown, setSectionalSpeedDropdown] = useState(false);
  const [sectionalGMTDropdown, setSectionalGMTDropdown] = useState(false);
  const [typeOfRouteValuesFromLayer, setTypeOfRouteValuesFromLayer] = useState([]);
  const [sectionalSpeedValuesFromLayer, setSectionalSpeedValuesFromLayer] = useState([
    { label: "All", value: "All", checked: false },
    { label: "<100", value: "(sectional_speed < 100)", checked: false },
    { label: ">=100 <110", value: "(sectional_speed BETWEEN 100 AND 109)", checked: false },
    { label: ">=110 <120", value: "(sectional_speed BETWEEN 110 AND 119)", checked: false },
    { label: ">=120 <130", value: "(sectional_speed BETWEEN 120 AND 129)", checked: false },
    { label: ">=130 <140", value: "(sectional_speed BETWEEN 130 AND 139)", checked: false },
    { label: ">=140 <150", value: "(sectional_speed BETWEEN 140 AND 149)", checked: false },
    { label: ">=150 <150", value: "(sectional_speed BETWEEN 150 AND 159)", checked: false },
    { label: ">=160", value: "(sectional_speed >= 160)", checked: false },
  ]);
  const [sectionalGMTValuesFromLayer, setSectionalGMTValuesFromLayer] = useState([
    { label: "All", value: "All", checked: false },
    { label: "<50", value: "(sectional_gmt < 50)", checked: false },
    { label: ">=50 <60", value: "(sectional_gmt BETWEEN 50 AND 59)", checked: false },
    { label: ">=60 <70", value: "(sectional_gmt BETWEEN 60 AND 69)", checked: false },
    { label: ">=70 <80", value: "(sectional_gmt BETWEEN 70 AND 79)", checked: false },
    { label: ">=80 <90", value: "(sectional_gmt BETWEEN 80 AND 89)", checked: false },
    { label: ">=90 <100", value: "(sectional_gmt BETWEEN 90 AND 99)", checked: false },
    { label: ">100", value: "(sectional_gmt > 100)", checked: false },
  ]);
  const [selectedTypeOfRouteValues, setSelectedTypeOfRouteValues] = useState([]);
  const [selectedSectionalSpeedValues, setSelectedSectionalSpeedValues] = useState([]);
  const [selectedSectionalGMTValues, setSelectedSectionalGMTValues] = useState([]);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [resetButtonDisabled, setResetButtonDisabled] = useState(true);

  //Binding the data to the QueryBuilder
  useEffect(() => {
    const bindSpecialRouteDatas = async () => {
      try {
        const response = await fetch(`${globalUrlConfig.REACT_APP_API_BASE_URL}/getSpecialRouteData`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        const sortedTypeOfRoute = result.data.typeOfRoute.map(tor => ({ value: tor, checked: true }));
        setTypeOfRouteValuesFromLayer([{ value: "All", checked: true }, ...sortedTypeOfRoute]);
        setSelectedTypeOfRouteValues(result.data.typeOfRoute.map(tor => tor));
      } catch (err) {
        console.log(err)
      } finally {
        //
      }
    }
    bindSpecialRouteDatas();
  }, []);

  //#region Type of Rail 
  const handletypeOfRouteDropdown = (e) => {
    e.preventDefault()
    setTypeOfRouteDropdown(!typeOfRouteDropdown);
    setSectionalSpeedDropdown(false);
    setSectionalGMTDropdown(false);
  };
  const closeTypeOfRouteDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTypeOfRouteDropdown(false);
  }
  const handleTypeOfRailValue = (value) => (event) => {
    let selectedValue = value.value;
    let isChecked = event.target.checked;
    const { updatedValuesFromLayer, selectedValues } = updateValues(
      selectedValue,
      isChecked,
      typeOfRouteValuesFromLayer,
      selectedTypeOfRouteValues
    );
    setTypeOfRouteValuesFromLayer(updatedValuesFromLayer);
    setSelectedTypeOfRouteValues(selectedValues)
  };
  //#endregion
  // #region Grade of Steel functionality start here
  const handlesectionalSpeedDropdown = (e) => {
    e.preventDefault()
    setTypeOfRouteDropdown(false);
    setSectionalSpeedDropdown(!sectionalSpeedDropdown);
    setSectionalGMTDropdown(false);
  };
  const closeSectionalSpeedDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSectionalSpeedDropdown(false);
  }

  const handleGradeOfSteelValue = (value) => (event) => {
    let selectedValue = value.value;
    let isChecked = event.target.checked;
    let updatedValuesFromLayer;
    let selectedValues = [...selectedSectionalSpeedValues];
    if (selectedValue === "All") {
      updatedValuesFromLayer = sectionalSpeedValuesFromLayer.map((v) => ({ ...v, checked: isChecked }));
      selectedValues = isChecked ? sectionalSpeedValuesFromLayer.map((v) => v.value) : [];
    } else {
      updatedValuesFromLayer = sectionalSpeedValuesFromLayer.map((v) =>
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
    setSectionalSpeedValuesFromLayer(updatedValuesFromLayer);
    setSelectedSectionalSpeedValues(selectedValues);
  };
  //#endregion
  // #region Whether Flaw Detected
  const handlesectionalGMTDropdown = (e) => {
    e.preventDefault()
    setTypeOfRouteDropdown(false);
    setSectionalSpeedDropdown(false);
    setSectionalGMTDropdown(!sectionalGMTDropdown);
  };
  const closeSectionalGMTDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSectionalGMTDropdown(false);
  }
  const handleFlawDetectedValue = (value) => (event) => {
    let selectedValue = value.value;
    let isChecked = event.target.checked;

    let updatedValuesFromLayer;
    let selectedValues = [...selectedSectionalGMTValues];

    if (selectedValue === "All") {
      updatedValuesFromLayer = sectionalGMTValuesFromLayer.map((v) => ({ ...v, checked: isChecked }));
      selectedValues = isChecked ? sectionalGMTValuesFromLayer.map((v) => v.value) : [];
    } else {
      updatedValuesFromLayer = sectionalGMTValuesFromLayer.map((v) =>
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
    setSectionalGMTValuesFromLayer(updatedValuesFromLayer);
    setSelectedSectionalGMTValues(selectedValues)
  };


  // #endregion
  //Querying the data 
  let storedQueryObject;
  let cQuery;
  const handleQueryData = async () => {
    storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
    if (selectedTypeOfRouteValues.length === 0 && selectedSectionalSpeedValues.length === 0 && selectedSectionalGMTValues.length === 0) {
      return toast("One or more field value is empty");
    };
    startLoaderForQueryBuilder(id);
    setSubmitButtonDisabled(true);
    let typeOfRouteQuery = "";
    let sectionalSpeedQuery = "";
    let sectionalGMTQuery = "";
    let finalQuery = "";

    if (selectedTypeOfRouteValues.length > 0) {
      typeOfRouteQuery = "type_of_route in ('" + selectedTypeOfRouteValues.map(sr => sr).join("','") + "')";
    }
    if (selectedSectionalSpeedValues.length > 0) {
      const filteredValues = selectedSectionalSpeedValues.filter(value => value !== 'All');
      sectionalSpeedQuery = "(" + filteredValues.map(sr => sr).join(" or ") + ")";
    }
    if (selectedSectionalGMTValues.length > 0) {
      const filteredValues = selectedSectionalGMTValues.filter(value => value !== 'All');
      sectionalGMTQuery = "(" + filteredValues.map(sr => sr).join(" or ") + ")";
    }
    cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
    if (layer) {
      finalQuery = cQuery !== "" ?
        [typeOfRouteQuery, sectionalSpeedQuery, sectionalGMTQuery, cQuery].filter(Boolean).join(" AND ") :
        [typeOfRouteQuery, sectionalSpeedQuery, sectionalGMTQuery].filter(Boolean).join(" AND ");
      if (storedQueryObject) {
        const updatedQueryObject = storedQueryObject.map(item =>
          item.id === 7 ? { ...item, query: finalQuery } : item
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
    setTypeOfRouteDropdown(false)
    setSectionalSpeedDropdown(false)
    setSectionalGMTDropdown(false)
  };
  const handleResetData = async () => {
    startLoaderForQueryBuilder(id);
    setResetButtonDisabled(true);
    setSelectedTypeOfRouteValues([]);
    setSelectedSectionalSpeedValues([]);
    setSelectedSectionalGMTValues([]);
    storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
    cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
    if (storedQueryObject) {
      const updatedQueryObject = storedQueryObject.map(item =>
        item.id === 7 ? { ...item, query: "" } : item
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
    setTypeOfRouteValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
    setSectionalSpeedValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
    setSectionalGMTValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
    stopLoaderForQueryBuilder(id);

  }
  return (
    <div className="queryDiv" style={{ width: "415px" }}>
      <div className="queryDiv-heading">
        <h6>Query Builder</h6>
      </div>
      <div className="queryDiv-field">
        <span>Type of Route :</span>
        <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handletypeOfRouteDropdown} ref={typeOfRoute} >
          <button>
            {selectedTypeOfRouteValues.length > 0 ? (
              <>
                {areAllValuesSelected(typeOfRouteValuesFromLayer, selectedTypeOfRouteValues) ? (
                  <span key="all" className='displayValue'>All</span>
                ) : (
                  selectedTypeOfRouteValues.map((sv, index) => (
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
          typeOfRouteDropdown &&
          <div className="dropdownOption increaseDropdownWidth">
            <div className="lableDiv">
              {
                typeOfRouteValuesFromLayer && typeOfRouteValuesFromLayer.map((value, index) => (
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
            <UpArrowButton closeDropdown={closeTypeOfRouteDropdown} />
          </div>
        }
      </div>
      <div className="queryDiv-field">
        <span>Sectional Speed (Kmph) :</span>
        <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handlesectionalSpeedDropdown} ref={sectionalSpeedRef} >
          <button>
            {selectedSectionalSpeedValues.length > 0 ? (
              <>
                {areAllValuesSelected(sectionalSpeedValuesFromLayer, selectedSectionalSpeedValues) ? (
                  <span key="all" className='displayValue'>All</span>
                ) : (
                  selectedSectionalSpeedValues.map((sv, index) => {
                    const matchedValue = sectionalSpeedValuesFromLayer.find(v => v.value === sv);
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
          sectionalSpeedDropdown &&
          <div className="dropdownOption increaseDropdownWidth">
            <div className="lableDiv">
              {
                sectionalSpeedValuesFromLayer && sectionalSpeedValuesFromLayer.map((value, index) => (
                  <label key={index} className='labelWithInput'>
                    <input
                      type="checkbox"
                      id={`checkbox-${index}`}
                      value={value.value}
                      onChange={handleGradeOfSteelValue(value)}
                      checked={value.checked}
                    />
                    {value.label}
                  </label>
                ))
              }
            </div>
            <UpArrowButton closeDropdown={closeSectionalSpeedDropdown} />
          </div>
        }
      </div>
      <div className="queryDiv-field">
        <span>Sectional GMT :</span>
        <div className={`queryDiv-field-btn increaseDivWidth`} onClick={handlesectionalGMTDropdown} ref={sectionalGMTRef} >
          {/* <button>
            {selectedSectionalGMTValues.length > 0 ? (
              <>
                {areAllValuesSelected(sectionalGMTValuesFromLayer, selectedSectionalGMTValues) ? (
                  <span key="all" className='displayValue'>All</span>
                ) : (
                  selectedSectionalGMTValues.map((sv, index) => (
                    <span key={index} className='displayValue'>{sv}</span>
                  ))
                )}
              </>
            ) : (
              <span>Select Value</span>
            )}
          </button> */}
          <button>
            {selectedSectionalGMTValues.length > 0 ? (
              <>
                {areAllValuesSelected(sectionalGMTValuesFromLayer, selectedSectionalGMTValues) ? (
                  <span key="all" className='displayValue'>All</span>
                ) : (
                  selectedSectionalGMTValues.map((sv, index) => {
                    const matchedValue = sectionalGMTValuesFromLayer.find(v => v.value === sv);
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
          sectionalGMTDropdown &&
          <div className="dropdownOption increaseDropdownWidth">
            <div className="lableDiv">
              {
                sectionalGMTValuesFromLayer && sectionalGMTValuesFromLayer.map((value, index) => (
                  <label key={index} className='labelWithInput'>
                    <input
                      type="checkbox"
                      id={`checkbox-${index}`}
                      value={value.value}
                      onChange={handleFlawDetectedValue(value)}
                      checked={value.checked}
                    />
                    {value.label}
                  </label>
                ))
              }
            </div>
            <UpArrowButton closeDropdown={closeSectionalGMTDropdown} />
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
  )
}

export default SpecialRouteQuery