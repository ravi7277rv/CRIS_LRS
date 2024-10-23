const psrAssetCount = [
    { label: "< 60 KMPH", color: "red", minValue: 0, maxValue: 59, field: "psr" },
    { label: ">= 60 & < 100 KMPH", color: "blue", minValue: 60, maxValue: 99, field: "psr" },
    { label: ">= 100 KMPH", color: "#430A5D", minValue: 100, maxValue: 1000000, field: "psr" }
]
const railSectionAnalysisAssetCount = [
    { label: "60 Kg", color: "#A67B5B", minValue: "60 Kg", field: "rail_section", lr_rr: "YES" },
    { label: "60KG D MARK", color: "#FF7F3E", minValue: "60KG D MARK", field: "rail_section", lr_rr: "YES" },
    { label: "52 Kg", color: "green", minValue: "52 Kg", field: "rail_section", lr_rr: "YES" },
    { label: "52KG D MARK", color: "#FF0080", minValue: "52KG D MARK", field: "rail_section", lr_rr: "YES" },
    { label: "68 Kg", color: "#FF7EE2", minValue: "68 Kg", field: "rail_section", lr_rr: "YES" },
    { label: "50 Lbs", color: "#009FBD", minValue: "50 Lbs", field: "rail_section", lr_rr: "YES" },
    { label: "90 Lbs", color: "#E0A75E", minValue: "90 Lbs", field: "rail_section", lr_rr: "YES" },
    { label: "Zu-1-60", color: "#ADD899", minValue: "Zu-1-60", field: "rail_section", lr_rr: "YES" },
    { label: "41 1/4 Lbs", color: "#006989", minValue: "41 1/4 Lbs", field: "rail_section", lr_rr: "YES" },
    { label: "66 1/4 Lbs", color: "#FF0000", minValue: "66 1/4 Lbs", field: "rail_section", lr_rr: "YES" },
]
const gmtAssetCount = [
    { label: ">=50<60", color: "#FF0000", minValue: 50, maxValue: 59, field: "accumulated_gmt", lr_rr: "YES" },
    { label: ">=60<70", color: "#00FF00", minValue: 60, maxValue: 69, field: "accumulated_gmt", lr_rr: "YES" },
    { label: ">=70<80", color: "#0000FF", minValue: 70, maxValue: 79, field: "accumulated_gmt", lr_rr: "YES" },
    { label: ">=80<90", color: "#FFFF00", minValue: 80, maxValue: 89, field: "accumulated_gmt", lr_rr: "YES" },
    { label: ">=90<100", color: "#FF00FF", minValue: 90, maxValue: 99, field: "accumulated_gmt", lr_rr: "YES" },
    { label: ">100", color: "#00FFFF", minValue: 100, maxValue: 10000000, field: "accumulated_gmt", lr_rr: "YES" },
]
const railFractureAssetCount = [
    { label: "Rail Fracture", color: "#720455", year: 0 },
    { label: "Rail Fracture", color: "#720455", year: 0 },
    { label: "Rail Fracture", color: "#720455", year: 0 },
]
const levelCrossingAssetCount = [
    { label: "< 1 Lac", color: "green", minValue: 0, maxValue: 100000, field: "tvu" },
    { label: "> 1 Lac", color: "red", minValue: 100000, maxValue: 99999990, field: "tvu" },
]
const weldFractureAssetCount = [
    { label: "Weld Fracture", color: "#FF5F00", year: 0 },
    { label: "Weld Fracture", color: "#FF5F00", year: 0 },
    { label: "Weld Fracture", color: "#FF5F00", year: 0 },
]
const specialRouteAssetCount = [
    { label: "CC+8+2 T Running Routes", color: "red", minValue: "CC+8+2 T Running Routes", field: "type_of_route" },
    { label: "Golden Quadrilateral & Diagonal Routes", color: "blue", minValue: "Golden Quadrilateral & Diagonal Routes", field: "type_of_route" },
]
const annualSectionalGmtAssetCount = [
    { label: "Below 20", color: "#80C4E9", minValue: 1, maxValue: 19, field: "gmt" },
    { label: ">=20<40", color: "#088395", minValue: 20, maxValue: 39, field: "gmt" },
    { label: ">=40<60", color: "#D0B8A8", minValue: 40, maxValue: 59, field: "gmt" },
    { label: ">=60<80", color: "#FFB22C", minValue: 60, maxValue: 79, field: "gmt" },
    { label: ">80", color: "#8D493A", minValue: 80, maxValue: 10000000, field: "gmt" },
]
const sectionalSpeedAssetCount = [
    { label: "<100 (Kmph)", color: "red", minValue: -10000, maxValue: 99, field: "speed" },
    { label: "100-110 (Kmph)", color: "blue", minValue: 100, maxValue: 109, field: "speed" },
    { label: "110-130 (Kmph)", color: "#430A5D", minValue: 110, maxValue: 129, field: "speed" },
    { label: "130-160 (Kmph)", color: "#F57D1F", minValue: 130, maxValue: 160, field: "speed" },
]
const trackQualityAssetCount = [
    { label: "Very Good", color: "#1A5319", minValue: "Very Good", field: "performance" },
    { label: "Average", color: "#9BEC00", minValue: "Average", field: "performance" },
    { label: "Good", color: "orange", minValue: "Good", field: "performance" },
]
const umlAssetCount = [
    { label: "UML (No. of Peaks)", color: "blue" }
]
export const nbmlAssetCount = [
    { label: "NBML (No. of Blocks)", color: "red" }
]
const omsPeakAssetCount = [
    { label: "> 0.15g", color: "#720455", minValue: -10000, maxValue: 0.2, field: "peak_value" },
    { label: "> 0.20g", color: "#DA7297", minValue: 0.2, maxValue: 100, field: "peak_value" },
 ]
const bridgeORNAssetCount = [
    { label: "0", color: "#6C0345", minValue: 0, field: "orn" },
    { label: "1", color: "#E72929", minValue: 1, field: "orn" },
    { label: "2", color: "#FF8225", minValue: 2, field: "orn" },
    { label: "3", color: "#FFC700", minValue: 3, field: "orn" },
    { label: "4", color: "#A1DD70", minValue: 4, field: "orn" },
    { label: "5", color: "#399918", minValue: 5, field: "orn" },
    { label: "6", color: "#074173", minValue: 6, field: "orn" },
]
const monsoonReservesAssetCount = [
    { label: "Boulders", color: "red", minValue: "Boulders (cum)", field: "type_of_consumable" },
    { label: "Sand/ Quarry Dust", color: "blue", minValue: "Sand/ Quarry Dust (cum)", field: "type_of_consumable" },
    { label: "Ballast", color: "#708871", minValue: "Ballast (cum)", field: "type_of_consumable" },
    { label: "Basket", color: "#FFB200", minValue: "Basket (Nos.)", field: "type_of_consumable" },
    { label: "Empty Cement bags", color: "#405D72", minValue: "Empty Cement bags (Nos.)", field: "type_of_consumable" },
    { label: "Sand Filled Bags", color: "#55AD9B", minValue: "Sand Filled Bags (Nos.)", field: "type_of_consumable" },
    { label: "Wire Net Trungers", color: "#E68369", minValue: "Wire Net Trungers (Sqm)", field: "type_of_consumable" },
    { label: "Wooder /ST Sleeters", color: "#83B4FF", minValue: "Wooder /ST Sleeters (Nos.)", field: "type_of_consumable" },
    { label: "Others", color: "#987070", minValue: "Others", field: "type_of_consumable" },
]
const bridgeWaterLevelAssetCount = [
    { label: "Approaching DL", color: "yellow", minValue: "Approaching DL", field: "dl_wl_diff_label " },
    { label: "Safe Level", color: "green", minValue: "Safe Level", field: "dl_wl_diff_label " },
    { label: "Crossed DL", color: "red", minValue: "Crossed DL", field: "dl_wl_diff_label " },
]
export const assetCountOfScreens = [
    { id: 1, title: "PSR (in No.)", asset: psrAssetCount, type: "polyline" },
    { id: 2, title: "Rail Section Analysis (in Track Km)", asset: railSectionAnalysisAssetCount, type: "polyline" },
    { id: 3, title: "GMT Details(% Service Life) (in Track Km)", asset: gmtAssetCount, type: "polyline" },
    { id: 4, title: "Rail Fracture (in No.)", asset: railFractureAssetCount, type: "point" },
    { id: 5, title: "Level Crossing (TVU in No.)", asset: levelCrossingAssetCount, type: "point" },
    { id: 6, title: "Weld Fracture (in No.)", asset: weldFractureAssetCount, type: "point" },
    { id: 7, title: "Special Route (in Track Km)", asset: specialRouteAssetCount, type: "polyline" },
    { id: 8, title: "Annual Sectional GMT (in Track Km)", asset: annualSectionalGmtAssetCount, type: "polyline" },
    { id: 9, title: "Sectional Speed(Kmph) (in Track Km)", asset: sectionalSpeedAssetCount, type: "polyline" },
    { id: 10, title: "Track Quality (in Track Km)", asset: trackQualityAssetCount, type: "polyline" },
    { id: 11, title: "NBML/UML Location (in No.)", asset: umlAssetCount, type: "point" },
    { id: 12, title: "OMS Repeated Location (in No.)", asset: omsPeakAssetCount, type: "polyline" },
    { id: 13, title: "Bridge ORN (No. of Bridges)", asset: bridgeORNAssetCount, type: "polyline" },
    { id: 14, title: "Monsoon Reserve (No. of Location)", asset: monsoonReservesAssetCount, type: "point" },
    { id: 15, title: "Bridge Water Level (No. of Bridges)", asset: bridgeWaterLevelAssetCount, type: "point" },
]