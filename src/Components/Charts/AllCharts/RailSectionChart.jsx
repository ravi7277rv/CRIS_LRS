import React, { useState, useEffect, useRef } from "react";
import { LoaderForCharts } from "../../Loader/Loader";
import BarChart from "../ChartsSubComponents/BarChart";
import PieChart from "../ChartsSubComponents/PieChart";
import { filterLayer } from "../../Utils/Functions";

const RailSectionChart = ({ newMapObj, layer, cQuery, bQuery }) => {
  let id = newMapObj.id;
  let view = newMapObj.newView;
  const [zones, setZones] = useState([]);
  const [tracklengthsZoneWise, setTracklengthsZoneWise] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [tracklengthsDivisionWise, setTracklengthsDivisionWise] = useState([]);
  const [railSection, setRailSection] = useState([]);
  const [tracklengthsRailSectionWise, setTracklengthsRailSectionWise] = useState([]);
  const [gradeOfSteel, setGradeOfSteel] = useState([]);
  const [tracklengthsGradeOfSteelWise, setTracklengthsGradeOfSteelWise] = useState([]);
  const [specialRoute, setSpecialRoute] = useState([]);
  const [tracklengthsSpecialRouteWise, setTracklengthsSpecialRouteWise] = useState([]);
  const [chartQuery, setChartQuery] = useState({
    zoneQuery: "",
    divisionQuery: "",
    yearQuery: "",
    railSectionQuery: "",
    gradeOfSteelQuery: "",
    typeOfRouteQuery: "",
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
    const getRailSection = async () => {
      let bQueryString = "";
      let cQueryString = "";
      let railwayQueryString = "";
      let divisionQueryString = "";
      let yearQueryString = "";
      let railSectionQueryString = "";
      let gradeOfSteelQueryString = "";
      let typeOfRouteQueryString = "";
      try {
        let query = await layer.createQuery();
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
        if (chartQuery.railSectionQuery !== "") {
          railSectionQueryString = chartQuery.railSectionQuery;
        }
        if (chartQuery.gradeOfSteelQuery !== "") {
          gradeOfSteelQueryString = chartQuery.gradeOfSteelQuery;
        }
        if (chartQuery.gradeOfSteelQuery !== "") {
          gradeOfSteelQueryString = chartQuery.gradeOfSteelQuery;
        }
        if (chartQuery.typeOfRouteQuery !== "") {
          typeOfRouteQueryString = chartQuery.typeOfRouteQuery;
        }
        let fQ = [cQueryString, bQueryString, railwayQueryString, divisionQueryString, yearQueryString, railSectionQueryString, gradeOfSteelQueryString, typeOfRouteQueryString].filter(Boolean).join(" AND ");
        if (fQ !== "") {
          query.where += ` AND ${fQ}`
        }
        const result = await layer.queryFeatures(query);
        const tracklengthsZoneWiseObj = {};
        const tracklengthsDivisionWiseObj = {};
        const tracklengthsRailSectionWiseObj = {};
        const tracklengthsGradeOfSteelWiseObj = {};
        const tracklengthsSpecialRouteWiseObj = {};

        result.features.forEach((feature) => {
          const zone = feature.attributes["railway"];
          const division = feature.attributes["division"];
          const railSection = feature.attributes["rail_section"]
          const length = feature.attributes['to_measurement'] - feature.attributes['from_measurement'];
          const gradeOfSteel = feature.attributes["grade_of_steel"]
          const specialRoute = feature.attributes["type_of_route"]
          if (zone) {
            if (!tracklengthsZoneWiseObj[zone]) {
              tracklengthsZoneWiseObj[zone] = 0;
            }
            tracklengthsZoneWiseObj[zone] += length;
          }
          if (division) {
            if (!tracklengthsDivisionWiseObj[division]) {
              tracklengthsDivisionWiseObj[division] = 0;
            }
            tracklengthsDivisionWiseObj[division] += length;
          }
          if (railSection) {
            if (!tracklengthsRailSectionWiseObj[railSection]) {
              tracklengthsRailSectionWiseObj[railSection] = 0;
            }
            tracklengthsRailSectionWiseObj[railSection] += length;
          }
          if (gradeOfSteel) {
            if (!tracklengthsGradeOfSteelWiseObj[gradeOfSteel]) {
              tracklengthsGradeOfSteelWiseObj[gradeOfSteel] = 0;
            }
            tracklengthsGradeOfSteelWiseObj[gradeOfSteel] += length;
          }
          if (specialRoute) {
            if (!tracklengthsSpecialRouteWiseObj[specialRoute]) {
              tracklengthsSpecialRouteWiseObj[specialRoute] = 0;
            }
            tracklengthsSpecialRouteWiseObj[specialRoute] += length;
          }
        });
        const uniqueZone = Object.keys(tracklengthsZoneWiseObj).map((zone) => ({
          value: zone,
          length: tracklengthsZoneWiseObj[zone],
        }));
        setZones([]);
        setZones(uniqueZone.map((uz) => uz.value));
        setTracklengthsZoneWise([])
        setTracklengthsZoneWise(
          uniqueZone.map(uz => (uz.length / 1000).toFixed(3))
        );
        const uniqueDivisions = Object.keys(tracklengthsDivisionWiseObj).map((division) => ({
          value: division,
          length: tracklengthsDivisionWiseObj[division],
        }));
        setDivisions([]);
        setDivisions(uniqueDivisions.map((ud) => ud.value));
        setTracklengthsDivisionWise([])
        setTracklengthsDivisionWise(
          uniqueDivisions.map(ud => (ud.length / 1000).toFixed(3))
        );
        const uniqueRailSection = Object.keys(tracklengthsRailSectionWiseObj).map((railSection) => ({
          value: railSection,
          length: (tracklengthsRailSectionWiseObj[railSection]),
        }));
        setRailSection([]);
        setRailSection(uniqueRailSection.map((ud) => ud.value));
        setTracklengthsRailSectionWise([])
        setTracklengthsRailSectionWise(
          uniqueRailSection.map(ud => parseFloat((ud.length / 1000).toFixed(3)))
        );
        const uniqueGradeOfSteel = Object.keys(tracklengthsGradeOfSteelWiseObj).map((grade_of_steel) => ({
          value: grade_of_steel,
          length: (tracklengthsGradeOfSteelWiseObj[grade_of_steel]),
        }));
        setGradeOfSteel([]);
        setGradeOfSteel(uniqueGradeOfSteel.map((ud) => ud.value));
        setTracklengthsGradeOfSteelWise([])
        setTracklengthsGradeOfSteelWise(
          uniqueGradeOfSteel.map(ud => parseFloat((ud.length / 1000).toFixed(3)))
        );
        const uniqueSpecialRoute = Object.keys(tracklengthsSpecialRouteWiseObj).map((grade_of_steel) => ({
          value: grade_of_steel,
          length: (tracklengthsSpecialRouteWiseObj[grade_of_steel]),
        }));
        setSpecialRoute([]);
        setSpecialRoute(uniqueSpecialRoute.map((ud) => ud.value));
        setTracklengthsSpecialRouteWise([])
        setTracklengthsSpecialRouteWise(
          uniqueSpecialRoute.map(ud => parseFloat((ud.length / 1000).toFixed(3)))
        );
      } catch (error) {
        console.log('Error while Querying Data', error);
      }
    };

    getRailSection();
  }, [layer, cQuery, bQuery, chartQuery]);

  const filterByZone = (zone) => {
    filterLayer(id, view, "railway", zone, setChartQuery);
  };
  const filterByDivision = (division) => {
    filterLayer(id, view, "division", division, setChartQuery);
  };
  const filterByRailSection = (railsection) => {
    filterLayer(id, view, "rail_section", railsection, setChartQuery)
  };
  const filterByGradeOfSteel = (gradeofsteel) => {
    filterLayer(id, view, "grade_of_steel", gradeofsteel, setChartQuery)
  };
  const filterBySpecialRoute = (typeofroute) => {
    filterLayer(id, view, "type_of_route", typeofroute, setChartQuery)
  };

  return (
    <div ref={containerRef} className="chartContainer" style={{ width: `${containerSize.width}px`, top: "-125px" }}>
      <div className="chartContainerHeading">
        <button onMouseDown={handleMouseDown} className="btnDragOver">&#8592;</button>
        <span>Rail Sectiona Analysis</span>
      </div>
      <div className="chartContainerBody" style={{ width: `${(containerSize.width) - 4}px` }}>
        {
          gradeOfSteel && gradeOfSteel.length === 0 ?
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
                    title="No. of Rail Fractures - Zone Wise"
                    dataSeries={tracklengthsZoneWise}
                    categories={zones}
                    filterData={filterByZone}
                    xTitle="Zones"
                    yTitle="No. of Fractures"
                    color={"#ff6401"}
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
                    title="No. of Rail Fractures - Division Wise"
                    dataSeries={tracklengthsDivisionWise}
                    categories={divisions}
                    filterData={filterByDivision}
                    xTitle="Divisions"
                    yTitle="No. of Fractures"
                    color={"#ff6401"}
                    cQuery={cQuery}
                    bQuery={bQuery}
                    lastThreeyears={undefined}
                    view={view}
                    width={((containerSize.width) - 40) < 550 ? ((containerSize.width) - 40) : 600}
                    setChartQuery={setChartQuery}
                  />
                </div>
                <div className="chartContainerZW">
                  <PieChart
                    title="No. of Fractures - Rail Sections Wise"
                    dataSeries={tracklengthsRailSectionWise}
                    labels={railSection}
                    filterData={filterByRailSection}
                    cQuery={cQuery}
                    bQuery={bQuery}
                    lastThreeyears={undefined}
                    view={view}
                    width={((containerSize.width) - 40) < 550 ? ((containerSize.width) - 40) : 600}
                    setChartQuery={setChartQuery}
                  />
                </div>
                <div className="chartContainerZW">
                  <PieChart
                    id={id}
                    title="No. of Fractures - Grade of Steel Wise"
                    dataSeries={tracklengthsGradeOfSteelWise}
                    labels={gradeOfSteel}
                    filterData={filterByGradeOfSteel}
                    cQuery={cQuery}
                    bQuery={bQuery}
                    lastThreeyears={undefined}
                    view={view}
                    width={((containerSize.width) - 40) < 550 ? ((containerSize.width) - 40) : 600}
                    setChartQuery={setChartQuery}
                  />
                </div>
                <div className="chartContainerZW">
                  <PieChart
                    id={id}
                    title="No. of Fractures - Type of Route Wise"
                    dataSeries={tracklengthsSpecialRouteWise}
                    labels={specialRoute}
                    filterData={filterBySpecialRoute}
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

export default RailSectionChart