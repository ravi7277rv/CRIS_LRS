import React from 'react';
import './Chart.css';
import 'react-resizable/css/styles.css';
import RailFractureChart from './AllCharts/RailFractureChart';
import RailSectionChart from './AllCharts/RailSectionChart';
import GMTDetailsChart from './AllCharts/GMTDetailsChart';
import AnnualSectionalChart from './AllCharts/AnnualSectionalChart';
import SectionalSpeedChart from './AllCharts/SectionalSpeedChart';
import OMSRepeatedLocationChart from './AllCharts/OMSRepeatedLocationChart';
import WeldFractureChart from './AllCharts/WeldFractureChart';
import NBML_UMLChart from './AllCharts/NBML_UMLChart';

const Chart = ({ newMapObj, layer, layer2, id, cQuery, bQuery, years }) => {
  return (
    <>
      {
        id === 2 && <RailSectionChart newMapObj={newMapObj} layer={layer} cQuery={cQuery} bQuery={bQuery} />
      }
      {
        id === 3 && <GMTDetailsChart newMapObj={newMapObj} layer={layer} cQuery={cQuery} bQuery={bQuery} />
      }
      {
        id === 4 && <RailFractureChart newMapObj={newMapObj} layer={layer} cQuery={cQuery} bQuery={bQuery} lastThreeyears={years} />
      }
      {
        id === 6 && <WeldFractureChart newMapObj={newMapObj} layer={layer} cQuery={cQuery} bQuery={bQuery} lastThreeyears={years} />
      }
      {
        id === 8 && <AnnualSectionalChart newMapObj={newMapObj} layer={layer} cQuery={cQuery} bQuery={bQuery} />
      }
      {
        id === 9 && <SectionalSpeedChart newMapObj={newMapObj} layer={layer} cQuery={cQuery} bQuery={bQuery} />
      }
      {
        id === 11 && <NBML_UMLChart newMapObj={newMapObj} layer={layer} layer2={layer2} cQuery={cQuery} bQuery={bQuery} />
      }
      {
        id === 12 && <OMSRepeatedLocationChart newMapObj={newMapObj} layer={layer} cQuery={cQuery} bQuery={bQuery} lastThreeyears={years} />
      }
    </>
  )
}

export default Chart