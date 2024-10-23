import React from 'react';
import './QueryBuilder.css';
import RailFractureQuery from './QueryBuilderWidgets/RailFractureQuery';
import GMTQuery from './QueryBuilderWidgets/GMTQuery';
import PSRQuery from './QueryBuilderWidgets/PSRQuery';
import LevelCrossingQuery from './QueryBuilderWidgets/LevelCrossingQuery';
import WeldFractureQuery from './QueryBuilderWidgets/WeldFractureQuery';
import RailSectionQuery from './QueryBuilderWidgets/RailSectionQuery';
import BridgeORN1or2Query from './QueryBuilderWidgets/BridgeORN1or2Query';
import MonsoonReserveQuery from './QueryBuilderWidgets/MonsoonReserveQuery';
import BridgeWaterLevelQuery from './QueryBuilderWidgets/BridgeWaterLevelQuery';
import SectionalGMTQuery from './QueryBuilderWidgets/SectionalGMTQuery';
import SectionalSpeedQuery from './QueryBuilderWidgets/SectionalSpeedQuery';
import TrackQuallityQuery from './QueryBuilderWidgets/TrackQuallityQuery';
import SpecialRouteQuery from './QueryBuilderWidgets/SpecialRouteQuery';
import NBMLUMLLocationQuery from './QueryBuilderWidgets/NBMLUMLLocationQuery';

const QueryBuilder = ({ newMapObj, layer, id, startLoaderForQueryBuilder, stopLoaderForQueryBuilder }) => {

    return (
        <div>
            {
                id === 1 &&
                <PSRQuery layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />
            }
            {
                id === 2 &&
                <RailSectionQuery layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />
            }
            {
                id === 3 &&
                <GMTQuery layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />
            }
            {
                id === 4 &&
                <RailFractureQuery layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />

            }
            {
                id === 5 &&
                <LevelCrossingQuery layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />
            }
            {
                id === 6 &&
                <WeldFractureQuery layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />
            }
            {
                id === 7 &&
                <SpecialRouteQuery layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />
            }
            {
                id === 8 &&
                <SectionalGMTQuery layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />
            }
            {
                id === 9 &&
                <SectionalSpeedQuery layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />
            }
            {
                id === 10 &&
                <TrackQuallityQuery layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />
            }
            {
                id === 11 &&
                <NBMLUMLLocationQuery layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />
            }

            {
                id === 13 &&
                <BridgeORN1or2Query layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />
            }
            {
                id === 14 &&
                <MonsoonReserveQuery layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />
            }
            {
                id === 15 &&
                <BridgeWaterLevelQuery layer={layer} newMapObj={newMapObj} startLoaderForQueryBuilder={startLoaderForQueryBuilder} stopLoaderForQueryBuilder={stopLoaderForQueryBuilder} />
            }
        </div>
    )
};

export default QueryBuilder;