import React, { useState, useEffect, useRef } from "react";
import { LoaderForCharts } from "../../Loader/Loader";
import BarChart from "../ChartsSubComponents/BarChart";
import { filterLayer } from "../../Utils/Functions";

const OMSRepeatedLocationChart = ({ newMapObj, layer, cQuery, bQuery, lastThreeyears }) => {
  let id = newMapObj.id;
  let view = newMapObj.newView;
  const [zones, setZones] = useState([]);
  const [peakLocationsZoneWise, setPeakLocationsZoneWise] = useState({ zones: [], series: [] });
  const [peakLocationsDivisionWise, setPeakLocationsDivisionWise] = useState({ divisions: [], series: [] });
  const [peakLocationsSectionWise, setPeakLocationsSectionWise] = useState({ sections: [], series: [] });
  const [chartQuery, setChartQuery] = useState({
    zoneQuery: "",
    divisionQuery: "",
    sectionQuery: "",
  });
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 500 });

  const handleMouseMove = (e) => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;
    if (newWidth > 500 && newWidth < 1300) {
      setContainerSize({ width: newWidth });
    }
  };
  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
  const handleMouseDown = () => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    const getOMSRepeatedLocation = async () => {
      
      let bQueryString = "";
      let cQueryString = "";
      let railwayQueryString = "";
      let divisionQueryString = "";
      let sectionQueryString = "";
      try {
        let query = await layer.createQuery();
        query.where = `oms_year in (${lastThreeyears.join(",")})`;
        if (cQuery) {
          cQueryString = cQuery;
        }
        if (bQuery) {
          bQueryString = bQuery;
        }
        if (chartQuery.zoneQuery !== "") {
          railwayQueryString = chartQuery.zoneQuery;
        }
        if (chartQuery.divisionQuery !== "") {
          divisionQueryString = chartQuery.divisionQuery;
        }
        if (chartQuery.sectionQuery !== "") {
          sectionQueryString = chartQuery.sectionQuery;
        }
        let fQ = [cQueryString, bQueryString, railwayQueryString, divisionQueryString, sectionQueryString].filter(Boolean).join(" AND ");
        if (fQ !== "") {
          query.where += ` AND ${fQ}`
        }
        const result = await layer.queryFeatures(query);
        const peakLocationsZoneWiseObj = {};
        const peakLocationsDivisionWiseObj = {};
        const peakLocationsSectionWiseObj = {};
        result.features.forEach((feature) => {
          const zone = feature.attributes?.["railway"];
          const division = feature.attributes?.["division"];
          const section = feature.attributes?.["section"];
          const peakValue = parseFloat(feature.attributes?.["peak_value"]);
          if (zone) {
            if (!peakLocationsZoneWiseObj[zone]) {
              peakLocationsZoneWiseObj[zone] = { '0.15-0.20': 0, '>0.20': 0 };
            }
            if (peakValue > 0.15 && peakValue < 0.20) {
              peakLocationsZoneWiseObj[zone]['0.15-0.20'] += 1;
            } else if (peakValue >= 0.20) {
              peakLocationsZoneWiseObj[zone]['>0.20'] += 1;
            }
          }
          if (division) {
            if (!peakLocationsDivisionWiseObj[division]) {
              peakLocationsDivisionWiseObj[division] = { '0.15-0.20': 0, '>0.20': 0 };
            }
            if (peakValue > 0.15 && peakValue < 0.20) {
              peakLocationsDivisionWiseObj[division]['0.15-0.20'] += 1;
            } else if (peakValue >= 0.20) {
              peakLocationsDivisionWiseObj[division]['>0.20'] += 1;
            }
          }
          if (section) {
            if (!peakLocationsSectionWiseObj[section]) {
              peakLocationsSectionWiseObj[section] = { '0.15-0.20': 0, '>0.20': 0 };
            }
            if (peakValue > 0.15 && peakValue < 0.20) {
              peakLocationsSectionWiseObj[section]['0.15-0.20'] += 1;
            } else if (peakValue >= 0.20) {
              peakLocationsSectionWiseObj[section]['>0.20'] += 1;
            }
          }
        });
        const zonesForPeak = Object.keys(peakLocationsZoneWiseObj);
        const seriesZonesPeak = [
          {
            name: ">0.15g",
            data: zonesForPeak.map(zone => peakLocationsZoneWiseObj[zone]["0.15-0.20"] || 0),
          },
          {
            name: ">0.20g",
            data: zonesForPeak.map(zone => peakLocationsZoneWiseObj[zone][">0.20"] || 0),
          }
        ];
        setPeakLocationsZoneWise({ zones: [], series: [] });
        setPeakLocationsZoneWise({ zones: zonesForPeak, series: seriesZonesPeak });
        const divisionsForPeak = Object.keys(peakLocationsDivisionWiseObj);
        const seriesDivisionsPeak = [
          {
            name: ">0.15g",
            data: divisionsForPeak.map(division => peakLocationsDivisionWiseObj[division]["0.15-0.20"] || 0),
          },
          {
            name: ">0.20g",
            data: divisionsForPeak.map(division => peakLocationsDivisionWiseObj[division][">0.20"] || 0),
          }
        ];
        setPeakLocationsDivisionWise({ divisions: [], series: [] });
        setPeakLocationsDivisionWise({ divisions: divisionsForPeak, series: seriesDivisionsPeak });
        const sectionsForPeak = Object.keys(peakLocationsSectionWiseObj);
        const seriesSectionsPeak = [
          {
            name: ">0.15g",
            data: sectionsForPeak.map(section => peakLocationsSectionWiseObj[section]["0.15-0.20"] || 0),
          },
          {
            name: ">0.20g",
            data: sectionsForPeak.map(section => peakLocationsSectionWiseObj[section][">0.20"] || 0),
          }
        ];
        setPeakLocationsSectionWise({ sections: [], series: [] });
        setPeakLocationsSectionWise({ sections: sectionsForPeak, series: seriesSectionsPeak });
      } catch (error) {
        console.log('Error while Querying Data', error);
      }
    };

    getOMSRepeatedLocation();
  }, [layer, cQuery, bQuery, chartQuery,lastThreeyears]);

  const filterByZone = (zone) => {
    filterLayer(id, view, "railway", zone, setChartQuery);
  };
  const filterByDivision = (division) => {
    filterLayer(id, view, "division", division, setChartQuery);
  };
  const filterBySection = (section) => {
    filterLayer(id, view, "section", section, setChartQuery)
  };
  return (
    <div ref={containerRef} className="chartContainer" style={{ width: `${containerSize.width}px`, top: "-125px" }}>
      <div className="chartContainerHeading">
        <button onMouseDown={handleMouseDown} className="btnDragOver">&#8592;</button>
        <span>Rail Fractures</span>
      </div>
      <div className="chartContainerBody" style={{ width: `${(containerSize.width) - 4}px` }}>
        {
          peakLocationsSectionWise && peakLocationsSectionWise.sections.length === 0 ?
            (
              <>
                <LoaderForCharts />
              </>
            ) :
            (
              <>
                <div className="chartContainerZW">
                  <BarChart
                    id={id}
                    title="No. of Locations - Zone Wise"
                    dataSeries={peakLocationsZoneWise.series}
                    categories={peakLocationsZoneWise.zones}
                    filterData={filterByZone}
                    xTitle="Zones"
                    yTitle="No. of Locations"
                    color={["#d87495", "#640e3a"]}
                    cQuery={cQuery}
                    bQuery={bQuery}
                    lastThreeyears={undefined}
                    view={view}
                    width={((containerSize.width) - 40) < 550 ? ((containerSize.width) - 40) : 600}
                    setChartQuery={setChartQuery}
                  />
                </div>
                <div className="chartContainerZW">
                  <BarChart
                    id={id}
                    title="No. of Locations - Division Wise"
                    dataSeries={peakLocationsDivisionWise.series}
                    categories={peakLocationsDivisionWise.divisions}
                    filterData={filterByDivision}
                    xTitle="Divisions"
                    yTitle="No. of Locations"
                    color={["#d87495", "#640e3a"]}
                    cQuery={cQuery}
                    bQuery={bQuery}
                    lastThreeyears={undefined}
                    view={view}
                    width={((containerSize.width) - 40) < 550 ? ((containerSize.width) - 40) : 600}
                    setChartQuery={setChartQuery}
                  />
                </div>
                <div className="chartContainerZW">
                  <BarChart
                    id={id}
                    title="No. of Locations - Section Wise"
                    dataSeries={peakLocationsSectionWise.series}
                    categories={peakLocationsSectionWise.sections}
                    filterData={filterBySection}
                    xTitle="Sections"
                    yTitle="No. of Locations"
                    color={["#d87495", "#640e3a"]}
                    cQuery={cQuery}
                    bQuery={bQuery}
                    lastThreeyears={undefined}
                    view={view}
                    width={((containerSize.width) - 40) < 550 ? ((containerSize.width) - 40) : 600}
                    setChartQuery={setChartQuery}
                  />
                </div>
              </>
            )
        }
      </div>
    </div>
  )
}

export default OMSRepeatedLocationChart