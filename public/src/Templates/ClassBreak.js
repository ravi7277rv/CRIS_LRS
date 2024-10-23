export const gmtClassBreaks = [
    {
        minValue: 50,
        maxValue: 59,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#FF0000", // Red
            width: 2 // Adjust the width property instead of size
        },
        label: ">=50<60"
    },
    {
        minValue: 60,
        maxValue: 69,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#EB5B00", // Green
            width: 2 // Adjust the width property instead of size
        },
        label: ">=60<70"
    },
    {
        minValue: 70,
        maxValue: 79,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#FFC700", // Blue
            width: 2 // Adjust the width property instead of size
        },
        label: ">=70<80"
    },
    {
        minValue: 80,
        maxValue: 89,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#4793AF", // Yellow
            width: 2 // Adjust the width property instead of size
        },
        label: ">=80<90"
    },
    {
        minValue: 90,
        maxValue: 99,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#06D001", // Magenta
            width: 2 // Adjust the width property instead of size
        },
        label: ">=90<100"
    },
    {
        minValue: 100,
        maxValue: 10000000,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#399918", // Cyan
            width: 2 // Adjust the width property instead of size
        },
        label: ">100"
    }
];
export const permanentSpeedRestrictionsSspeedclassBreaks = [
    {
        minValue: 0,
        maxValue: 59,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "red",
            width: 2 
        },
        label: "< 60 KMPH"
    },
    {
        minValue: 60,
        maxValue: 99,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "blue",
            width: 2 
        },
        label: ">= 60 & < 100 KMPH"
    },
    {
        minValue: 100,
        maxValue: 10000000,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#430A5D",
            width: 2 
        },
        label: ">= 100 KMPH"
    },
];
export const levelCrossingClassBreak = [
    {
        minValue: 0,
        maxValue: 100000,
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: "green",
            size: 6,
        },
        label: "< 1 Lac"
    },
    {
        minValue: 100000,
        maxValue: 99999990,
        symbol: {
            type: "simple-marker",
            style: "circle",
            size: 6,
            color: "red",
        },
        label: "> 1 Lac"
    },
];
export const baseTrackClassBreak = [
    {
        value: "NER",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(139, 0, 0, 0.3)", // Dark Faded Red
            width: 1,
        },
    },
    {
        value: "ECR",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(0, 100, 0, 0.3)", // Dark Faded Green
            width: 1,
        },
    },
    {
        value: "NR",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(0, 0, 139, 0.3)", // Dark Faded Blue
            width: 1,
        },
    },
    {
        value: "CR",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(139, 139, 0, 0.3)", // Dark Faded Yellow
            width: 1,
        },
    },
    {
        value: "WR",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(139, 0, 139, 0.3)", // Dark Faded Magenta
            width: 1,
        },
    },
    {
        value: "NWR",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(0, 139, 139, 0.3)", // Dark Faded Cyan
            width: 1,
        },
    },
    {
        value: "SCR",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(139, 69, 0, 0.3)", // Dark Faded Orange
            width: 1,
        },
    },

    {
        value: "NCR",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(75, 0, 130, 0.3)", // Dark Faded Violet
            width: 1,
        },
    },
    {
        value: "WCR",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(85, 107, 47, 0.3)", // Dark Faded Olive
            width: 1,
        },
    },
    {
        value: "ECOR",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(139, 0, 69, 0.3)", // Dark Faded Rose
            width: 1,
        },
    },
    {
        value: "ER",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(25, 25, 112, 0.3)", // Dark Faded Navy
            width: 1,
        },
    },
    {
        value: "MRK",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(184, 134, 11, 0.3)", // Dark Faded Goldenrod
            width: 1,
        },
    },
    {
        value: "NFR",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(139, 69, 19, 0.3)", // Dark Faded Sienna
            width: 1,
        },
    },
    {
        value: "SECR",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(47, 79, 79, 0.3)", // Dark Faded Dark Slate Gray
            width: 1,
        },
    },
    {
        value: "SER",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(139, 0, 0, 0.3)", // Dark Faded Dark Red
            width: 1,
        },
    },
    {
        value: "SR",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(34, 139, 34, 0.3)", // Dark Faded Forest Green
            width: 1,
        },
    },
    {
        value: "SWR",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "rgba(72, 61, 139, 0.3)", // Dark Faded Slate Blue
            width: 1,
        },
    },
];
export const railSectionClassBreaks = [
    {
        value: "60 Kg",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#A67B5B",
            width: 2
        },
        label: "60 Kg"
    },
    {
        value: "60KG D MARK",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#FF7F3E",
            width: 2
        },
        label: "60KG D MARK",
    },
    {
        value: "52 Kg",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "green",
            width: 2
        },
        label: "52 Kg"
    },
    {
        value: "52KG D MARK",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#FF0080",
            width: 2
        },
        label: "52KG D MARK",
    },
    {
        value: "68 Kg",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#FF7EE2",
            width: 2
        },
        label: "68 Kg",
    },
    {
        value: "50 Lbs",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#009FBD",
            width: 2
        },
        label: "50 Lbs",
    },
    {
        value: "90 Lbs",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#E0A75E",
            width: 2
        },
        label: "90 Lbs",
    },
    {
        value: "Zu-1-60",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#ADD899",
            width: 2
        },
        label: "Zu-1-60",
    },
    {
        value: "41 1/4 Lbs",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#006989",
            width: 2
        },
        label: "41 1/4 Lbs",
    },
    {
        value: "66 1/4 Lbs",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#FF0000",
            width: 2
        },
        label: "66 1/4 Lbs",
    },
];
export const sectionalGmtClassBreaks = [
    {
        minValue: -1000,
        maxValue: 19,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#80C4E9",
            width: 2
        },
        label: "Below 20"
    },
    {
        minValue: 20,
        maxValue: 39,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#088395",
            width: 2
        },
        label: ">=20<40"
    },
    {
        minValue: 40,
        maxValue: 59,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#D0B8A8",
            width: 2
        },
        label: ">=40<60"
    },
    {
        minValue: 60,
        maxValue: 79,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#FFB22C",
            width: 2
        },
        label: ">=60<80"
    },
    {
        minValue: 80,
        maxValue: 10000000,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#8D493A",
            width: 2
        },
        label: ">80"
    },
];
export const sectionalSpeedClassBreaks = [
    {
        minValue: -10000,
        maxValue: 99,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "red",
            width: 2 // Adjust the width property instead of size
        },
        label: "<100"
    },
    {
        minValue: 100,
        maxValue: 109,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "blue",
            width: 2 // Adjust the width property instead of size
        },
        label: "100-110"
    },
    {
        minValue: 110,
        maxValue: 129,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#430A5D",
            width: 2 // Adjust the width property instead of size
        },
        label: "110-130"
    },
    {
        minValue: 130,
        maxValue: 160,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#F57D1F",
            width: 2 // Adjust the width property instead of size
        },
        label: "130-160"
    },
];
export const bridgeOrmClassBreaks = [
    {
        value: 0,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#6C0345",
            width: 4
        },
        label: "0"
    },
    {
        value: 1,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#E72929",
            width: 4 
        },
        label: "1"
    },
    {
        value: 2,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#FF8225",
            width: 4
        },
        label: "2"
    },
    {
        value: 3,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#FFC700",
            width: 4
        },
        label: "3"
    },
    {
        value: 4,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#A1DD70",
            width: 4
        },
        label: "4"
    },
    {
        value: 5,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#399918",
            width: 4
        },
        label: "5"
    },
    {
        value: 6,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#074173",
            width: 4
        },
        label: "6"
    },

];
export const bridgeWaterLevelClassBreak = [
    {
        value: "Approaching DL",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "yellow",
            width: 4,
        },
        label: "Approaching DL (Difference between WL & DL is < 0.5mts)"
    },
    {
        value: "Safe Level",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "green",
            width: 4,
        },
        label: "Safe Level"
    },
    {
        value: "Crossed DL",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "red",
            width: 4,

        },
        label: "Crossed DL"
    },

];
export const monsoonReservesClassBreak = [
    {
        value: "Boulders (cum)",
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: "red",
            size: 6,
        },
        label: "Boulders"
    },
    {
        value: "Sand/ Quarry Dust (cum)",
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: "blue",
            size: 6,
        },
        label: "Sand/ Quarry Dust"
    },
    {
        value: "Ballast (cum)",
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#708871",
            size: 6,
        },
        label: "Ballast"
    },
    {
        value: "Basket (Nos.)",
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#FFB200",
            size: 6,
        },
        label: "Ballast"
    },
    {
        value: "Empty Cement bags (Nos.)",
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#405D72",
            size: 6,
        },
        label: "Empty Cement bags"
    },
    {
        value: "Sand Filled Bags (Nos.)",
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#55AD9B",
            size: 6,
        },
        label: "Sand Filled Bags"
    },
    {
        value: "Wire Net Trungers (Sqm)",
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#E68369",
            size: 6,
        },
        label: "Wire Net Trunger"
    },
    {
        value: "Wooder /ST Sleeters (Nos.)",
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#83B4FF",
            size: 6,
        },
        label: "Wooder /ST Sleeters"
    },
    {
        value: "Others",
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#987070",
            size: 6,
        },
        label: "Others"
    },
];

export const trackQualityClassBrak = [
    {
        value: "Very Good",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#1A5319",
            width: 2 
        },
        label: "Very Good"
    },
    {
        value: "Good",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#9BEC00",
            width: 2 
        },
        label: "Good"
    },
    {
        value: "Average",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "orange",
            width: 2 
        },
        label: "Average"
    },
];

export const specialRouteClassBreak = [
    {
        value: "CC+8+2 T Running Routes",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "red",
            width: 3,
        },
        label: "CC+8+2 T Running Routes"
    },
    {
        value: "Golden Quadrilateral & Diagonal Routes",
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "blue",
            width: 3,
        },
        label: "Golden Quadrilateral & Diagonal Routes"
    },
];
export const omsPeakClassBreak = [
    {
        minValue: -10000,
        maxValue: 0.19,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#720455",
            width: 4,
        },
        label: "> 0.15g"
    },
    {
        minValue: 0.2,
        maxValue: 100,
        symbol: {
            type: "simple-line",
            style: "solid",
            color: "#DA7297",
            width: 4,
        },
        label: "> 0.20g"
    },
]