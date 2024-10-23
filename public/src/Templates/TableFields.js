const baseTrackFields = [
    { label: "Object Id", value: "objectid" },
    { label: "Railway", value: "railway" },
    { label: "Division", value: "division" },
    { label: "Route", value: "route " },
    { label: "Section", value: "tmssection" },
    { label: "Type of Route", value: "routeclass" },
    { label: "Gauge", value: "gauge" },
    { label: "Line Type", value: "line_type" },
    { label: "Electric", value: "electric" },
];
const railFractureFields = [
    { label: "Unique Id", value: "objectid", },
    { label: "Railway", value: "railway", },
    { label: "Division", value: "division", },
    { label: "Date & Time of Fracture", value: "date_time_of_fracture", },
    { label: "Section", value: "section", },
    { label: "Line", value: "line", },
    { label: "Km", value: "from_km", },
    { label: "Meter", value: "from_met", },
    { label: "Type of Asset", value: "asset_type", },
    { label: "Accumulated GMT", value: "accumulated_gmt", },
    { label: "LRRR", value: "lr_rr", },
    { label: "Rail Section", value: "rail_section", },
    { label: "Grade of Steel", value: "grade_of_steel", },
    { label: "USFD Classification", value: "usfd_classification", },
    { label: "USFD Date", value: "usfd_date", },
];
const railSectionFields = [
    { label: "Railway", value: "railway", },
    { label: "Division", value: "division", },
    { label: "Section", value: "section", },
    { label: "Line", value: "line", },
    { label: "LRRR", value: "lrrr", },
    { label: "From Km", value: "from_km", },
    { label: "From Meter", value: "from_met", },
    { label: "To Km", value: "to_km", },
    { label: "To Meter", value: "to_met", },
    { label: "Rolling Month", value: "rolling_month", },
    { label: "Laying Month", value: "laying_month", },
    { label: "Accumulated Gmt", value: "accumulated_gmt", },
    { label: "Rail Section", value: "rail_section", },
    { label: "Grade of Steel", value: "grade_of_steel", },
    { label: "Type of Route", value: "type_of_route", },
];
const gmtDetailsFields = [
    { label: "Object Id", value: "objectid", },
    { label: "Railway", value: "railway", },
    { label: "Division", value: "division", },
    { label: "Route", value: "route", },
    { label: "Type of route", value: "routeclass", },
    { label: "Section", value: "section", },
    { label: "Rail Section", value: "rail_section", },
    { label: "Line", value: "line", },
    { label: "LRRR", value: "lr_rr", },
    { label: "Grade of Steel", value: "grade_of_steel", },
    { label: "Accumulated GMT", value: "accumulated_gmt", },
    { label: "Laying Month", value: "layin_gyrmn_month", }
];
const speedRestrictionFields = [
    { label: "Object Id", value: "objectid", },
    { label: "Railway", value: "railway", },
    { label: "Division", value: "division", },
    { label: "Section", value: "section", },
    { label: "Line", value: "line", },
    { label: "From_Km", value: "from_km", },
    { label: "From_m", value: "from_met", },
    { label: "To_Km", value: "to__km", },
    { label: "To_m", value: "to_met", },
    { label: "Route Classification", value: "route_classification", },
    { label: "Date of Imposition", value: "date_of_imposition", },
    { label: "On Account of ", value: "on_account_of", },
    { label: "Maximum Permissible Speed", value: "maximum_permissible_speed", },
    { label: "PSR", value: "psr", },
    { label: "Reason", value: "reason", }
];
const levelCrossingFields = [
    { label: "LC Id", value: "lcid", },
    { label: "Level Crossing No", value: "lcno", },
    { label: "Railway", value: "railway", },
    { label: "Section", value: "section", },
    { label: "Distance Km", value: "from_km", },
    { label: "Distance Meter", value: "from_met", },
    { label: "Class", value: "routeclass", },
    { label: "Manning", value: "manning", },
    { label: "Is Interlocked", value: "is_interlocked", },
    { label: "TVU", value: "tvu", }
];
const weldFractureFields = [
    { label: "Unique Id", value: "objectid", },
    { label: "Railway", value: "railway", },
    { label: "Division", value: "division", },
    { label: "Date & Time of Fracture", value: "date_time_of_fracture", },
    { label: "Section Station", value: "section", },
    { label: "Line", value: "line", },
    { label: "Km", value: "from_km", },
    { label: "Meter", value: "from_met", },
    { label: "Type of Welding", value: "type_of_weld", },
    { label: "LRRR", value: "lr_rr", },
    { label: "Rail Section", value: "rail_section", },
    { label: "Grade of Steel", value: "grade_of_steel", },
    { label: "Accumulated GMT", value: "accumulated_gmt", },
    { label: "USFD Classification", value: "usfd_classification", },
    { label: "USFD Date", value: "usfd_date", },
    { label: "Welding Agency", value: "welding_agency", }
];
const specialRouteFields = [
    { label: "Railway", value: "railway", },
    { label: "Division", value: "divison", },
    { label: "Route Category", value: "routeclass", },
    { label: "Type Of Route", value: "type_of_route", },
    { label: "Route Name", value: "route_name", },
    { label: "Section", value: "section", },
    { label: "Line", value: "line", },
    { label: "From_Km", value: "kmfrom", },
    { label: "From_M", value: "metfrom", },
    { label: "To_Km", value: "kmto", },
    { label: "To_M", value: "metto", },
    { label: "Sectional Speed", value: "sectional_speed", },
    { label: "Sectional Gmt", value: "sectional_gmt", }
];
const sectionalGMTFields = [
    { label: "Railway", value: "railway", },
    { label: "Division", value: "division", },
    { label: "Section", value: "section", },
    { label: "Line", value: "line", },
    { label: "From_Km", value: "from_km", },
    { label: "From_M", value: "from_met", },
    { label: "To_Km", value: "to_km", },
    { label: "To_M", value: "to_met", },
    { label: "GMT Year", value: "gmt_year", },
    { label: "Sectional GMT", value: "gmt", },

];
const sectionalSpeedFields = [
    { label: "Railway", value: "railway", },
    { label: "Division", value: "division", },
    { label: "Section", value: "section", },
    { label: "Line", value: "line", },
    { label: "Gauge", value: "gauge", },
    { label: "From_Km", value: "from_km", },
    { label: "From_M", value: "from_met", },
    { label: "To_Km", value: "to_km", },
    { label: "To_M", value: "to_met", },
    { label: "Sectional Speed", value: "speed", },
];
const trackQualityFields = [
    { label: "Railway", value: "railway", },
    { label: "Division", value: "division", },
    { label: "Section", value: "section", },
    { label: "Line", value: "line", },
    { label: "From_Km", value: "from_km", },
    { label: "From_M", value: "from_met", },
    { label: "To_Km", value: "to_km", },
    { label: "To_M", value: "to_met", },
    { label: "Sectional Speed", value: "sectionalspeed", },
    { label: "Track Quality", value: "performance", }
];
const nbmlFields = [
    { label: "Railway", value: "railway", },
    { label: "Division", value: "division", },
    { label: "Section", value: "section", },
    { label: "Line", value: "line", },
    { label: "From_Km", value: "from_km", },
    { label: "From_M", value: "from_met", },
    { label: "To_Km", value: "to_km", },
    { label: "To_M", value: "to_met", },
    { label: "Sectional Speed", value: "sectional_speed", },
    { label: "Run Date", value: "run_date", },
    { label: "Year", value: "year", },

];
const umlFields = [
    { label: "Railway", value: "railway", },
    { label: "Division", value: "division", },
    { label: "Section", value: "section", },
    { label: "Line", value: "line", },
    { label: "Speed", value: "sectional_speed", },
    { label: "Parameter", value: "parameter" },
    { label: "Peak", value: "peak" },
    { label: "From_Km", value: "from_km", },
    { label: "From_M", value: "from_met", },
    { label: "To_Km", value: "to_km", },
    { label: "To_Km", value: "to_met", },
    { label: "Run Date", value: "rundate", },
    { label: "Year", value: "year", },
];
const omsPeakFields = [
    { label: "Object Id", value: "objectid", },
    { label: "Railway", value: "railway", },
    { label: "Division", value: "division", },
    { label: "Section", value: "section", },
    { label: "Line", value: "line", },
    { label: "From_Km", value: "from_km", },
    { label: "From_M", value: "form_met", },
    { label: "To_Km", value: "to_km", },
    { label: "To_M", value: "to_met", },
    { label: "Run Date", value: "run_date", },
    { label: "Year", value: "oms_year", },
];
const bridgeORNFields = [
    { label: "Asset Id", value: "" },
    { label: "Railway", value: "railway", },
    { label: "Division", value: "division", },
    { label: "Section", value: "section", },
    { label: "From_Km", value: "from_km", },
    { label: "From_M", value: "from_met", },
    { label: "To_Km", value: "to_km", },
    { label: "To_M", value: "to_met", },
    { label: "Category", value: "category", },
    { label: "Structure Type", value: "structure_type", },
    { label: "ORN", value: "orn", },
    { label: "Span Configuration", value: "span_configuration", },
    { label: "Std. of Loading Fit for", value: "std_of_loading_fit_for", },
    { label: "Overstressed Bridge", value: "No", },
];
const monsoonReservesFields = [
    { label: "Type of Consumable", value: "type_of_consumable", },
    { label: "Location Type", value: "location_type", },
    { label: "Section", value: "section_station", },
    { label: "From_Km", value: "from_km", },
    { label: "From_Met", value: "from_met", },
    { label: "Sanctioned Qty", value: "sanctioned_qty", },
    { label: "Qty available", value: "qty_available_at_the_time_of_su", },
];
const bridgeWaterLevelFields = [
    { label: "Asset Id", value: "bridgeid" },
    { label: "Railway", value: "railway", },
    { label: "Division", value: "division", },
    { label: "Section", value: "section__station", },
    { label: "From_Km", value: "from_km", },
    { label: "From_M", value: "from_m", },
    { label: "To_Km", value: "to_km", },
    { label: "To_M", value: "to_m", },
    { label: "Bridge No.", value: "bridge_no_", },
    { label: "Category", value: "category", },
    { label: "Structure Type", value: "structure_type", },
    { label: "Span Configuration", value: "span_configuration", },
    { label: "Type of Foundation", value: "type_of_foundation", },
    { label: "Name of River", value: "name_of_river", },
    { label: "HFL", value: "hfl", },
    { label: "Danger Level", value: "danger_level", },
];
const geoTaggedImagesFields = [
    { label: "Object Id", value: "objectid" },
    { label: "Path", value: "path", },
    { label: "Name", value: "name", },
    { label: "Date Time", value: "datetime", },
    { label: "Direction", value: "direction", },
    { label: "X", value: "x", },
    { label: "Y", value: "y", },
    { label: "Z", value: "z", },
];
export const screenRelatedFields = [
    { id: 1, label: "Permanent Speed Restriction", fields: speedRestrictionFields },
    { id: 0, label: "Base Track", fields: baseTrackFields },
    { id: 2, label: "Rail Section Analysis", fields: railSectionFields },
    { id: 3, label: "GMT Details", fields: gmtDetailsFields },
    { id: 4, label: "Rail Fracture", fields: railFractureFields },
    { id: 5, label: "Level Crossing", fields: levelCrossingFields },
    { id: 6, label: "Weld Fracture", fields: weldFractureFields },
    { id: 7, label: "Special Route", fields: specialRouteFields },
    { id: 8, label: "Sectional GMT(Traffic Density)", fields: sectionalGMTFields },
    { id: 9, label: "Sectional Speed", fields: sectionalSpeedFields },
    { id: 10, label: "Track Quality", fields: trackQualityFields },
    { id: 11, label: "NBML/UML Location", fields: umlFields },
    { id: 12, label: "OMS Repeated Location", fields: omsPeakFields },
    { id: 13, label: "Bridge ORN", fields: bridgeORNFields },
    { id: 14, label: "Monsoon Reserves", fields: monsoonReservesFields },
    { id: 15, label: "Bridge Water Level", fields: bridgeWaterLevelFields },
    { id: 16, label: "Geo Tagged Images", fields: geoTaggedImagesFields },
];