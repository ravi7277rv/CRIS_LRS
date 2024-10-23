import React, { useState, useEffect } from 'react';
import './AssetCount.css';
import { extractDateTime, queryFeatureCounts } from '../Utils/Functions';
import { nbmlAssetCount } from '../../Templates/ScreenAsset';
import { LoaderForAsset } from '../Loader/Loader';


const AssetCount = ({ newMapObj, screenAsset, featureLayer, nbmlFeatureLayer, finalQuery, eventDataStatus }) => {
  let id = newMapObj.id;
  const [asset, setAsset] = useState(screenAsset[0]);
  const [assetData, setAssetData] = useState([]);
  useEffect(() => {
    const getYears = async () => {
      let query = featureLayer.createQuery();
      query.outFields = ["year"];
      const result = await featureLayer.queryFeatures(query);
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
        value: year,
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
      const yearValues = lastThreeYears.map(year => parseInt(year.value));
      setAsset(prev => {
        const updatedAsset = prev.asset.map((asset, index) => ({
          ...asset,
          year: yearValues[index] || asset.year
        }));
        return { ...prev, asset: updatedAsset };
      });
    };
    if (id === 4 || id === 6) {
      getYears();
    }
  }, [id])
  const fetchNBML = async () => {
    const data = await Promise.all(
      nbmlAssetCount.map(async (a) => {
        const count = await queryFeatureCounts(
          nbmlFeatureLayer,
          a.minValue,
          a.maxValue ? a.maxValue : a.minValue,
          a.field,
        );

        return { ...a, count };
      })
    );
    setAssetData(prev => [...prev, ...data])
  }

  useEffect(() => {
    let filteredQuery = finalQuery.filter(f => f.id === id);
    let filteredCustomQuery = finalQuery.filter(f => f.id === 16);
    let query = filteredQuery[0].query;
    let yearsArray = filteredQuery[0].years;
    let customQuery = filteredCustomQuery[0].query;
    const fetchData = async () => {
      if (asset && asset.asset) {
        const data = await Promise.all(
          asset.asset.map(async (a) => {
            const count = await queryFeatureCounts(
              featureLayer,
              a.minValue,
              a.maxValue ? a.maxValue : a.minValue,
              a.field,
              a.lr_rr,
              query,
              a.year,
              customQuery,
              id,
              yearsArray,
            );
            return { ...a, count };
          })
        );
        setAssetData(data);
        if (id === 11) {
          fetchNBML();
        }
      }
    };

    fetchData();
  }, [asset, featureLayer, finalQuery]);
  const { date, time } = extractDateTime(eventDataStatus[0].last_update)
  let idArray = [2, 3, 7, 8, 9, 10]
  return (
    <div className='asset'>
      <div className="assetHeading">
        <h6>Asset Info</h6>
      </div>
      <div className="assetTitle">
        <h6>{asset.title}</h6>
      </div>
      <div className="assetBody">
        {
          assetData.length === 0 ? (
            <div className='loaderDiv'>
              <LoaderForAsset />
            </div>
          ) : (
            <>
              {
                id === 4 || id === 6 ? (
                  <>
                    {
                      assetData && assetData.length > 0 &&
                      assetData.map((y, index) => (
                        <label className='assetLabel' key={index}>
                          <span className='assetCirclePoint' style={{ background: y.color }}></span>
                          <span className='assetDesc'>{y.year}</span>
                          <span className='assetCount'><b>({y.count})</b></span>
                        </label>
                      ))
                    }
                  </>
                ) : (
                  <>
                    {assetData && assetData.map((a, index) => (
                      <label className='assetLabel' key={index}>
                        {
                          asset.type === "polyline" ? (
                            <>
                              <span className='assetCirclePolyline' style={{ background: a.color }}></span>
                            </>
                          ) : (
                            <>
                              <span className='assetCirclePoint' style={{ background: a.color }}></span>
                            </>
                          )
                        }
                        <span className='assetDesc'>{a.label}</span>
                        <span className='assetCount'><b>({a.count})</b></span>

                      </label>
                    ))}
                  </>
                )
              }
            </>
          )
        }
      </div>
      <div className="assetFooter">
        {
          idArray.includes(id) === true ? (
            <span>Total : {assetData.reduce((acc, a) => acc + parseFloat(a.count), 0).toFixed(3)}</span>
          ) : (
            <>
              {
                id === 4 || id === 6 ? (
                  <>
                    <span>Total : {assetData.reduce((acc, a) => acc + parseInt(a.count), 0)}</span>
                  </>
                ) : (
                  <>
                    <span>Total : {assetData.reduce((acc, a) => acc + parseInt(a.count), 0)}</span>
                  </>
                )
              }
            </>
          )
        }
      </div>
      <div className="assetEventDataDiv">
        <span className='assetEventDataTitle'>Event Last Modified (Date & Time)</span>
        <span className='assetModifiedDate'>{date}&nbsp;&nbsp;&nbsp; {time}</span>
      </div>
    </div>
  )
}

export default AssetCount