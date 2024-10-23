import React, { useState, useEffect, useRef } from "react";
import { LoaderForCharts } from "../../Loader/Loader";
import BarChart from "../ChartsSubComponents/BarChart";
import PieChart from "../ChartsSubComponents/PieChart";
import { filterLayer } from "../../Utils/Functions";

const WeldFractureChart = ({ newMapObj, layer, cQuery, bQuery, lastThreeyears }) => {
  let id = newMapObj.id;
  let view = newMapObj.newView;
  let actualWidth = 260;
  let actualHeight = 228;
  const [zones, setZones] = useState([]);
  const [fracturesZoneWise, setFracturesZoneWise] = useState();
  const [divisions, setDivisions] = useState([]);
  const [fractureDivisionsWise, setFracturesDivisionsWise] = useState([]);
  const [years, setYears] = useState(lastThreeyears);
  const [fracturesYearsWise, setFracturesYearsWise] = useState([]);
  const [typeOfRails, setTypeOfRails] = useState([]);
  const [fracturesTypeOfRailsWise, setFracturesTypeOfRailsWise] = useState([]);
  const [gradeOfSteel, setGradeOfSteel] = useState([])
  const [fracturesGradeOfSteelWise, setFracturesGradeOfSteelWise] = useState([]);
  const [usfdClassification, setUsfdClassification] = useState([]);
  const [fracturesUSFDClassificationWise, setFracturesUSFDClassificationWise] = useState([]);
  const [chartQuery, setChartQuery] = useState({
    zoneQuery: "",
    divisionQuery: "",
    yearQuery: "",
    railSectionQuery: "",
    gradeOfSteelQuery: "",
    usfdQuery: "",
  });
  const [chartOneExpand, setChartOneExpand] = useState(false);
  const [chartTwoExpand, setChartTwoExpand] = useState(false);
  const [chartThreeExpand, setChartThreeExpand] = useState(false);
  const [chartFourExpand, setChartFourExpand] = useState(false);
  const [chartFiveExpand, setChartFiveExpand] = useState(false);
  const [chartSixExpand, setChartSixExpand] = useState(false);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 585 });
  const [chartOneWidthHeight, setChartOneWidthHeight] = useState({ width: "", height: "" });
  const [chartTwoWidthHeight, setChartTwoWidthHeight] = useState({ width: "", height: "" });
  const [chartThreeWidthHeight, setChartThreeWidthHeight] = useState({ width: "", height: "" });
  const [chartFourWidthHeight, setChartFourWidthHeight] = useState({ width: "", height: "" });
  const [chartFiveWidthHeight, setChartFiveWidthHeight] = useState({ width: "", height: "" });
  const [chartSixWidthHeight, setChartSixWidthHeight] = useState({ width: "", height: "" });

  useEffect(() => {
    setChartOneWidthHeight(prev => ({
      ...prev,
      width: actualWidth,
      height: actualHeight
    }));
    setChartTwoWidthHeight(prev => ({
      ...prev,
      width: actualWidth,
      height: actualHeight
    }));
    setChartThreeWidthHeight(prev => ({
      ...prev,
      width: actualWidth,
      height: actualHeight
    }));
    setChartFourWidthHeight(prev => ({
      ...prev,
      width: actualWidth,
      height: actualHeight
    }));
    setChartFiveWidthHeight(prev => ({
      ...prev,
      width: actualWidth,
      height: actualHeight
    }));
    setChartSixWidthHeight(prev => ({
      ...prev,
      width: actualWidth,
      height: actualHeight
    }));

  }, [])
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
    const getRailFractureDetails = async () => {
      
      let bQueryString = "";
      let cQueryString = "";
      let railwayQueryString = "";
      let divisionQueryString = "";
      let yearQueryString = "";
      let railSectionQueryString = "";
      let gradeOfSteelQueryString = "";
      let usfdQueryString = "";
      try {
        let query = await layer.createQuery();
        query.where = `year in (${lastThreeyears.join(",")})`;
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
        if (chartQuery.yearQuery !== "") {
          yearQueryString = chartQuery.yearQuery;
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
        if (chartQuery.usfdQuery !== "") {
          usfdQueryString = chartQuery.usfdQuery;
        }
        let fQ = [cQueryString, bQueryString, railwayQueryString, divisionQueryString, yearQueryString, railSectionQueryString, gradeOfSteelQueryString, usfdQueryString].filter(Boolean).join(" AND ");
        if (fQ !== "") {
          query.where += ` AND ${fQ}`
        }
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
        const uniqueYears = Object.keys(yearCounts).map((year) => ({
          value: year,
          count: yearCounts[year],
        }));
        setFracturesYearsWise([]);
        setFracturesYearsWise(uniqueYears.map(uv => uv.count));
        const zoneCounts = {};
        result.features.forEach((feature) => {
          const attributeValue = feature.attributes["railway"];
          if (attributeValue) {
            if (!zoneCounts[attributeValue]) {
              zoneCounts[attributeValue] = 0;
            }
            zoneCounts[attributeValue]++;
          }
        });
        const uniqueZones = Object.keys(zoneCounts).map((zone) => ({
          value: zone,
          count: zoneCounts[zone],
        }));
        setZones([]);
        setZones(uniqueZones.map(uz => uz.value));
        setFracturesZoneWise([])
        setFracturesZoneWise(uniqueZones.map(uz => uz.count))
        const divisionCount = {};
        result.features.forEach((feature) => {
          const attributeValue = feature.attributes["division"];
          if (attributeValue) {
            if (!divisionCount[attributeValue]) {
              divisionCount[attributeValue] = 0;
            }
            divisionCount[attributeValue]++;
          }
        });
        const uniqueDivisions = Object.keys(divisionCount).map((division) => ({
          value: division,
          count: divisionCount[division],
        }));
        setDivisions([]);
        setDivisions(uniqueDivisions.map(ud => ud.value));
        setFracturesDivisionsWise([]);
        setFracturesDivisionsWise(uniqueDivisions.map(ud => ud.count));
        const railSectionCount = {};
        result.features.forEach((feature) => {
          const attributeValue = feature.attributes["rail_section"];
          if (attributeValue) {
            if (!railSectionCount[attributeValue]) {
              railSectionCount[attributeValue] = 0;
            }
            railSectionCount[attributeValue]++;
          }
        });
        const uniqueRailsection = Object.keys(railSectionCount).map((railSec) => ({
          value: railSec,
          count: railSectionCount[railSec],
        }));
        setTypeOfRails([]);
        setTypeOfRails(uniqueRailsection.map(ur => ur.value));
        setFracturesTypeOfRailsWise([]);
        setFracturesTypeOfRailsWise(uniqueRailsection.map(ur => ur.count));
        const gradeOfSteelCount = {};
        result.features.forEach((feature) => {
          const attributeValue = feature.attributes["grade_of_steel"];
          if (attributeValue) {
            if (!gradeOfSteelCount[attributeValue]) {
              gradeOfSteelCount[attributeValue] = 0;
            }
            gradeOfSteelCount[attributeValue]++;
          }
        });
        const uniqueGradeOfSteel = Object.keys(gradeOfSteelCount).map((grade) => ({
          value: grade,
          count: gradeOfSteelCount[grade],
        }));
        setGradeOfSteel([]);
        setGradeOfSteel(uniqueGradeOfSteel.map(ug => ug.value));
        setFracturesGradeOfSteelWise([]);
        setFracturesGradeOfSteelWise(uniqueGradeOfSteel.map(ug => ug.count));
        const usfdClassificationCount = {};
        result.features.forEach((feature) => {
          const attributeValue = feature.attributes["usfd_classification"];
          if (attributeValue) {
            if (!usfdClassificationCount[attributeValue]) {
              usfdClassificationCount[attributeValue] = 0;
            }
            usfdClassificationCount[attributeValue]++;
          }
        });
        const uniqueUsfdClassification = Object.keys(usfdClassificationCount).map((usfd) => ({
          value: usfd,
          count: usfdClassificationCount[usfd],
        }));
        setUsfdClassification([]);
        setUsfdClassification(uniqueUsfdClassification.map(uu => uu.value));
        setFracturesUSFDClassificationWise([]);
        setFracturesUSFDClassificationWise(uniqueUsfdClassification.map(uu => uu.count));
      } catch (error) {
        console.log('Error while Querying RailFracture Datas', error);
      }
    }
    getRailFractureDetails();
  }, [layer, cQuery, bQuery, lastThreeyears, chartQuery]);
  const filterByZone = (zone) => {
    filterLayer(id, view, "railway", zone, setChartQuery);
  };
  const filterByDivision = (division) => {
    filterLayer(id, view, "division", division, setChartQuery);
  };
  const filterByYear = (year) => {
    filterLayer(id, view, "year", year, setChartQuery);
  };
  const filterByTypeOfRails = (railsection) => {
    filterLayer(id, view, "rail_section", railsection, setChartQuery)
  };
  const filterByGradeOfSteel = (gradeofsteel) => {
    filterLayer(id, view, "grade_of_steel", gradeofsteel, setChartQuery)
  };
  const filterByUSFDClassification = (usdfclassification) => {
    filterLayer(id, view, "usfd_classification", usdfclassification, setChartQuery)
  };
  const handleChartOneExpand = () => {
    if (chartOneExpand) {
      setChartOneWidthHeight(prev => ({
        ...prev, 
        width: actualWidth,
        height:actualHeight
      }));
      setChartOneExpand(false);
    } else {
      setChartOneWidthHeight(prev => ({
        ...prev,
        width: 530,
        height: 330
      }));
      setChartOneExpand(true);
    }
  };
  const handleChartTWoExpand = () => {
    if (chartTwoExpand) {
      setChartTwoWidthHeight(prev => ({
        ...prev, 
        width: actualWidth,
        height:actualHeight
      }));
      setChartTwoExpand(false);
    } else {
      setChartTwoWidthHeight(prev => ({
        ...prev,
        width: 530,
        height: 330
      }));
      setChartTwoExpand(true);
    }
  };
  const handleChartThreeExpand = () => {
    if (chartThreeExpand) {
      setChartThreeWidthHeight(prev => ({
        ...prev, 
        width: actualWidth,
        height:actualHeight
      }));
      setChartThreeExpand(false);
    } else {
      setChartThreeWidthHeight(prev => ({
        ...prev,
        width: 530,
        height: 330
      }));
      setChartThreeExpand(true);
    }
  };
  const handleChartFourExpand = () => {
    if (chartFourExpand) {
      setChartFourWidthHeight(prev => ({
        ...prev, 
        width: actualWidth,
        height:actualHeight
      }));
      setChartFourExpand(false);
    } else {
      setChartFourWidthHeight(prev => ({
        ...prev,
        width: 530,
        height: 330
      }));
      setChartFourExpand(true);
    }
  };
  const handleChartFiveExpand = () => {
    if (chartFiveExpand) {
      setChartFiveWidthHeight(prev => ({
        ...prev, 
        width: actualWidth,
        height:actualHeight
      }));
      setChartFiveExpand(false);
    } else {
      setChartFiveWidthHeight(prev => ({
        ...prev,
        width: 530,
        height: 330
      }));
      setChartFiveExpand(true);
    }
  };
  const handleChartSixExpand = () => {
    if (chartSixExpand) {
      setChartSixWidthHeight(prev => ({
        ...prev, 
        width: actualWidth,
        height:actualHeight
      }));
      setChartSixExpand(false);
    } else {
      setChartSixWidthHeight(prev => ({
        ...prev,
        width: 530,
        height: 330
      }));
      setChartSixExpand(true);
    }
  };
  return (
    <div ref={containerRef} className="chartContainer" style={{ width: `${containerSize.width}px` }}>
      <div className="chartContainerHeading">
        {/* <button onMouseDown={handleMouseDown} className="btnDragOver">&#8592;</button> */}
        <span>Weld Fracture</span>
      </div>
      <div className="chartContainerBody" style={{ width: `${(containerSize.width) - 4}px` }}>
        {
          fracturesUSFDClassificationWise && fracturesUSFDClassificationWise.length === 0 ?
            (
              <>
                <LoaderForCharts />
              </>
            ) :
            (
              <>
                <div className="chartContainerZW" style={{ 
                  width: `${chartOneWidthHeight.width}px`,
                  height: `${chartOneWidthHeight.height}px`,
                  margin: '15px 10px 10px 13px' 
                  }}>
                   <span title={chartOneExpand === false ? `Expand Chart` : 
                                                           `Collapse Chart`
                                                           } onClick={handleChartOneExpand}>
                   {chartOneExpand === false ? (<>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                     <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                     <g id="SVGRepo_iconCarrier"> <path d="M4.75 9.233C4.75 9.64721 5.08579 9.983 5.5 9.983C5.91421 9.983 6.25 9.64721 6.25 9.233H4.75ZM6.25 5.5C6.25 5.08579 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5H6.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5C4.75 5.91421 5.08579 6.25 5.5 6.25V4.75ZM9.233 6.25C9.64721 6.25 9.983 5.91421 9.983 5.5C9.983 5.08579 9.64721 4.75 9.233 4.75V6.25ZM6.03033 4.96967C5.73744 4.67678 5.26256 4.67678 4.96967 4.96967C4.67678 5.26256 4.67678 5.73744 4.96967 6.03033L6.03033 4.96967ZM9.96967 11.0303C10.2626 11.3232 10.7374 11.3232 11.0303 11.0303C11.3232 10.7374 11.3232 10.2626 11.0303 9.96967L9.96967 11.0303ZM15.767 18.75C15.3528 18.75 15.017 19.0858 15.017 19.5C15.017 19.9142 15.3528 20.25 15.767 20.25V18.75ZM19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5C20.25 19.0858 19.9142 18.75 19.5 18.75V20.25ZM18.75 19.5C18.75 19.9142 19.0858 20.25 19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5H18.75ZM20.25 15.767C20.25 15.3528 19.9142 15.017 19.5 15.017C19.0858 15.017 18.75 15.3528 18.75 15.767H20.25ZM18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L18.9697 20.0303ZM15.0303 13.9697C14.7374 13.6768 14.2626 13.6768 13.9697 13.9697C13.6768 14.2626 13.6768 14.7374 13.9697 15.0303L15.0303 13.9697ZM6.25 15.767C6.25 15.3528 5.91421 15.017 5.5 15.017C5.08579 15.017 4.75 15.3528 4.75 15.767H6.25ZM4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25C5.91421 20.25 6.25 19.9142 6.25 19.5H4.75ZM5.5 18.75C5.08579 18.75 4.75 19.0858 4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25V18.75ZM9.233 20.25C9.64721 20.25 9.983 19.9142 9.983 19.5C9.983 19.0858 9.64721 18.75 9.233 18.75V20.25ZM4.96967 18.9697C4.67678 19.2626 4.67678 19.7374 4.96967 20.0303C5.26256 20.3232 5.73744 20.3232 6.03033 20.0303L4.96967 18.9697ZM11.0303 15.0303C11.3232 14.7374 11.3232 14.2626 11.0303 13.9697C10.7374 13.6768 10.2626 13.6768 9.96967 13.9697L11.0303 15.0303ZM15.767 4.75C15.3528 4.75 15.017 5.08579 15.017 5.5C15.017 5.91421 15.3528 6.25 15.767 6.25V4.75ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.233C18.75 9.64721 19.0858 9.983 19.5 9.983C19.9142 9.983 20.25 9.64721 20.25 9.233H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM13.9697 9.96967C13.6768 10.2626 13.6768 10.7374 13.9697 11.0303C14.2626 11.3232 14.7374 11.3232 15.0303 11.0303L13.9697 9.96967ZM6.25 9.233V5.5H4.75V9.233H6.25ZM5.5 6.25H9.233V4.75H5.5V6.25ZM4.96967 6.03033L9.96967 11.0303L11.0303 9.96967L6.03033 4.96967L4.96967 6.03033ZM15.767 20.25H19.5V18.75H15.767V20.25ZM20.25 19.5V15.767H18.75V19.5H20.25ZM20.0303 18.9697L15.0303 13.9697L13.9697 15.0303L18.9697 20.0303L20.0303 18.9697ZM4.75 15.767V19.5H6.25V15.767H4.75ZM5.5 20.25H9.233V18.75H5.5V20.25ZM6.03033 20.0303L11.0303 15.0303L9.96967 13.9697L4.96967 18.9697L6.03033 20.0303ZM15.767 6.25H19.5V4.75H15.767V6.25ZM18.75 5.5V9.233H20.25V5.5H18.75ZM18.9697 4.96967L13.9697 9.96967L15.0303 11.0303L20.0303 6.03033L18.9697 4.96967Z" fill="#949494"/> </g>
                     </svg>
                   </>) : 
                   (<>
                  <svg fill="#949494" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#949494">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                    <g id="SVGRepo_iconCarrier"> <path d="M8.29289322,15 L3.5,15 C3.22385763,15 3,14.7761424 3,14.5 C3,14.2238576 3.22385763,14 3.5,14 L9.5,14 C9.77614237,14 10,14.2238576 10,14.5 L10,20.5 C10,20.7761424 9.77614237,21 9.5,21 C9.22385763,21 9,20.7761424 9,20.5 L9,15.7071068 L3.85355339,20.8535534 C3.65829124,21.0488155 3.34170876,21.0488155 3.14644661,20.8535534 C2.95118446,20.6582912 2.95118446,20.3417088 3.14644661,20.1464466 L8.29289322,15 L8.29289322,15 Z M9,8.29289322 L9,3.5 C9,3.22385763 9.22385763,3 9.5,3 C9.77614237,3 10,3.22385763 10,3.5 L10,9.5 C10,9.77614237 9.77614237,10 9.5,10 L3.5,10 C3.22385763,10 3,9.77614237 3,9.5 C3,9.22385763 3.22385763,9 3.5,9 L8.29289322,9 L3.14644661,3.85355339 C2.95118446,3.65829124 2.95118446,3.34170876 3.14644661,3.14644661 C3.34170876,2.95118446 3.65829124,2.95118446 3.85355339,3.14644661 L9,8.29289322 Z M15.7071068,9 L20.5,9 C20.7761424,9 21,9.22385763 21,9.5 C21,9.77614237 20.7761424,10 20.5,10 L14.5,10 C14.2238576,10 14,9.77614237 14,9.5 L14,3.5 C14,3.22385763 14.2238576,3 14.5,3 C14.7761424,3 15,3.22385763 15,3.5 L15,8.29289322 L20.1464466,3.14644661 C20.3417088,2.95118446 20.6582912,2.95118446 20.8535534,3.14644661 C21.0488155,3.34170876 21.0488155,3.65829124 20.8535534,3.85355339 L15.7071068,9 L15.7071068,9 Z M15.7071068,15 L20.8535534,20.1464466 C21.0488155,20.3417088 21.0488155,20.6582912 20.8535534,20.8535534 C20.6582912,21.0488155 20.3417088,21.0488155 20.1464466,20.8535534 L15,15.7071068 L15,20.5207973 C15,20.7969397 14.7761424,21.0207973 14.5,21.0207973 C14.2238576,21.0207973 14,20.7969397 14,20.5207973 L14,14.5 C14,14.2238576 14.2238576,14 14.5,14 L20.5,14 C20.7761424,14 21,14.2238576 21,14.5 C21,14.7761424 20.7761424,15 20.5,15 L15.7071068,15 Z"/> </g>
                    </svg>
                   </>)}</span>
                  <BarChart
                    id={id}
                    title="No. of Weld Fractures - Zone Wise"
                    dataSeries={fracturesZoneWise}
                    categories={zones}
                    filterData={filterByZone}
                    xTitle="Zones"
                    yTitle="No. of Fractures"
                    color={"#ff6401"}
                    cQuery={cQuery}
                    bQuery={bQuery}
                    lastThreeyears={lastThreeyears}
                    view={view}
                    width={chartOneWidthHeight.width}
                    height={chartOneWidthHeight.height}
                    setChartQuery={setChartQuery}
                  />
                </div>
                <div className="chartContainerZW" style={{ 
                   width: `${chartTwoWidthHeight.width}px`,
                   height: `${chartTwoWidthHeight.height}px`,
                   margin: '15px 10px 10px 13px'
                 }}>
                   <span title={chartTwoExpand === false ? "Expand Chart" : "Collapse Chart"} onClick={handleChartTWoExpand}>
                {chartTwoExpand === false ? (<>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                     <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                     <g id="SVGRepo_iconCarrier"> <path d="M4.75 9.233C4.75 9.64721 5.08579 9.983 5.5 9.983C5.91421 9.983 6.25 9.64721 6.25 9.233H4.75ZM6.25 5.5C6.25 5.08579 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5H6.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5C4.75 5.91421 5.08579 6.25 5.5 6.25V4.75ZM9.233 6.25C9.64721 6.25 9.983 5.91421 9.983 5.5C9.983 5.08579 9.64721 4.75 9.233 4.75V6.25ZM6.03033 4.96967C5.73744 4.67678 5.26256 4.67678 4.96967 4.96967C4.67678 5.26256 4.67678 5.73744 4.96967 6.03033L6.03033 4.96967ZM9.96967 11.0303C10.2626 11.3232 10.7374 11.3232 11.0303 11.0303C11.3232 10.7374 11.3232 10.2626 11.0303 9.96967L9.96967 11.0303ZM15.767 18.75C15.3528 18.75 15.017 19.0858 15.017 19.5C15.017 19.9142 15.3528 20.25 15.767 20.25V18.75ZM19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5C20.25 19.0858 19.9142 18.75 19.5 18.75V20.25ZM18.75 19.5C18.75 19.9142 19.0858 20.25 19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5H18.75ZM20.25 15.767C20.25 15.3528 19.9142 15.017 19.5 15.017C19.0858 15.017 18.75 15.3528 18.75 15.767H20.25ZM18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L18.9697 20.0303ZM15.0303 13.9697C14.7374 13.6768 14.2626 13.6768 13.9697 13.9697C13.6768 14.2626 13.6768 14.7374 13.9697 15.0303L15.0303 13.9697ZM6.25 15.767C6.25 15.3528 5.91421 15.017 5.5 15.017C5.08579 15.017 4.75 15.3528 4.75 15.767H6.25ZM4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25C5.91421 20.25 6.25 19.9142 6.25 19.5H4.75ZM5.5 18.75C5.08579 18.75 4.75 19.0858 4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25V18.75ZM9.233 20.25C9.64721 20.25 9.983 19.9142 9.983 19.5C9.983 19.0858 9.64721 18.75 9.233 18.75V20.25ZM4.96967 18.9697C4.67678 19.2626 4.67678 19.7374 4.96967 20.0303C5.26256 20.3232 5.73744 20.3232 6.03033 20.0303L4.96967 18.9697ZM11.0303 15.0303C11.3232 14.7374 11.3232 14.2626 11.0303 13.9697C10.7374 13.6768 10.2626 13.6768 9.96967 13.9697L11.0303 15.0303ZM15.767 4.75C15.3528 4.75 15.017 5.08579 15.017 5.5C15.017 5.91421 15.3528 6.25 15.767 6.25V4.75ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.233C18.75 9.64721 19.0858 9.983 19.5 9.983C19.9142 9.983 20.25 9.64721 20.25 9.233H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM13.9697 9.96967C13.6768 10.2626 13.6768 10.7374 13.9697 11.0303C14.2626 11.3232 14.7374 11.3232 15.0303 11.0303L13.9697 9.96967ZM6.25 9.233V5.5H4.75V9.233H6.25ZM5.5 6.25H9.233V4.75H5.5V6.25ZM4.96967 6.03033L9.96967 11.0303L11.0303 9.96967L6.03033 4.96967L4.96967 6.03033ZM15.767 20.25H19.5V18.75H15.767V20.25ZM20.25 19.5V15.767H18.75V19.5H20.25ZM20.0303 18.9697L15.0303 13.9697L13.9697 15.0303L18.9697 20.0303L20.0303 18.9697ZM4.75 15.767V19.5H6.25V15.767H4.75ZM5.5 20.25H9.233V18.75H5.5V20.25ZM6.03033 20.0303L11.0303 15.0303L9.96967 13.9697L4.96967 18.9697L6.03033 20.0303ZM15.767 6.25H19.5V4.75H15.767V6.25ZM18.75 5.5V9.233H20.25V5.5H18.75ZM18.9697 4.96967L13.9697 9.96967L15.0303 11.0303L20.0303 6.03033L18.9697 4.96967Z" fill="#949494"/> </g>
                     </svg>
                   </>) : 
                   (<>
                  <svg fill="#949494" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#949494">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                    <g id="SVGRepo_iconCarrier"> <path d="M8.29289322,15 L3.5,15 C3.22385763,15 3,14.7761424 3,14.5 C3,14.2238576 3.22385763,14 3.5,14 L9.5,14 C9.77614237,14 10,14.2238576 10,14.5 L10,20.5 C10,20.7761424 9.77614237,21 9.5,21 C9.22385763,21 9,20.7761424 9,20.5 L9,15.7071068 L3.85355339,20.8535534 C3.65829124,21.0488155 3.34170876,21.0488155 3.14644661,20.8535534 C2.95118446,20.6582912 2.95118446,20.3417088 3.14644661,20.1464466 L8.29289322,15 L8.29289322,15 Z M9,8.29289322 L9,3.5 C9,3.22385763 9.22385763,3 9.5,3 C9.77614237,3 10,3.22385763 10,3.5 L10,9.5 C10,9.77614237 9.77614237,10 9.5,10 L3.5,10 C3.22385763,10 3,9.77614237 3,9.5 C3,9.22385763 3.22385763,9 3.5,9 L8.29289322,9 L3.14644661,3.85355339 C2.95118446,3.65829124 2.95118446,3.34170876 3.14644661,3.14644661 C3.34170876,2.95118446 3.65829124,2.95118446 3.85355339,3.14644661 L9,8.29289322 Z M15.7071068,9 L20.5,9 C20.7761424,9 21,9.22385763 21,9.5 C21,9.77614237 20.7761424,10 20.5,10 L14.5,10 C14.2238576,10 14,9.77614237 14,9.5 L14,3.5 C14,3.22385763 14.2238576,3 14.5,3 C14.7761424,3 15,3.22385763 15,3.5 L15,8.29289322 L20.1464466,3.14644661 C20.3417088,2.95118446 20.6582912,2.95118446 20.8535534,3.14644661 C21.0488155,3.34170876 21.0488155,3.65829124 20.8535534,3.85355339 L15.7071068,9 L15.7071068,9 Z M15.7071068,15 L20.8535534,20.1464466 C21.0488155,20.3417088 21.0488155,20.6582912 20.8535534,20.8535534 C20.6582912,21.0488155 20.3417088,21.0488155 20.1464466,20.8535534 L15,15.7071068 L15,20.5207973 C15,20.7969397 14.7761424,21.0207973 14.5,21.0207973 C14.2238576,21.0207973 14,20.7969397 14,20.5207973 L14,14.5 C14,14.2238576 14.2238576,14 14.5,14 L20.5,14 C20.7761424,14 21,14.2238576 21,14.5 C21,14.7761424 20.7761424,15 20.5,15 L15.7071068,15 Z"/> </g>
                    </svg>
                   </>)}</span>
                  <BarChart
                    id={id}
                    title="No. of Weld Fractures - Division Wise"
                    dataSeries={fractureDivisionsWise}
                    categories={divisions}
                    filterData={filterByDivision}
                    xTitle="Divisions"
                    yTitle="No. of Fractures"
                    color={"#ff6401"}
                    cQuery={cQuery}
                    bQuery={bQuery}
                    lastThreeyears={lastThreeyears}
                    view={view}
                    width={chartTwoWidthHeight.width}
                    height={chartTwoWidthHeight.height}
                    setChartQuery={setChartQuery}
                  />
                </div>
                <div className="chartContainerZW" style={{ 
                   width: `${chartThreeWidthHeight.width}px`,
                   height: `${chartThreeWidthHeight.height}px`,
                   margin: '10px 10px 10px 13px'
                 }}>
                   <span title={chartThreeExpand === false ? "Expand Chart" : "Collapse Chart"} onClick={handleChartThreeExpand}>
                {chartThreeExpand === false ? (<>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                     <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                     <g id="SVGRepo_iconCarrier"> <path d="M4.75 9.233C4.75 9.64721 5.08579 9.983 5.5 9.983C5.91421 9.983 6.25 9.64721 6.25 9.233H4.75ZM6.25 5.5C6.25 5.08579 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5H6.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5C4.75 5.91421 5.08579 6.25 5.5 6.25V4.75ZM9.233 6.25C9.64721 6.25 9.983 5.91421 9.983 5.5C9.983 5.08579 9.64721 4.75 9.233 4.75V6.25ZM6.03033 4.96967C5.73744 4.67678 5.26256 4.67678 4.96967 4.96967C4.67678 5.26256 4.67678 5.73744 4.96967 6.03033L6.03033 4.96967ZM9.96967 11.0303C10.2626 11.3232 10.7374 11.3232 11.0303 11.0303C11.3232 10.7374 11.3232 10.2626 11.0303 9.96967L9.96967 11.0303ZM15.767 18.75C15.3528 18.75 15.017 19.0858 15.017 19.5C15.017 19.9142 15.3528 20.25 15.767 20.25V18.75ZM19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5C20.25 19.0858 19.9142 18.75 19.5 18.75V20.25ZM18.75 19.5C18.75 19.9142 19.0858 20.25 19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5H18.75ZM20.25 15.767C20.25 15.3528 19.9142 15.017 19.5 15.017C19.0858 15.017 18.75 15.3528 18.75 15.767H20.25ZM18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L18.9697 20.0303ZM15.0303 13.9697C14.7374 13.6768 14.2626 13.6768 13.9697 13.9697C13.6768 14.2626 13.6768 14.7374 13.9697 15.0303L15.0303 13.9697ZM6.25 15.767C6.25 15.3528 5.91421 15.017 5.5 15.017C5.08579 15.017 4.75 15.3528 4.75 15.767H6.25ZM4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25C5.91421 20.25 6.25 19.9142 6.25 19.5H4.75ZM5.5 18.75C5.08579 18.75 4.75 19.0858 4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25V18.75ZM9.233 20.25C9.64721 20.25 9.983 19.9142 9.983 19.5C9.983 19.0858 9.64721 18.75 9.233 18.75V20.25ZM4.96967 18.9697C4.67678 19.2626 4.67678 19.7374 4.96967 20.0303C5.26256 20.3232 5.73744 20.3232 6.03033 20.0303L4.96967 18.9697ZM11.0303 15.0303C11.3232 14.7374 11.3232 14.2626 11.0303 13.9697C10.7374 13.6768 10.2626 13.6768 9.96967 13.9697L11.0303 15.0303ZM15.767 4.75C15.3528 4.75 15.017 5.08579 15.017 5.5C15.017 5.91421 15.3528 6.25 15.767 6.25V4.75ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.233C18.75 9.64721 19.0858 9.983 19.5 9.983C19.9142 9.983 20.25 9.64721 20.25 9.233H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM13.9697 9.96967C13.6768 10.2626 13.6768 10.7374 13.9697 11.0303C14.2626 11.3232 14.7374 11.3232 15.0303 11.0303L13.9697 9.96967ZM6.25 9.233V5.5H4.75V9.233H6.25ZM5.5 6.25H9.233V4.75H5.5V6.25ZM4.96967 6.03033L9.96967 11.0303L11.0303 9.96967L6.03033 4.96967L4.96967 6.03033ZM15.767 20.25H19.5V18.75H15.767V20.25ZM20.25 19.5V15.767H18.75V19.5H20.25ZM20.0303 18.9697L15.0303 13.9697L13.9697 15.0303L18.9697 20.0303L20.0303 18.9697ZM4.75 15.767V19.5H6.25V15.767H4.75ZM5.5 20.25H9.233V18.75H5.5V20.25ZM6.03033 20.0303L11.0303 15.0303L9.96967 13.9697L4.96967 18.9697L6.03033 20.0303ZM15.767 6.25H19.5V4.75H15.767V6.25ZM18.75 5.5V9.233H20.25V5.5H18.75ZM18.9697 4.96967L13.9697 9.96967L15.0303 11.0303L20.0303 6.03033L18.9697 4.96967Z" fill="#949494"/> </g>
                     </svg>
                   </>) : 
                   (<>
                  <svg fill="#949494" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#949494">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                    <g id="SVGRepo_iconCarrier"> <path d="M8.29289322,15 L3.5,15 C3.22385763,15 3,14.7761424 3,14.5 C3,14.2238576 3.22385763,14 3.5,14 L9.5,14 C9.77614237,14 10,14.2238576 10,14.5 L10,20.5 C10,20.7761424 9.77614237,21 9.5,21 C9.22385763,21 9,20.7761424 9,20.5 L9,15.7071068 L3.85355339,20.8535534 C3.65829124,21.0488155 3.34170876,21.0488155 3.14644661,20.8535534 C2.95118446,20.6582912 2.95118446,20.3417088 3.14644661,20.1464466 L8.29289322,15 L8.29289322,15 Z M9,8.29289322 L9,3.5 C9,3.22385763 9.22385763,3 9.5,3 C9.77614237,3 10,3.22385763 10,3.5 L10,9.5 C10,9.77614237 9.77614237,10 9.5,10 L3.5,10 C3.22385763,10 3,9.77614237 3,9.5 C3,9.22385763 3.22385763,9 3.5,9 L8.29289322,9 L3.14644661,3.85355339 C2.95118446,3.65829124 2.95118446,3.34170876 3.14644661,3.14644661 C3.34170876,2.95118446 3.65829124,2.95118446 3.85355339,3.14644661 L9,8.29289322 Z M15.7071068,9 L20.5,9 C20.7761424,9 21,9.22385763 21,9.5 C21,9.77614237 20.7761424,10 20.5,10 L14.5,10 C14.2238576,10 14,9.77614237 14,9.5 L14,3.5 C14,3.22385763 14.2238576,3 14.5,3 C14.7761424,3 15,3.22385763 15,3.5 L15,8.29289322 L20.1464466,3.14644661 C20.3417088,2.95118446 20.6582912,2.95118446 20.8535534,3.14644661 C21.0488155,3.34170876 21.0488155,3.65829124 20.8535534,3.85355339 L15.7071068,9 L15.7071068,9 Z M15.7071068,15 L20.8535534,20.1464466 C21.0488155,20.3417088 21.0488155,20.6582912 20.8535534,20.8535534 C20.6582912,21.0488155 20.3417088,21.0488155 20.1464466,20.8535534 L15,15.7071068 L15,20.5207973 C15,20.7969397 14.7761424,21.0207973 14.5,21.0207973 C14.2238576,21.0207973 14,20.7969397 14,20.5207973 L14,14.5 C14,14.2238576 14.2238576,14 14.5,14 L20.5,14 C20.7761424,14 21,14.2238576 21,14.5 C21,14.7761424 20.7761424,15 20.5,15 L15.7071068,15 Z"/> </g>
                    </svg>
                   </>)}</span>
                  <BarChart
                    id={id}
                    title="No. of Weld Fractures - Year Wise"
                    dataSeries={fracturesYearsWise}
                    categories={years}
                    filterData={filterByYear}
                    xTitle="Years"
                    yTitle="No. of Fractures"
                    color={"#ff6401"}
                    cQuery={cQuery}
                    bQuery={bQuery}
                    lastThreeyears={lastThreeyears}
                    view={view}
                    width={chartThreeWidthHeight.width}
                    height={chartThreeWidthHeight.height}
                    setChartQuery={setChartQuery}
                  />
                </div>
                <div className="chartContainerZW" style={{ 
                  width: `${chartFourWidthHeight.width}px`,
                  height: `${chartFourWidthHeight.height}px`,
                  margin: '10px 10px 10px 13px'
                 }}>
                   <span title={chartFourExpand === false ? "Expand Chart" : "Collapse Chart"} onClick={handleChartFourExpand}>
                {chartFourExpand === false ? (<>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                     <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                     <g id="SVGRepo_iconCarrier"> <path d="M4.75 9.233C4.75 9.64721 5.08579 9.983 5.5 9.983C5.91421 9.983 6.25 9.64721 6.25 9.233H4.75ZM6.25 5.5C6.25 5.08579 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5H6.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5C4.75 5.91421 5.08579 6.25 5.5 6.25V4.75ZM9.233 6.25C9.64721 6.25 9.983 5.91421 9.983 5.5C9.983 5.08579 9.64721 4.75 9.233 4.75V6.25ZM6.03033 4.96967C5.73744 4.67678 5.26256 4.67678 4.96967 4.96967C4.67678 5.26256 4.67678 5.73744 4.96967 6.03033L6.03033 4.96967ZM9.96967 11.0303C10.2626 11.3232 10.7374 11.3232 11.0303 11.0303C11.3232 10.7374 11.3232 10.2626 11.0303 9.96967L9.96967 11.0303ZM15.767 18.75C15.3528 18.75 15.017 19.0858 15.017 19.5C15.017 19.9142 15.3528 20.25 15.767 20.25V18.75ZM19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5C20.25 19.0858 19.9142 18.75 19.5 18.75V20.25ZM18.75 19.5C18.75 19.9142 19.0858 20.25 19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5H18.75ZM20.25 15.767C20.25 15.3528 19.9142 15.017 19.5 15.017C19.0858 15.017 18.75 15.3528 18.75 15.767H20.25ZM18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L18.9697 20.0303ZM15.0303 13.9697C14.7374 13.6768 14.2626 13.6768 13.9697 13.9697C13.6768 14.2626 13.6768 14.7374 13.9697 15.0303L15.0303 13.9697ZM6.25 15.767C6.25 15.3528 5.91421 15.017 5.5 15.017C5.08579 15.017 4.75 15.3528 4.75 15.767H6.25ZM4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25C5.91421 20.25 6.25 19.9142 6.25 19.5H4.75ZM5.5 18.75C5.08579 18.75 4.75 19.0858 4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25V18.75ZM9.233 20.25C9.64721 20.25 9.983 19.9142 9.983 19.5C9.983 19.0858 9.64721 18.75 9.233 18.75V20.25ZM4.96967 18.9697C4.67678 19.2626 4.67678 19.7374 4.96967 20.0303C5.26256 20.3232 5.73744 20.3232 6.03033 20.0303L4.96967 18.9697ZM11.0303 15.0303C11.3232 14.7374 11.3232 14.2626 11.0303 13.9697C10.7374 13.6768 10.2626 13.6768 9.96967 13.9697L11.0303 15.0303ZM15.767 4.75C15.3528 4.75 15.017 5.08579 15.017 5.5C15.017 5.91421 15.3528 6.25 15.767 6.25V4.75ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.233C18.75 9.64721 19.0858 9.983 19.5 9.983C19.9142 9.983 20.25 9.64721 20.25 9.233H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM13.9697 9.96967C13.6768 10.2626 13.6768 10.7374 13.9697 11.0303C14.2626 11.3232 14.7374 11.3232 15.0303 11.0303L13.9697 9.96967ZM6.25 9.233V5.5H4.75V9.233H6.25ZM5.5 6.25H9.233V4.75H5.5V6.25ZM4.96967 6.03033L9.96967 11.0303L11.0303 9.96967L6.03033 4.96967L4.96967 6.03033ZM15.767 20.25H19.5V18.75H15.767V20.25ZM20.25 19.5V15.767H18.75V19.5H20.25ZM20.0303 18.9697L15.0303 13.9697L13.9697 15.0303L18.9697 20.0303L20.0303 18.9697ZM4.75 15.767V19.5H6.25V15.767H4.75ZM5.5 20.25H9.233V18.75H5.5V20.25ZM6.03033 20.0303L11.0303 15.0303L9.96967 13.9697L4.96967 18.9697L6.03033 20.0303ZM15.767 6.25H19.5V4.75H15.767V6.25ZM18.75 5.5V9.233H20.25V5.5H18.75ZM18.9697 4.96967L13.9697 9.96967L15.0303 11.0303L20.0303 6.03033L18.9697 4.96967Z" fill="#949494"/> </g>
                     </svg>
                   </>) : 
                   (<>
                  <svg fill="#949494" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#949494">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                    <g id="SVGRepo_iconCarrier"> <path d="M8.29289322,15 L3.5,15 C3.22385763,15 3,14.7761424 3,14.5 C3,14.2238576 3.22385763,14 3.5,14 L9.5,14 C9.77614237,14 10,14.2238576 10,14.5 L10,20.5 C10,20.7761424 9.77614237,21 9.5,21 C9.22385763,21 9,20.7761424 9,20.5 L9,15.7071068 L3.85355339,20.8535534 C3.65829124,21.0488155 3.34170876,21.0488155 3.14644661,20.8535534 C2.95118446,20.6582912 2.95118446,20.3417088 3.14644661,20.1464466 L8.29289322,15 L8.29289322,15 Z M9,8.29289322 L9,3.5 C9,3.22385763 9.22385763,3 9.5,3 C9.77614237,3 10,3.22385763 10,3.5 L10,9.5 C10,9.77614237 9.77614237,10 9.5,10 L3.5,10 C3.22385763,10 3,9.77614237 3,9.5 C3,9.22385763 3.22385763,9 3.5,9 L8.29289322,9 L3.14644661,3.85355339 C2.95118446,3.65829124 2.95118446,3.34170876 3.14644661,3.14644661 C3.34170876,2.95118446 3.65829124,2.95118446 3.85355339,3.14644661 L9,8.29289322 Z M15.7071068,9 L20.5,9 C20.7761424,9 21,9.22385763 21,9.5 C21,9.77614237 20.7761424,10 20.5,10 L14.5,10 C14.2238576,10 14,9.77614237 14,9.5 L14,3.5 C14,3.22385763 14.2238576,3 14.5,3 C14.7761424,3 15,3.22385763 15,3.5 L15,8.29289322 L20.1464466,3.14644661 C20.3417088,2.95118446 20.6582912,2.95118446 20.8535534,3.14644661 C21.0488155,3.34170876 21.0488155,3.65829124 20.8535534,3.85355339 L15.7071068,9 L15.7071068,9 Z M15.7071068,15 L20.8535534,20.1464466 C21.0488155,20.3417088 21.0488155,20.6582912 20.8535534,20.8535534 C20.6582912,21.0488155 20.3417088,21.0488155 20.1464466,20.8535534 L15,15.7071068 L15,20.5207973 C15,20.7969397 14.7761424,21.0207973 14.5,21.0207973 C14.2238576,21.0207973 14,20.7969397 14,20.5207973 L14,14.5 C14,14.2238576 14.2238576,14 14.5,14 L20.5,14 C20.7761424,14 21,14.2238576 21,14.5 C21,14.7761424 20.7761424,15 20.5,15 L15.7071068,15 Z"/> </g>
                    </svg>
                   </>)}</span>
                  <PieChart
                    id={id}
                    title="No. of Weld Fractures - Rail Sections Wise"
                    dataSeries={fracturesTypeOfRailsWise}
                    labels={typeOfRails}
                    filterData={filterByTypeOfRails}
                    cQuery={cQuery}
                    bQuery={bQuery}
                    lastThreeyears={lastThreeyears}
                    view={view}
                    width={chartFourWidthHeight.width}
                    height={chartFourWidthHeight.height}
                    setChartQuery={setChartQuery}
                  />
                </div>
                <div className="chartContainerZW" style={{ 
                   width: `${chartFiveWidthHeight.width}px`,
                   height: `${chartFiveWidthHeight.height}px`,
                   margin: '10px 10px 10px 13px'
                 }}>
                   <span title={chartFiveExpand === false ? "Expand Chart" : "Collapse Chart"} onClick={handleChartFiveExpand}>
                {chartFiveExpand === false ? (<>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                     <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                     <g id="SVGRepo_iconCarrier"> <path d="M4.75 9.233C4.75 9.64721 5.08579 9.983 5.5 9.983C5.91421 9.983 6.25 9.64721 6.25 9.233H4.75ZM6.25 5.5C6.25 5.08579 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5H6.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5C4.75 5.91421 5.08579 6.25 5.5 6.25V4.75ZM9.233 6.25C9.64721 6.25 9.983 5.91421 9.983 5.5C9.983 5.08579 9.64721 4.75 9.233 4.75V6.25ZM6.03033 4.96967C5.73744 4.67678 5.26256 4.67678 4.96967 4.96967C4.67678 5.26256 4.67678 5.73744 4.96967 6.03033L6.03033 4.96967ZM9.96967 11.0303C10.2626 11.3232 10.7374 11.3232 11.0303 11.0303C11.3232 10.7374 11.3232 10.2626 11.0303 9.96967L9.96967 11.0303ZM15.767 18.75C15.3528 18.75 15.017 19.0858 15.017 19.5C15.017 19.9142 15.3528 20.25 15.767 20.25V18.75ZM19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5C20.25 19.0858 19.9142 18.75 19.5 18.75V20.25ZM18.75 19.5C18.75 19.9142 19.0858 20.25 19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5H18.75ZM20.25 15.767C20.25 15.3528 19.9142 15.017 19.5 15.017C19.0858 15.017 18.75 15.3528 18.75 15.767H20.25ZM18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L18.9697 20.0303ZM15.0303 13.9697C14.7374 13.6768 14.2626 13.6768 13.9697 13.9697C13.6768 14.2626 13.6768 14.7374 13.9697 15.0303L15.0303 13.9697ZM6.25 15.767C6.25 15.3528 5.91421 15.017 5.5 15.017C5.08579 15.017 4.75 15.3528 4.75 15.767H6.25ZM4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25C5.91421 20.25 6.25 19.9142 6.25 19.5H4.75ZM5.5 18.75C5.08579 18.75 4.75 19.0858 4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25V18.75ZM9.233 20.25C9.64721 20.25 9.983 19.9142 9.983 19.5C9.983 19.0858 9.64721 18.75 9.233 18.75V20.25ZM4.96967 18.9697C4.67678 19.2626 4.67678 19.7374 4.96967 20.0303C5.26256 20.3232 5.73744 20.3232 6.03033 20.0303L4.96967 18.9697ZM11.0303 15.0303C11.3232 14.7374 11.3232 14.2626 11.0303 13.9697C10.7374 13.6768 10.2626 13.6768 9.96967 13.9697L11.0303 15.0303ZM15.767 4.75C15.3528 4.75 15.017 5.08579 15.017 5.5C15.017 5.91421 15.3528 6.25 15.767 6.25V4.75ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.233C18.75 9.64721 19.0858 9.983 19.5 9.983C19.9142 9.983 20.25 9.64721 20.25 9.233H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM13.9697 9.96967C13.6768 10.2626 13.6768 10.7374 13.9697 11.0303C14.2626 11.3232 14.7374 11.3232 15.0303 11.0303L13.9697 9.96967ZM6.25 9.233V5.5H4.75V9.233H6.25ZM5.5 6.25H9.233V4.75H5.5V6.25ZM4.96967 6.03033L9.96967 11.0303L11.0303 9.96967L6.03033 4.96967L4.96967 6.03033ZM15.767 20.25H19.5V18.75H15.767V20.25ZM20.25 19.5V15.767H18.75V19.5H20.25ZM20.0303 18.9697L15.0303 13.9697L13.9697 15.0303L18.9697 20.0303L20.0303 18.9697ZM4.75 15.767V19.5H6.25V15.767H4.75ZM5.5 20.25H9.233V18.75H5.5V20.25ZM6.03033 20.0303L11.0303 15.0303L9.96967 13.9697L4.96967 18.9697L6.03033 20.0303ZM15.767 6.25H19.5V4.75H15.767V6.25ZM18.75 5.5V9.233H20.25V5.5H18.75ZM18.9697 4.96967L13.9697 9.96967L15.0303 11.0303L20.0303 6.03033L18.9697 4.96967Z" fill="#949494"/> </g>
                     </svg>
                   </>) : 
                   (<>
                  <svg fill="#949494" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#949494">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                    <g id="SVGRepo_iconCarrier"> <path d="M8.29289322,15 L3.5,15 C3.22385763,15 3,14.7761424 3,14.5 C3,14.2238576 3.22385763,14 3.5,14 L9.5,14 C9.77614237,14 10,14.2238576 10,14.5 L10,20.5 C10,20.7761424 9.77614237,21 9.5,21 C9.22385763,21 9,20.7761424 9,20.5 L9,15.7071068 L3.85355339,20.8535534 C3.65829124,21.0488155 3.34170876,21.0488155 3.14644661,20.8535534 C2.95118446,20.6582912 2.95118446,20.3417088 3.14644661,20.1464466 L8.29289322,15 L8.29289322,15 Z M9,8.29289322 L9,3.5 C9,3.22385763 9.22385763,3 9.5,3 C9.77614237,3 10,3.22385763 10,3.5 L10,9.5 C10,9.77614237 9.77614237,10 9.5,10 L3.5,10 C3.22385763,10 3,9.77614237 3,9.5 C3,9.22385763 3.22385763,9 3.5,9 L8.29289322,9 L3.14644661,3.85355339 C2.95118446,3.65829124 2.95118446,3.34170876 3.14644661,3.14644661 C3.34170876,2.95118446 3.65829124,2.95118446 3.85355339,3.14644661 L9,8.29289322 Z M15.7071068,9 L20.5,9 C20.7761424,9 21,9.22385763 21,9.5 C21,9.77614237 20.7761424,10 20.5,10 L14.5,10 C14.2238576,10 14,9.77614237 14,9.5 L14,3.5 C14,3.22385763 14.2238576,3 14.5,3 C14.7761424,3 15,3.22385763 15,3.5 L15,8.29289322 L20.1464466,3.14644661 C20.3417088,2.95118446 20.6582912,2.95118446 20.8535534,3.14644661 C21.0488155,3.34170876 21.0488155,3.65829124 20.8535534,3.85355339 L15.7071068,9 L15.7071068,9 Z M15.7071068,15 L20.8535534,20.1464466 C21.0488155,20.3417088 21.0488155,20.6582912 20.8535534,20.8535534 C20.6582912,21.0488155 20.3417088,21.0488155 20.1464466,20.8535534 L15,15.7071068 L15,20.5207973 C15,20.7969397 14.7761424,21.0207973 14.5,21.0207973 C14.2238576,21.0207973 14,20.7969397 14,20.5207973 L14,14.5 C14,14.2238576 14.2238576,14 14.5,14 L20.5,14 C20.7761424,14 21,14.2238576 21,14.5 C21,14.7761424 20.7761424,15 20.5,15 L15.7071068,15 Z"/> </g>
                    </svg>
                   </>)}</span>
                  <PieChart
                    id={id}
                    title="No. of Weld Fractures - Grade of Steel Wise"
                    dataSeries={fracturesGradeOfSteelWise}
                    labels={gradeOfSteel}
                    filterData={filterByGradeOfSteel}
                    cQuery={cQuery}
                    bQuery={bQuery}
                    lastThreeyears={lastThreeyears}
                    view={view}
                    width={chartFiveWidthHeight.width}
                    height={chartFiveWidthHeight.height}
                    setChartQuery={setChartQuery}
                  />
                </div>
                <div className="chartContainerZW" style={{ 
                    width: `${chartSixWidthHeight.width}px`,
                    height: `${chartSixWidthHeight.height}px`,
                    margin: '10px 10px 10px 13px'
                 }}>
                  <span title={chartSixExpand === false ? "Expand Chart" : "Collapse Chart"} onClick={handleChartSixExpand}>
                {chartSixExpand === false ? (<>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                     <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                     <g id="SVGRepo_iconCarrier"> <path d="M4.75 9.233C4.75 9.64721 5.08579 9.983 5.5 9.983C5.91421 9.983 6.25 9.64721 6.25 9.233H4.75ZM6.25 5.5C6.25 5.08579 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5H6.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5C4.75 5.91421 5.08579 6.25 5.5 6.25V4.75ZM9.233 6.25C9.64721 6.25 9.983 5.91421 9.983 5.5C9.983 5.08579 9.64721 4.75 9.233 4.75V6.25ZM6.03033 4.96967C5.73744 4.67678 5.26256 4.67678 4.96967 4.96967C4.67678 5.26256 4.67678 5.73744 4.96967 6.03033L6.03033 4.96967ZM9.96967 11.0303C10.2626 11.3232 10.7374 11.3232 11.0303 11.0303C11.3232 10.7374 11.3232 10.2626 11.0303 9.96967L9.96967 11.0303ZM15.767 18.75C15.3528 18.75 15.017 19.0858 15.017 19.5C15.017 19.9142 15.3528 20.25 15.767 20.25V18.75ZM19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5C20.25 19.0858 19.9142 18.75 19.5 18.75V20.25ZM18.75 19.5C18.75 19.9142 19.0858 20.25 19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5H18.75ZM20.25 15.767C20.25 15.3528 19.9142 15.017 19.5 15.017C19.0858 15.017 18.75 15.3528 18.75 15.767H20.25ZM18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L18.9697 20.0303ZM15.0303 13.9697C14.7374 13.6768 14.2626 13.6768 13.9697 13.9697C13.6768 14.2626 13.6768 14.7374 13.9697 15.0303L15.0303 13.9697ZM6.25 15.767C6.25 15.3528 5.91421 15.017 5.5 15.017C5.08579 15.017 4.75 15.3528 4.75 15.767H6.25ZM4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25C5.91421 20.25 6.25 19.9142 6.25 19.5H4.75ZM5.5 18.75C5.08579 18.75 4.75 19.0858 4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25V18.75ZM9.233 20.25C9.64721 20.25 9.983 19.9142 9.983 19.5C9.983 19.0858 9.64721 18.75 9.233 18.75V20.25ZM4.96967 18.9697C4.67678 19.2626 4.67678 19.7374 4.96967 20.0303C5.26256 20.3232 5.73744 20.3232 6.03033 20.0303L4.96967 18.9697ZM11.0303 15.0303C11.3232 14.7374 11.3232 14.2626 11.0303 13.9697C10.7374 13.6768 10.2626 13.6768 9.96967 13.9697L11.0303 15.0303ZM15.767 4.75C15.3528 4.75 15.017 5.08579 15.017 5.5C15.017 5.91421 15.3528 6.25 15.767 6.25V4.75ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.233C18.75 9.64721 19.0858 9.983 19.5 9.983C19.9142 9.983 20.25 9.64721 20.25 9.233H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM13.9697 9.96967C13.6768 10.2626 13.6768 10.7374 13.9697 11.0303C14.2626 11.3232 14.7374 11.3232 15.0303 11.0303L13.9697 9.96967ZM6.25 9.233V5.5H4.75V9.233H6.25ZM5.5 6.25H9.233V4.75H5.5V6.25ZM4.96967 6.03033L9.96967 11.0303L11.0303 9.96967L6.03033 4.96967L4.96967 6.03033ZM15.767 20.25H19.5V18.75H15.767V20.25ZM20.25 19.5V15.767H18.75V19.5H20.25ZM20.0303 18.9697L15.0303 13.9697L13.9697 15.0303L18.9697 20.0303L20.0303 18.9697ZM4.75 15.767V19.5H6.25V15.767H4.75ZM5.5 20.25H9.233V18.75H5.5V20.25ZM6.03033 20.0303L11.0303 15.0303L9.96967 13.9697L4.96967 18.9697L6.03033 20.0303ZM15.767 6.25H19.5V4.75H15.767V6.25ZM18.75 5.5V9.233H20.25V5.5H18.75ZM18.9697 4.96967L13.9697 9.96967L15.0303 11.0303L20.0303 6.03033L18.9697 4.96967Z" fill="#949494"/> </g>
                     </svg>
                   </>) : 
                   (<>
                  <svg fill="#949494" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#949494">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                    <g id="SVGRepo_iconCarrier"> <path d="M8.29289322,15 L3.5,15 C3.22385763,15 3,14.7761424 3,14.5 C3,14.2238576 3.22385763,14 3.5,14 L9.5,14 C9.77614237,14 10,14.2238576 10,14.5 L10,20.5 C10,20.7761424 9.77614237,21 9.5,21 C9.22385763,21 9,20.7761424 9,20.5 L9,15.7071068 L3.85355339,20.8535534 C3.65829124,21.0488155 3.34170876,21.0488155 3.14644661,20.8535534 C2.95118446,20.6582912 2.95118446,20.3417088 3.14644661,20.1464466 L8.29289322,15 L8.29289322,15 Z M9,8.29289322 L9,3.5 C9,3.22385763 9.22385763,3 9.5,3 C9.77614237,3 10,3.22385763 10,3.5 L10,9.5 C10,9.77614237 9.77614237,10 9.5,10 L3.5,10 C3.22385763,10 3,9.77614237 3,9.5 C3,9.22385763 3.22385763,9 3.5,9 L8.29289322,9 L3.14644661,3.85355339 C2.95118446,3.65829124 2.95118446,3.34170876 3.14644661,3.14644661 C3.34170876,2.95118446 3.65829124,2.95118446 3.85355339,3.14644661 L9,8.29289322 Z M15.7071068,9 L20.5,9 C20.7761424,9 21,9.22385763 21,9.5 C21,9.77614237 20.7761424,10 20.5,10 L14.5,10 C14.2238576,10 14,9.77614237 14,9.5 L14,3.5 C14,3.22385763 14.2238576,3 14.5,3 C14.7761424,3 15,3.22385763 15,3.5 L15,8.29289322 L20.1464466,3.14644661 C20.3417088,2.95118446 20.6582912,2.95118446 20.8535534,3.14644661 C21.0488155,3.34170876 21.0488155,3.65829124 20.8535534,3.85355339 L15.7071068,9 L15.7071068,9 Z M15.7071068,15 L20.8535534,20.1464466 C21.0488155,20.3417088 21.0488155,20.6582912 20.8535534,20.8535534 C20.6582912,21.0488155 20.3417088,21.0488155 20.1464466,20.8535534 L15,15.7071068 L15,20.5207973 C15,20.7969397 14.7761424,21.0207973 14.5,21.0207973 C14.2238576,21.0207973 14,20.7969397 14,20.5207973 L14,14.5 C14,14.2238576 14.2238576,14 14.5,14 L20.5,14 C20.7761424,14 21,14.2238576 21,14.5 C21,14.7761424 20.7761424,15 20.5,15 L15.7071068,15 Z"/> </g>
                    </svg>
                   </>)}</span>
                  <PieChart
                    id={id}
                    title="No. of Weld Fractures - USFD Classification Wise"
                    dataSeries={fracturesUSFDClassificationWise}
                    labels={usfdClassification}
                    filterData={filterByUSFDClassification}
                    cQuery={cQuery}
                    bQuery={bQuery}
                    lastThreeyears={lastThreeyears}
                    view={view}
                    width={chartSixWidthHeight.width}
                    height={chartSixWidthHeight.height}
                    setChartQuery={setChartQuery}
                  />
                </div>
              </>
            )
        }
      </div>
    </div>
  );
};

export default WeldFractureChart;