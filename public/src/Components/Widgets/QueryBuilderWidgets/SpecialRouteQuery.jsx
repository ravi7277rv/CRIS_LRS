import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deffinitionExpression } from '../../../Templates/Template';
import { updateValues, areAllValuesSelected, queryAndDisplayFeatures } from '../../Utils/Functions';
import UpArrowButton from '../../Buttons/UpArrowButton';
import QueryButtons from '../../Buttons/QueryButtons';

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
  const [sectionalSpeedValuesFromLayer, setSectionalSpeedValuesFromLayer] = useState([]);
  const [sectionalGMTValuesFromLayer, setSectionalGMTValuesFromLayer] = useState([]);
  const [selectedTypeOfRouteValues, setSelectedTypeOfRouteValues] = useState([]);
  const [selectedSectionalSpeedValues, setSelectedSectionalSpeedValues] = useState([]);
  const [selectedSectionalGMTValues, setSelectedSectionalGMTValues] = useState([]);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [resetButtonDisabled, setResetButtonDisabled] = useState(true);
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
  useEffect(() => {
    const typeOfRouteData = async () => {
      let query = layer.createQuery();
      // query.where = deffinitionExpression;
      query.outFields = ["type_of_route"];
      const result = await layer.queryFeatures(query);
      const uniqueValues = new Set();
      result.features.forEach((feature) => {
        const attributeValue = feature.attributes["type_of_route"];
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
      setTypeOfRouteValuesFromLayer([{ value: "All", checked: true }, ...sortedValues]);
      setSelectedTypeOfRouteValues(sortedValues.map(v => v.value))
    }
    typeOfRouteData();
  }, []);
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
  useEffect(() => {
    const sectionalSpeedData = async () => {
      let query = layer.createQuery();
      // query.where = deffinitionExpression;
      query.outFields = ["sectional_speed"];
      const result = await layer.queryFeatures(query);
      const uniqueValues = new Set();
      result.features.forEach((feature) => {
        const attributeValue = feature.attributes["sectional_speed"];
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
      setSectionalSpeedValuesFromLayer([{ value: "All", checked: true }, ...sortedValues]);
      setSelectedSectionalSpeedValues(sortedValues.map(v => v.value));
    }
    sectionalSpeedData();
  }, []);
  const handleGradeOfSteelValue = (value) => (event) => {
    let selectedValue = value.value;
    let isChecked = event.target.checked;
    const { updatedValuesFromLayer, selectedValues } = updateValues(
      selectedValue,
      isChecked,
      sectionalSpeedValuesFromLayer,
      selectedSectionalSpeedValues
    );
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
    const { updatedValuesFromLayer, selectedValues } = updateValues(
      selectedValue,
      isChecked,
      sectionalGMTValuesFromLayer,
      selectedSectionalGMTValues
    );
    setSectionalGMTValuesFromLayer(updatedValuesFromLayer);
    setSelectedSectionalGMTValues(selectedValues)
  };

  useEffect(() => {
    const sectionalGMTData = async () => {
      let query = layer.createQuery();
      // query.where = deffinitionExpression;
      query.outFields = ["sectional_gmt"];
      const result = await layer.queryFeatures(query);
      const uniqueValues = new Set();
      result.features.forEach((feature) => {
        const attributeValue = feature.attributes["sectional_gmt"];
        const formattedValue = parseFloat(attributeValue).toFixed(2);
        if (formattedValue) {
          const valueObject = { value: formattedValue, checked: true };
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
      const sortedValues = uniqueValuesArray.sort(comparator).filter(f => f.value !== "NaN");
      setSectionalGMTValuesFromLayer([{ value: "All", checked: true }, ...sortedValues]);
      setSelectedSectionalGMTValues(sortedValues.map(v => v.value));
    }
    sectionalGMTData();
  }, []);
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
      sectionalSpeedQuery = "sectional_speed in (" + selectedSectionalSpeedValues.map(sr => sr).join(",") + ")";
    }
    if (selectedSectionalGMTValues.length > 0) {
      sectionalGMTQuery = "sectional_gmt in (" + selectedSectionalGMTValues.map(sr => sr).join(",") + ")";
    }
    cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
    if (layer) {
      // finalQuery = [typeOfRouteQuery, sectionalSpeedQuery, sectionalGMTQuery].filter(Boolean).join(" AND ");
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
      queryAndDisplayFeatures(undefined,layer, cQuery, view);
    } else {
      layer.definitionExpression = "1=1";
      newMapObj.newView.extent = layer.fullExtent;
    }
    setTypeOfRouteValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
    setSectionalSpeedValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
    setSectionalGMTValuesFromLayer(prevValues => prevValues.map(value => ({ ...value, checked: false })));
    const layerView = await view.whenLayerView(layer);
    const handle = layerView.watch("updating", (updating) => {
      if (!updating) {
        stopLoaderForQueryBuilder(id);
        handle.remove();
      }
    });
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
                  selectedSectionalSpeedValues.map((sv, index) => (
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
                    {value.value}
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
          <button>
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
                    {value.value}
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