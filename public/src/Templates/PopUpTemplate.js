






export const baseTrackPopUpTemplate = {
    title: "Track Data",
    content: "<table class='table table-striped'>" +
        "<tr><td>Line</td><td class='popup-cell'>{line}}</td></tr>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division</td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Section</td><td class='popup-cell'>{tmssection}</td></tr>" +
        "<tr><td>Route</td><td class='popup-cell'>{route}</td></tr>" +
        "</table>",
}
export const railwayStationPopUpTemplate = {
    title: "Railway Station",
    content: "<table class='table table-striped'>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division</td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Section</td><td class='popup-cell'>{tmssection}</td></tr>" +
        "<tr><td>State</td><td class='popup-cell'>{state}</td></tr>" +
        "<tr><td>District</td><td class='popup-cell'>{district}</td></tr>" +
        "<tr><td>Station Name</td><td class='popup-cell'>{sttnname}</td></tr>" +
        "<tr><td>Station Code</td><td class='popup-cell'>{sttncode}</td></tr>" +
        "</table>",
}
export const railFracturePopUpTemplate = {
    title: "Rail Fracture",
    content: "<table class='table table-striped'>" +
        "<tr><td>Unique Id</td><td class='popup-cell'></td></tr>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division</td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Date & Time of Fracture</td><td class='popup-cell'>{date_time_of_fracture}</td></tr>" +
        "<tr><td>Section</td><td class='popup-cell'>{section}</td></tr>" +
        "<tr><td>Line</td><td class='popup-cell'>{line}</td></tr>" +
        "<tr><td>Location</td><td class='popup-cell'>{from_km}Km {from_met}m</td></tr>" +
        "<tr><td>LRRR</td><td class='popup-cell'>{lr_rr}</td></tr>" +
        "<tr><td>Type of Asset</td><td class='popup-cell'>{asset_type}</td></tr>" +
        "<tr><td>Accumulated GMT</td><td class='popup-cell'>{accumulated_gmt}</td></tr>" +
        "<tr><td>Rail Section</td><td class='popup-cell'>{rail_section}</td></tr>" +
        "<tr><td>Grade of Steel</td><td class='popup-cell'>{grade_of_steel}</td></tr>" +
        "<tr><td>USFD Classification</td><td class='popup-cell'>{usfd_classification}</td></tr>" +
        "<tr><td>USFD Date</td><td class='popup-cell'>{usfd_date}</td></tr>" +
        "</table>",
};
export const GMTPopupTemplate = {
    title: "GMT Data",
    content: "<table class='table table-striped'>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division</td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Route</td><td class='popup-cell'>{route}</td></tr>" +
        "<tr><td>Type of Route</td><td class='popup-cell'>{routeclass}</td></tr>" +
        "<tr><td>Location</td><td class='popup-cell'>{from_km}Km {from_met}m - {to_km}Km {to_met}m</td></tr>" +
        "<tr><td>Line</td><td class='popup-cell'>{line}</td></tr>" +
        "<tr><td>LRRR</td><td class='popup-cell'>{lr_rr}</td></tr>" +
        "<tr><td>Section</td><td class='popup-cell'>{section}</td></tr>" +
        "<tr><td>Laying Month</td><td class='popup-cell'>{layin_gyrmn_month}</td></tr>" +
        "<tr><td>Rail Section</td><td class='popup-cell'>{rail_section}</td></tr>" +
        "<tr><td>Grade of Steel</td><td class='popup-cell'>{grade_of_steel}</td></tr>" +
        "<tr><td>Accumulated GMT</td><td class='popup-cell'>{accumulated_gmt}</td></tr>" +
        "</table>",
};
export const permanentSpeedRestrictionsPopUpTemplate = {
    title: "Speed Restriciton Data",
    content: "<table class='table table-striped'>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division</td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Section</td><td class='popup-cell'>{section}</td></tr>" +
        "<tr><td>Line</td><td class='popup-cell'>{line}</td></tr>" +
        `<tr><td>Location</td><td class='popup-cell'>{from_km}Km {from_met}m - {to__km}Km {to_met}m </td></tr>` +
        "<tr><td>Route Classification</td><td class='popup-cell'>{routeclass}</td></tr>" +
        "<tr><td>Date of Imposition </td><td class='popup-cell'>{date_of_imposition}}</td></tr>" +
        "<tr><td>On Account of</td><td class='popup-cell'>{on_account_of}</td></tr>" +
        "<tr><td>Maximum Permissible Speed</td><td class='popup-cell'>{maximum_permissible_speed}</td></tr>" +
        "<tr><td>PSR</td><td class='popup-cell'>{psr }</td></tr>" +
        "<tr><td>Reason </td><td class='popup-cell'>{reason}</td></tr>" +
        "</table>",
};
export const levelCrossingPopUpTemplate = {
    title: "Level Crossing",
    content: "<table class='table table-striped'>" +
        "<tr><td>LC Id</td><td class='popup-cell'>{lcid}}</td></tr>" +
        "<tr><td>Level Crossing No</td><td class='popup-cell'>{lcno}</td></tr>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Section</td><td class='popup-cell'>{section}</td></tr>" +
        "<tr><td>Location </td><td class='popup-cell'>{from_km}Km - {from_met}m</td></tr>" +
        "<tr><td>Class </td><td class='popup-cell'>{routeclass }</td></tr>" +
        "<tr><td>Manning </td><td class='popup-cell'>{manning}</td></tr>" +
        "<tr><td>Is Interlocked</td><td class='popup-cell'>{is_interlocked}</td></tr>" +
        "<tr><td>TVU</td><td class='popup-cell'>{tvu}</td></tr>" +
        "<tr><td>Planning for LC closure by</td><td class='popup-cell'>{planning_for_lc_closure_by}</td></tr>" +
        "</table>",
};
export const weldFractureReportPopUpTemplate = {
    title: "Weld Fracture",
    content: "<table class='table table-striped'>" +
        "<tr><td>Unique ID</td><td class='popup-cell'></td></tr>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division</td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Date & Time of Fracture</td><td class='popup-cell'>{date_time_of_fracture}</td></tr>" +
        "<tr><td>Section Station</td><td class='popup-cell'>{section}</td></tr>" +
        "<tr><td>Line</td><td class='popup-cell'>{line}</td></tr>" +
        "<tr><td>Location</td><td class='popup-cell'>{from_km}Km {from_met}m</td></tr>" +
        "<tr><td>LRRR</td><td class='popup-cell'>{lr_rr}</td></tr>" +
        "<tr><td>Type of Welding</td><td class='popup-cell'>{type_of_weld}</td></tr>" +
        "<tr><td>Rail Section</td><td class='popup-cell'>{rail_section}</td></tr>" +
        "<tr><td>Grade of Steel</td><td class='popup-cell'>{grade_of_steel}</td></tr>" +
        "<tr><td>Accumulated GMT</td><td class='popup-cell'>{accumulated_gmt}</td></tr>" +
        "<tr><td>USFD Classification</td><td class='popup-cell'>{usfd_classification}</td></tr>" +
        "<tr><td>USFD Date</td><td class='popup-cell'>{usfd_date}</td></tr>" +
        "<tr><td>Welding Agency</td><td class='popup-cell'>{welding_agency}</td></tr>" +
        "</table>",

};
export const railSectionPopUpTemplate = {
    title: "Rail Section Analysis",
    content: "<table class='table table-striped'>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division</td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Section </td><td class='popup-cell'>{section}</td></tr>" +
        "<tr><td>Line</td><td class='popup-cell'>{line }</td></tr>" +
        "<tr><td>LRRR</td><td class='popup-cell'>{lr_rr}</td></tr>" +
        "<tr><td>Location</td><td class='popup-cell'>{from_km}Km {from_met}m - {to_km}Km {to_met}m</td></tr>" +
        "<tr><td>Rolling Month</td><td class='popup-cell'>{rollin_gyrmn_month}</td></tr>" +
        "<tr><td>Accumulated GMT</td><td class='popup-cell'>{accumulated_gmt}</td></tr>" +
        "<tr><td>Laying Month</td><td class='popup-cell'>{layin_gyrmn_month}</td></tr>" +
        "<tr><td>Rail Section</td><td class='popup-cell'>{rail_section}</td></tr>" +
        "<tr><td>Grade of Steel</td><td class='popup-cell'>{grade_of_steel}</td></tr>" +
        "<tr><td>Type of Route</td><td class='popup-cell'>{type_of_route}</td></tr>" +
        "</table>",
};

export const sectionalGmtPopUpTemplate = {
    title: "Sectional GMT",
    content: "<table class='table table-striped'>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division </td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Section </td><td class='popup-cell'>{section}</td></tr>" +
        "<tr><td>Line</td><td class='popup-cell'>{line}</td></tr>" +
        "<tr><td>Location</td><td class='popup-cell'>{from_km}Km {from_met}m - {to_km}Km {to_met}m</td></tr>" +
        "<tr><td>GMT Year</td><td class='popup-cell'>{gmt_year}</td></tr>" +
        "<tr><td>Sectional GMT</td><td class='popup-cell'>{gmt}</td></tr>" +
        "</table>",
}
export const sectionalSpeedPopUpTemplate = {
    title: "Sectional Speed",
    content: "<table class='table table-striped'>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division </td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Section </td><td class='popup-cell'>{section }</td></tr>" +
        "<tr><td>Line</td><td class='popup-cell'>{line}</td></tr>" +
        "<tr><td>Gauge</td><td class='popup-cell'>{gauge}</td></tr>" +
        "<tr><td>Location</td><td class='popup-cell'>{from_km}Km {from_met}m - {to_km}Km {to_met}m</td></tr>" +
        "<tr><td>Sectional Speed</td><td class='popup-cell'>{speed} (Kmph)</td></tr>" +
        "</table>",
}
export const bridgeORN_1or2_PopUpTemplate = {
    title: "Bridge ORN",
    content: "<table class='table table-striped'>" +
        "<tr><td>Asset ID </td><td class='popup-cell'>{bridgeid}</td></tr>" +
        "<tr><td>Railway </td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division </td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Bridge No. </td><td class='popup-cell'>{bridgeno}</td></tr>" +
        "<tr><td>Section/Station </td><td class='popup-cell'>{section_station}</td></tr>" +
        "<tr><td>Location</td><td class='popup-cell'>{from_km}Km {from_met}m - {to_km}Km {to_met}m</td></tr>" +
        "<tr><td>Category</td><td class='popup-cell'>{category }</td></tr>" +
        "<tr><td>Structure Type </td><td class='popup-cell'>{structure_type}</td></tr>" +
        "<tr><td>ORN </td><td class='popup-cell'>{orn}</td></tr>" +
        "<tr><td>Span Configuration </td><td class='popup-cell'>{span_configuration}</td></tr>" +
        "<tr><td>Std. of Loading fit for</td><td class='popup-cell'>{std_of_loading_fit_for}</td></tr>" +
        "<tr><td>Overstressed Girder</td><td class='popup-cell'>{overstressed}</td></tr>" +
        "</table>",
}
export const monsoonReservesPopUpTemplate = {
    title: "Monsoon Reserve Location",
    content: "<table class='table table-striped'>" +
        "<tr><td>Type of Consumables </td><td class='popup-cell'>{type_of_consumable}</td></tr>" +
        "<tr><td>Location Type </td><td class='popup-cell'>{location_type}</td></tr>" +
        "<tr><td>Section/Station</td><td class='popup-cell'>{section_station}</td></tr>" +
        "<tr><td>Location </td><td class='popup-cell'>{from_km}Km {from_met}m</td></tr>" +
        "<tr><td>Sanctioned Quantity</td><td class='popup-cell'>{sanctioned_qty} {consumable_unit}</td></tr>" +
        "<tr><td>Quantity Available</td><td class='popup-cell'>{qty_available} {consumable_unit}</td></tr>" +
        "</table>",
};
export const trackQualityPopUPTemplate = {
    title: "Track Quality",
    content: "<table class='table table-striped'>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division</td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Section</td><td class='popup-cell'>{section}</td></tr>" +
        "<tr><td>Line</td><td class='popup-cell'>{line}</td></tr>" +
        "<tr><td>Location</td><td class='popup-cell'>{from_km}Km {from_met}m - {to_km}Km {to_met}m</td></tr>" +
        "<tr><td>Sectional Speed</td><td class='popup-cell'>{sectionalspeed} (Kmph)</td></tr>" +
        "<tr><td>Track Quality</td><td class='popup-cell'>{performance}</td></tr>" +
        "</table>",
}
export const nbmlOnTRCPopUpTemplate = {
    title: "NBML",
    content: "<table class='table table-striped'>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division</td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Section</td><td class='popup-cell'>{section}</td></tr>" +
        "<tr><td>Line</td><td class='popup-cell'>{line}</td></tr>" +
        "<tr><td>Location</td><td class='popup-cell'>{from_km}Km {from_met}m - {to_km}Km {to_met}m</td></tr>" +
        "<tr><td>Sectional Speed</td><td class='popup-cell'>{sectional_speed}</td></tr>" +
        "<tr><td>Run Date</td><td class='popup-cell'>{run_date}</td></tr>" +
        "</table>",
}
export const umlLocationPopUpTemplate = {
    title: "UML Location",
    content: "<table class='table table-striped'>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division</td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Section</td><td class='popup-cell'>{section}</td></tr>" +
        "<tr><td>Line</td><td class='popup-cell'>{line}</td></tr>" +
        "<tr><td>Location</td><td class='popup-cell'>{from_km}Km {from_met}m</td></tr>" +
        "<tr><td>Speed</td><td class='popup-cell'>{speed}</td></tr>" +
        "<tr><td>Peak</td><td class='popup-cell'>{peak}</td></tr>" +
        "<tr><td>Parameter</td><td class='popup-cell'>{param}</td></tr>" +
        "<tr><td>Run Date</td><td class='popup-cell'>{run_date}</td></tr>" +
        "</table>",
}

export const omsPeaksPopUpTemplate = {
    title: "OMS Repeated Loaction",
    content: "<table class='table table-striped'>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division</td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Section</td><td class='popup-cell'>{section}</td></tr>" +
        "<tr><td>Line</td><td class='popup-cell'>{line}</td></tr>" +
        "<tr><td>Location</td><td class='popup-cell'>{from_km}Km {from_met}m - {to_km}Km {to_met}m</td></tr>" +
        "<tr><td>Run Date</td><td class='popup-cell'>{run_date}</td></tr>" +
        "<tr><td>Year</td><td class='popup-cell'>{oms_year}</td></tr>" +
        "</table>",
}

export const specialRoutePopUpTemplate = {
    title: "Special Routes",
    content: "<table class='table table-striped'>" +
        "<tr><td>Railway</td><td class='popup-cell'>{railway}</td></tr>" +
        "<tr><td>Division</td><td class='popup-cell'>{division}</td></tr>" +
        "<tr><td>Route Class</td><td class='popup-cell'>{routeclass}</td></tr>" +
        "<tr><td>Type of Route</td><td class='popup-cell'>{type_of_route }</td></tr>" +
        "<tr><td>Route name</td><td class='popup-cell'>{route_name}</td></tr>" +
        "<tr><td>Section</td><td class='popup-cell'>{section}</td></tr>" +
        "<tr><td>Line</td><td class='popup-cell'>{line}</td></tr>" +
        "<tr><td>Location</td><td class='popup-cell'>{from_km}Km {from_met}m - {to_km}Km {to_met}m</td></tr>" +
        "<tr><td>Sectional Speed</td><td class='popup-cell'>{sectional_speed} (Kmph)</td></tr>" +
        "<tr><td>Sectional GMT</td><td class='popup-cell'>{sectional_gmt}</td></tr>" +
        "</table>",
}