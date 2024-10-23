import { baseTrackClassBreak, bridgeOrmClassBreaks, bridgeWaterLevelClassBreak, gmtClassBreaks, levelCrossingClassBreak, monsoonReservesClassBreak, omsPeakClassBreak, permanentSpeedRestrictionsSspeedclassBreaks, railSectionClassBreaks, sectionalGmtClassBreaks, sectionalSpeedClassBreaks, specialRouteClassBreak, trackQualityClassBrak } from "./ClassBreak";

export const railFractureRenderer = {
    type: "simple",
    symbol: {
        type: "simple-marker",
        style: "circle",
        size: 5,
        color: "#720455",
        outline: null
    }
};
export const gmtClassBreaksRenderer = {
    type: "class-breaks",
    field: "life_slab_percent",
    classBreakInfos: gmtClassBreaks
};
export const permanentSpeedRestrictionsClassBreaksRenderer = {
    type: "class-breaks",
    field: "psr",
    classBreakInfos: permanentSpeedRestrictionsSspeedclassBreaks
};
export const levelCrossingRenderer = {
    type: "class-breaks",
    field: "tvu",
    classBreakInfos: levelCrossingClassBreak
}
export const weldFractureReportRenderer = {
    type: "simple",
    symbol: {
        type: "simple-marker",
        size: 5,
        color: "#FF5F00",
        outline: null
    }
}
export const baseTrackRenderer = {
    type: "unique-value",
    field: "railway",
    uniqueValueInfos: baseTrackClassBreak
};
export const railSectionClassBreaksRenderer = {
    type: "unique-value",
    field: "rail_section",
    uniqueValueInfos: railSectionClassBreaks
};
export const SectionalGmtClassBreaksRenderer = {
    type: "class-breaks",
    field: "gmt",
    classBreakInfos: sectionalGmtClassBreaks
};
export const SectionalSpeedClassBreaksRenderer = {
    type: "class-breaks",
    field: "speed",
    classBreakInfos: sectionalSpeedClassBreaks
};
export const bridgeOrmClassBreaksRenderer = {
    type: "unique-value",
    field: "orn",
    uniqueValueInfos: bridgeOrmClassBreaks
};
export const bridgeWaterLevelClassBreaksRenderer = {
    type: "unique-value",
    field: "dl_wl_diff_label",
    uniqueValueInfos: bridgeWaterLevelClassBreak
};
export const monsoonReservesClassBreaksRenderer = {
    type: "unique-value",
    field: "type_of_consumable",
    uniqueValueInfos: monsoonReservesClassBreak
};

export const trackQualityClassBreaksRenderer = {
    type: "unique-value",
    field: "performance",
    uniqueValueInfos: trackQualityClassBrak
};
export const nbmlOnTRCSimpleRenderer = {
    type: "simple",
    symbol: {
        type: "simple-line",
        width: 3,
        color: "red",
        outline: null
    }
};

export const umlOnTRCSimpleRenderer = {
    type: "simple",
    symbol: {
        type: "simple-marker",
        style: "circle",
        color: "blue",
        size: 6,
    }
};
export const omsPeakRenderer = {
    type: "class-breaks",
    field: "peak_value",
    classBreakInfos: omsPeakClassBreak
}
export const specialRouteClassBreaksRenderer = {
    type: "unique-value",
    field: "type_of_route",
    uniqueValueInfos: specialRouteClassBreak
};