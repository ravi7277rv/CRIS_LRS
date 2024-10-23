import React, { useState, useEffect } from 'react';
import './YearWiseDiv.css';
import $ from 'jquery';
import { deffinitionExpression } from '../../Templates/Template';

const YearWiseQuery = ({ id, layer, title, view }) => {
 
    const [yearWiseLabel, setYearWiseLabel] = useState([]);
    const [years, setYears] = useState([]);
    const [omsYears, setOmsYears] = useState([])
    const [omsUniqueYears, setOmsUniqueYears] = useState([]);
    let storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
    useEffect(() => {
        
        const getYears = async () => {
            let cquery;
            if(storedQueryObject){
                let filteredQuery = storedQueryObject.filter(f => f.id === 16);
                cquery = filteredQuery[0].query;
            }
            let query = layer.createQuery();
            if(cquery !== ""){
                query.where = cquery;
            }
            query.outFields = ["year"];
            const result = await layer.queryFeatures(query);
            const yearCounts = {};
            result.features.forEach((feature) => {
                const attributeValue = feature.attributes["year"];
                if (attributeValue) {
                    if (!yearCounts[attributeValue]) {
                        yearCounts[attributeValue] = 0;
                    }
                    yearCounts[attributeValue]++;
                }
            });
            const uniqueValues = Object.keys(yearCounts).map((year) => ({
                value: parseInt(year),
                count: yearCounts[year],
                checked: true,
            }));
            uniqueValues.sort((a, b) => {
                if (typeof a.value === 'number' && typeof b.value === 'number') {
                    return a.value - b.value;
                } else if (typeof a.value === 'string' && typeof b.value === 'string') {
                    return a.value.localeCompare(b.value);
                } else {
                    return String(a.value).localeCompare(String(b.value));
                }
            });
            const lastThreeYears = uniqueValues.length > 3 ? uniqueValues.slice(-3) : uniqueValues;
            setYearWiseLabel([...lastThreeYears]);
            const yearValues = lastThreeYears.map(year => parseInt(year.value));
            setYears([...yearValues]);
        };

        if (layer && id === 4 || id === 6) {
            getYears();
        }
    }, []);
    useEffect(() => {
        const getOMSYears = async () => {
            let cquery;
            if(storedQueryObject){
                let filteredQuery = storedQueryObject.filter(f => f.id === 16);
                cquery = filteredQuery[0].query;
            }
            let query = layer.createQuery();
            if(cquery !== ""){
                query.where = cquery;
            }
            query.outFields = ["oms_year"];
            const result = await layer.queryFeatures(query);
            const yearCounts = {};
            result.features.forEach((feature) => {
                const attributeValue = feature.attributes["oms_year"];
                if (attributeValue) {
                    if (!yearCounts[attributeValue]) {
                        yearCounts[attributeValue] = 0;
                    }
                    yearCounts[attributeValue]++;
                }
            });
            const uniqueValues = Object.keys(yearCounts).map((year) => ({
                value: parseInt(year),
                count: yearCounts[year],
                checked: true,
            }));
            uniqueValues.sort((a, b) => {
                if (typeof a.value === 'number' && typeof b.value === 'number') {
                    return a.value - b.value;
                } else if (typeof a.value === 'string' && typeof b.value === 'string') {
                    return a.value.localeCompare(b.value);
                } else {
                    return String(a.value).localeCompare(String(b.value));
                }
            });
            const lastThreeYears = uniqueValues.length > 3 ? uniqueValues.slice(-3) : uniqueValues;
            setOmsUniqueYears([...lastThreeYears]);
            const yearValues = lastThreeYears.map(year => parseInt(year.value));
            setOmsYears([...yearValues]);
        };
        if(layer && id === 12){
            getOMSYears();
        }
    }, [])
    const handleYearChange = (year) => (event) => {
        let value = parseInt(year.value);
        const isChecked = event.target.checked;

        const updatedYearWiseLabel = yearWiseLabel.map((y) =>
            y.value === value ? { ...y, checked: isChecked } : y
        );

        if (isChecked) {
            setYears(prev => [...prev, value]);
        } else {
            setYears(prev => prev.filter(p => p !== value));
        }
        setYearWiseLabel(updatedYearWiseLabel);
    };
    const heroFun = () => {
        
        let cquery;
        if(storedQueryObject){
            let filteredQuery = storedQueryObject.filter(f => f.id === 16);
            cquery = filteredQuery[0].query;
        }
        if (layer) {
            if (years.length === 0) {
                layer.definitionExpression = `1=1`;
            }
            else {
                if(cquery !== ''){
                    layer.definitionExpression = `year in (${years.join(",")}) AND (${cquery})`;
                }else{
                    layer.definitionExpression = "year in (" + years.join(",") + ")";
                }
                if (storedQueryObject) {
                    const updatedQueryObject = storedQueryObject.map(item =>
                        item.id === id ? { ...item, years: years } : item
                    );
                    sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
                }
            }

        }
    }
    useEffect(() => {
        heroFun();
    }, [yearWiseLabel, years]);
    const handleOmsYearChange = (year) => (event) => {
        let value = parseInt(year.value);
        const isChecked = event.target.checked;

        const updatedYearWiseLabel = omsUniqueYears.map((y) =>
            y.value === value ? { ...y, checked: isChecked } : y
        );

        if (isChecked) {
            setOmsYears(prev => [...prev, value]);
        } else {
            setOmsYears(prev => prev.filter(p => p !== value));
        }
        setOmsUniqueYears(updatedYearWiseLabel);
    };
    const omsHeroFun = () => {
        storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        let cquery;
        if(storedQueryObject){
            let filteredQuery = storedQueryObject.filter(f => f.id === 16);
            cquery = filteredQuery[0].query;
        }
        if (layer) {
            if (omsYears.length === 0) {
                layer.definitionExpression = `1=1`;
            }
            else {
                if(cquery !== ''){
                    layer.definitionExpression = `oms_year in (${omsYears.join(",")}) AND (${cquery})`;
                }else{
                    layer.definitionExpression = " oms_year in (" + omsYears.join(",") + ")";
                }
               
                if (storedQueryObject) {
                    const updatedQueryObject = storedQueryObject.map(item =>
                        item.id === id ? { ...item, years: omsYears } : item
                    );
                    sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
                }
            }

        }
    }
    useEffect(() => {
        omsHeroFun();
    }, [omsUniqueYears, omsYears]);

    return (
        <div className='yearQueryDiv'>
            <div className="heading">
                <h4>{title} </h4>
            </div>
            <div className="content">
                <div className="tag">
                    <span style={{fontSize:"14px", minWidth:"200px"}}>Year Wise {id === 12 ? "(No. of Locations)" : null}</span>
                </div>
                {
                    id === 12 ? (
                        <div className="checkBoxDiv">
                            {
                                omsUniqueYears && omsUniqueYears.map((year, index) => (
                                    <label
                                        key={index}
                                    >
                                        <input
                                            type="checkbox"
                                            value={year.value}
                                            onChange={handleOmsYearChange(year)}
                                            checked={year.checked}
                                            style={{ marginRight: "8px" }}
                                        />
                                        <span className='spanYearValue'>{year.value}</span><span className='spanYearCount'>({year.count})</span>
                                    </label>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="checkBoxDiv">
                            {
                                yearWiseLabel && yearWiseLabel.map((year, index) => (
                                    <label
                                        key={index}
                                    >
                                        <input
                                            type="checkbox"
                                            value={year.value}
                                            onChange={handleYearChange(year)}
                                            checked={year.checked}
                                            style={{ marginRight: "8px" }}
                                        />
                                        <span className='spanYearValue'>{year.value}</span><span className='spanYearCount'>({year.count})</span>
                                    </label>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default YearWiseQuery