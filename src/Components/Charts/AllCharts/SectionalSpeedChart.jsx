import React, { useState, useEffect, useRef } from "react";
import { LoaderForCharts } from "../../Loader/Loader";
import BarChart from "../ChartsSubComponents/BarChart";
import PieChart from "../ChartsSubComponents/PieChart";
import { filterLayer } from "../../Utils/Functions";

const SectionalSpeedChart = ({ newMapObj, layer, cQuery, bQuery }) => {
  let id = newMapObj.id;
  let view = newMapObj.newView;
  const [zones, setZones] = useState([]);
  const [tracklengthsZoneWise, setTracklengthsZoneWise] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [tracklengthsDivisionWise, setTracklengthsDivisionWise] = useState([]);
  const [sctionalSpeed, setSectionalSpeed] = useState(["< 100", "100-110", "110-130", "130-160"]);
  const [tracklengthsSectionalSpeedSlabWise, setTracklengthsSectionalSpeedSlabWise] = useState([]);
  const [chartQuery, setChartQuery] = useState({
    zoneQuery: "",
    divisionQuery: "",
    sectionSpeedQuery: "",
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
      let sectionSpeedQueryString = "";
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
        if (chartQuery.sectionSpeedQuery !== "") {
          sectionSpeedQueryString = chartQuery.sectionSpeedQuery;
        }
        let fQ = [cQueryString, bQueryString, railwayQueryString, divisionQueryString, sectionSpeedQueryString].filter(Boolean).join(" AND ");
        if (fQ !== "") {
          query.where += ` AND ${fQ}`
        }
        const result = await layer.queryFeatures(query);
        const tracklengthsZoneWiseObj = {};
        const tracklengthsDivisionWiseObj = {};
        const tracklengthsSectionalSpeedWiseObj = {};
        result.features.forEach((feature) => {
          const zone = feature.attributes["railway"];
          const division = feature.attributes["division"];
          const speed = feature.attributes["speed"];
          const length = feature.attributes['to_measurement'] - feature.attributes['from_measurement'];


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
          if (speed) {
            if (!tracklengthsSectionalSpeedWiseObj[speed]) {
              tracklengthsSectionalSpeedWiseObj[speed] = 0;
            }
            tracklengthsSectionalSpeedWiseObj[speed] += length;
          }


        });
        const uniqueZone = Object.keys(tracklengthsZoneWiseObj).map((zone) => ({
          value: zone,
          length: tracklengthsZoneWiseObj[zone],
        }));
        setZones([]);
        setZones(uniqueZone.map((uz) => uz.value));
        setTracklengthsZoneWise([]);
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
        setDivisions([]);
        setDivisions(uniqueDivisions.map((ud) => ud.value));
        setTracklengthsDivisionWise([])
        setTracklengthsDivisionWise(
          uniqueDivisions.map(ud => (ud.length / 1000).toFixed(3))
        );
        const sectionalSpeedTracklengthObj = [
          { label: "< 100", length: 0 },
          { label: "100-110", length: 0 },
          { label: "110-130", length: 0 },
          { label: "130-160", length: 0 }
        ]

        result.features.forEach((feature) => {
          const length = feature.attributes['to_measurement'] - feature.attributes['from_measurement'];
          const sectionalSpeedString = feature.attributes['speed'];
          const sectionalSpeedSlab = parseInt(sectionalSpeedString);
          if (sectionalSpeedSlab < 100) {
            sectionalSpeedTracklengthObj.find(obj => obj.label === "< 100").length += length;
          } else if (sectionalSpeedSlab >= 100 && sectionalSpeedSlab < 110) {
            sectionalSpeedTracklengthObj.find(obj => obj.label === "100-110").length += length;
          } else if (sectionalSpeedSlab >= 110 && sectionalSpeedSlab < 130) {
            sectionalSpeedTracklengthObj.find(obj => obj.label === "110-130").length += length;
          } else if (sectionalSpeedSlab >= 130 && sectionalSpeedSlab < 160) {
            sectionalSpeedTracklengthObj.find(obj => obj.label === "130-160").length += length;
          }
        });
        const trackLengthsArray = Object.values(sectionalSpeedTracklengthObj).map(ss => parseFloat((ss.length / 1000).toFixed(3)));
        setTracklengthsSectionalSpeedSlabWise([])
        setTracklengthsSectionalSpeedSlabWise(trackLengthsArray);
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
  const filterBySectionSpeedWise = (sectionSpeed) => {
    filterLayer(id, view, "speed", sectionSpeed, setChartQuery)
  };

  return (
    <div ref={containerRef} className="chartContainer" style={{ width: `${containerSize.width}px`, top: "-125px" }}>
      <div className="chartContainerHeading">
        <button onMouseDown={handleMouseDown} className="btnDragOver">&#8592;</button>
        <span>Sectional Speed</span>
      </div>
      <div className="chartContainerBody" style={{ width: `${(containerSize.width) - 4}px` }}>
        {
          tracklengthsDivisionWise && tracklengthsDivisionWise.length === 0 ?
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
                    title="Track Length(in Km) - Zone Wise"
                    dataSeries={tracklengthsZoneWise}
                    categories={zones}
                    filterData={filterByZone}
                    xTitle="Zones"
                    yTitle="Track Length(in Km)"
                    color={"#d2140d"}
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
                    title="Track Length(in Km) - Division Wise"
                    dataSeries={tracklengthsDivisionWise}
                    categories={divisions}
                    filterData={filterByDivision}
                    xTitle="Divisions"
                    yTitle="Track Length(in Km)"
                    color={"#d2140d"}
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
                    title="Track Length(in Km) - Section Speed Wise"
                    dataSeries={tracklengthsSectionalSpeedSlabWise}
                    labels={sctionalSpeed}
                    filterData={filterBySectionSpeedWise}
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

export default SectionalSpeedChart