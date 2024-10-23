import { deffinitionExpression, monsoonQuery, operationalLayers } from '../../Templates/Template';
import { loadModules } from 'esri-loader';
const [Point, geometry, SpatialReference, Graphic, geometryEngine] = await loadModules(["esri/geometry/Point",
    "esri/geometry", "esri/geometry/SpatialReference", "esri/Graphic", "esri/geometry/geometryEngine"], { css: true });

export const areAllValuesSelected = (valuesFromLayer, selectedValues) => {
    const allValues = valuesFromLayer.map(v => v.value).filter(v => v !== "All");
    return allValues.every(value => selectedValues.includes(value));
};
export const updateValues = (selectedValue, isChecked, ValuesFromLayer, prevSelectedValues) => {

    let updatedValuesFromLayer;
    let selectedValues = [];

    if (selectedValue === "All") {
        updatedValuesFromLayer = ValuesFromLayer.map((v) => ({ ...v, checked: isChecked }));
        selectedValues = isChecked ? ValuesFromLayer.filter((v) => v.value !== "All").map((v) => v.value) : [];
    } else {
        updatedValuesFromLayer = ValuesFromLayer.map((v) =>
            v.value === selectedValue ? { ...v, checked: isChecked } : v
        );

        if (isChecked) {
            const allValuesSelected = updatedValuesFromLayer.every((v) => v.value === "All" || v.checked);
            if (allValuesSelected) {
                updatedValuesFromLayer = updatedValuesFromLayer.map((v) =>
                    v.value === "All" ? { ...v, checked: true } : v
                );
            }
            selectedValues = [...prevSelectedValues, selectedValue].filter((v) => v !== "All");
        } else {
            updatedValuesFromLayer = updatedValuesFromLayer.map((v) =>
                v.value === "All" ? { ...v, checked: false } : v
            );
            selectedValues = prevSelectedValues.filter(f => f !== "All" && f !== selectedValue);
        }
    }

    return {
        updatedValuesFromLayer,
        selectedValues
    };
};
export const updateRailways = (selectedValue, isChecked, railwayNames, railwayZone) => {

    let updatedValuesFromLayer;
    let selectedValues = [];

    if (selectedValue === "All") {
        updatedValuesFromLayer = railwayNames.map((v) => ({ ...v, isSelected: isChecked }));
        selectedValues = isChecked ? railwayNames.filter((v) => v.value !== "All").map((v) => v.value) : [];
    } else {
        updatedValuesFromLayer = railwayNames.map((v) =>
            v.value === selectedValue ? { ...v, isSelected: isChecked } : v
        );
        if (isChecked) {
            const allValuesSelected = updatedValuesFromLayer.every((v) => v.value === "All" || v.isSelected);
            if (allValuesSelected) {
                updatedValuesFromLayer = updatedValuesFromLayer.map((v) =>
                    v.value === "All" ? { ...v, isSelected: true } : v
                );
            }
            selectedValues = [...railwayZone, selectedValue].filter((v) => v !== "All");
        } else {
            updatedValuesFromLayer = updatedValuesFromLayer.map((v) =>
                v.value === "All" ? { ...v, isSelected: false } : v
            );
            selectedValues = railwayZone.filter(f => f !== "All" && f !== selectedValue);
        }
    }
    return {
        updatedValuesFromLayer,
        selectedValues
    };
}
export const queryAndDisplayFeatures = async (id, layer, finalQuery, view, toast, stopLoaderForQueryBuilder) => {

    let query = layer.createQuery();
    query.where = finalQuery;
    try {
        const result = await layer.queryFeatures(query);
        if (result.features.length !== 0) {
            let type = result.features[0].geometry.type;
            let graphicsExtent = null;
            if (type === "point") {
                graphicsExtent = result.features.filter(f => f.geometry.x !== 0).reduce((accExtent, feature) => {
                    let _ext = new geometry.Extent(feature.geometry.x, feature.geometry.y, feature.geometry.x, feature.geometry.y, new SpatialReference({ wkid: 4326 }));
                    return accExtent ? accExtent.union(_ext) : _ext;
                }, null);
            } else {
                graphicsExtent = result.features.filter(f => f.geometry.paths[0].length > 0).reduce((extent, feature) => {
                    return extent ? extent.union(feature.geometry.extent) : feature.geometry.extent;
                }, null);
            }
            if (graphicsExtent) {
                const paddingFactor = 0.01;
                const expandedExtent = graphicsExtent.expand(1 + paddingFactor);

                view.goTo(expandedExtent);
            }
            if (stopLoaderForQueryBuilder) {
                stopLoaderForQueryBuilder(id)
            }
        } else {
            if (toast) {
                toast("No Features Found");
                stopLoaderForQueryBuilder(id);
            }
        }
    } catch (error) {
        console.log(`Error while querying features: ${error}`);
    }
};
export const getYears = async (featurelayer, screenAsset) => {

    let query = featurelayer.createQuery();
    query.outFields = ["year"];
    const result = await featurelayer.queryFeatures(query);
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
    const uniqueValues = Object.keys(yearCounts).map((year) => ({
        value: year,
        count: yearCounts[year],
        checked: true,
    }));
    uniqueValues.sort((a, b) => {
        if (typeof a.value === 'number' && typeof b.value === 'number') {
            return a.value - b.value;
        } else if (typeof a.value === 'string' && typeof b.value === 'string') {
            return a.value.localeCompare(b.value);
        } else {
            return String(a.value).localeCompare(String(b.value));
        }
    });
    const lastThreeYears = uniqueValues.length > 3 ? uniqueValues.slice(-3) : uniqueValues;
    const yearValues = lastThreeYears.map(year => parseInt(year.value));

    const updatedAsset = screenAsset.asset.map((asset, index) => ({
        ...asset,
        year: yearValues[index] || asset.year
    }));
    return { ...screenAsset, asset: updatedAsset };

};
export const queryFeatureCounts = async (featureLayer, minValue, maxValue, field, lr_rr, screenQuery, year, customQuery, id, yearsArray) => {

    const query = featureLayer.createQuery();
    query.where = "";
    if (field) {
        if (typeof minValue === "string") {
            query.where = `(${field} = '${minValue}')`;
        } if (typeof minValue !== "string" && minValue === maxValue) {
            query.where = `(${field} = ${minValue})`;
        } else if (typeof minValue !== "string") {
            query.where = `(${field} >= ${minValue} AND ${field} < ${maxValue})`;
        }
    }
    if (screenQuery && screenQuery && query.where !== "") {
        query.where += ` AND (${screenQuery})`;
    } else if (screenQuery !== "") {
        query.where = `(${screenQuery})`;
    }
    if (customQuery && customQuery && query.where !== "") {
        query.where += ` AND (${customQuery})`
    } else if (customQuery !== "") {
        query.where = `(${customQuery})`
    }

    if (id === 13) {
        query.returnDistinctValues = true;
        query.outFields = ["bridgeid"];
        query.groupByFieldsForStatistics = ["bridgeid"];
        query.returnCountOnly = false;
        query.returnGeometry = false;

        try {
            const result = await featureLayer.queryFeatures(query);
            const uniqueBridgeIds = new Set(result.features.map(feature => feature.attributes.bridgeid));
            return uniqueBridgeIds.size;
        } catch (error) {
            console.error("Error querying feature count for bridgeid:", error);
            return 0;
        }
    } else if (id === 5) {
        query.returnDistinctValues = true;
        query.outFields = ["lcno"];
        query.groupByFieldsForStatistics = ["lcno"];
        query.returnCountOnly = false;
        query.returnGeometry = false;

        try {
            const result = await featureLayer.queryFeatures(query);
            const uniqueLcnoValues = new Set(result.features.map(feature => feature.attributes.lcno));
            return uniqueLcnoValues.size;
        } catch (error) {
            console.error("Error querying feature count for lcno:", error);
            return 0;
        }
    } else if (id === 4 || id === 6) {
        if (!year)
            return;
        const y = yearsArray.filter(y => y == year)
        const _query = featureLayer.createQuery();
        if (query.where !== "") {
            _query.where = `${query.where} AND year = ${y}`;
        } else {
            _query.where = `year = ${y}`;
        }
        try {
            const count = await featureLayer.queryFeatureCount(_query);
            return count;
        } catch (error) {
            console.error("Error querying feature count:", error);
            return 0;
        }
    } else if (id === 12) {
        if (yearsArray.length > 0) {
            query.where += ` AND oms_year IN (${yearsArray.join(",")})`;
        }
        const result = await featureLayer.queryFeatureCount(query);
        return result
    } else {
        query.returnCountOnly = true; // Return count only for other cases
        try {
            if (id === 2 || id === 3 || id === 7 || id === 8 || id === 9 || id === 10) {
                const result = await featureLayer.queryFeatures(query);
                let track_length = 0;
                if (lr_rr = 'YES') {
                    result.features.forEach((f) => {
                        track_length += (f.attributes['to_measurement'] - f.attributes['from_measurement']) / 2
                    })
                } else {
                    result.features.forEach((f) => {
                        track_length += (f.attributes['to_measurement'] - f.attributes['from_measurement'])
                    })
                }
                return (track_length / 1000).toFixed(3);
                // return (track_length/1000);
            } else {
                const result = await featureLayer.queryFeatureCount(query);
                return result
            }

        } catch (error) {
            console.error("Error querying feature count:", error);
            return 0;
        }
    }
};
export const updateLegendForId4And6 = async (featurelayer, legendData, title) => {
    try {
        // Fetch the feature count
        const query = featurelayer.createQuery();
        query.where = "1=1";
        query.returnCountOnly = true;
        const count = await featurelayer.queryFeatureCount(query);

        // Create the container for count label
        const countLabelContainer = document.createElement("div");
        countLabelContainer.style.marginLeft = "10px";
        countLabelContainer.style.paddingTop = "10px";
        countLabelContainer.style.paddingBottom = "10px";

        // Count label with circle
        const countLabel = document.createElement("span");
        countLabel.style.display = "flex";
        countLabel.style.flexDirection = "column-reverse";
        countLabel.style.fontWeight = "600";
        countLabel.style.marginLeft = "7px";

        const circle = document.createElement("span");
        circle.style.width = "10px";
        circle.style.height = "10px";
        circle.style.borderRadius = "50%";
        circle.style.marginRight = "5px";
        circle.style.marginTop = "12px";
        circle.style.marginBottom = "12px";
        circle.style.marginLeft = "16px";

        // Set the color based on the title
        if (title === "Rail Fracture") {
            circle.style.backgroundColor = "#720455";
        } else if (title === "Weld Fracture") {
            circle.style.backgroundColor = "#FF5F00";
        }

        countLabel.appendChild(circle);
        countLabel.appendChild(document.createTextNode(`${title}`)); // Exclude count
        countLabelContainer.appendChild(countLabel);

        // Add a horizontal line at the bottom of the container
        const horizontalLineBottom = document.createElement("hr");
        horizontalLineBottom.style.border = "0";
        horizontalLineBottom.style.borderTop = "1px solid silver";
        horizontalLineBottom.style.marginTop = "10px";
        horizontalLineBottom.style.marginBottom = "0";

        countLabelContainer.appendChild(horizontalLineBottom);

        // Insert the container into the legendData container
        if (legendData.container) {
            legendData.container.insertBefore(countLabelContainer, legendData.container.firstChild);
        } else {
            console.error("Legend container is not available.");
        }
    } catch (error) {
        console.error("Error updating legend with count and junction details:", error);
    }
};
export const updateLegendForId13 = async (featurelayer, legendData, title) => {
    try {
        // Fetch the feature count
        const query = featurelayer.createQuery();
        query.where = "1=1";
        query.returnCountOnly = true;
        const count = await featurelayer.queryFeatureCount(query);

        // Create a container for the entire legend section
        const legendSection = document.createElement("div");
        legendSection.style.marginLeft = "10px";
        legendSection.style.paddingTop = "10px";
        legendSection.style.paddingBottom = "10px";

        // Add the title at the top
        const titleElement = document.createElement("div");
        titleElement.textContent = title;
        titleElement.style.fontWeight = "bold";
        titleElement.style.marginBottom = "10px";
        legendSection.appendChild(titleElement);

        // Array of colors for legends 1 to 6
        const legendColors = ["#6C0345", "#E72929", "#FF8225", "#FFC700", "#A1DD70", "#399918", "#074173"];

        // Add legend items 0 to 6 with horizontal lines
        legendColors.forEach((color, index) => {

            const legendItem = document.createElement("div");
            legendItem.style.display = "flex";
            legendItem.style.alignItems = "center";
            legendItem.style.marginBottom = "5px";

            const line = document.createElement("div");
            line.style.width = "20px";
            line.style.height = "2px";
            line.style.backgroundColor = color;
            line.style.marginRight = "5px";
            line.style.marginLeft = "20px"

            const label = document.createElement("span");
            label.textContent = `${index}`;
            label.style.marginLeft = "5px";

            legendItem.appendChild(line);
            legendItem.appendChild(label);
            legendSection.appendChild(legendItem);
        });

        // Add "overstressed" label with an empty circle
        const overstressedContainer = document.createElement("div");
        overstressedContainer.style.display = "flex";
        overstressedContainer.style.alignItems = "center";
        overstressedContainer.style.marginTop = "10px";

        const emptyCircle = document.createElement("span");
        emptyCircle.style.width = "18px";
        emptyCircle.style.height = "18px";
        emptyCircle.style.border = "2px solid red";
        emptyCircle.style.borderRadius = "50%";
        emptyCircle.style.marginLeft = "24px";

        const overstressedLabel = document.createElement("span");
        overstressedLabel.textContent = "Overstressed";
        overstressedLabel.style.marginLeft = "7px";

        overstressedContainer.appendChild(emptyCircle);
        overstressedContainer.appendChild(overstressedLabel);
        legendSection.appendChild(overstressedContainer);

        // Add the horizontal line at the bottom of the container
        const horizontalLineBottom = document.createElement("hr");
        horizontalLineBottom.style.border = "0";
        horizontalLineBottom.style.borderTop = "1px solid silver";
        horizontalLineBottom.style.marginTop = "10px";
        horizontalLineBottom.style.marginBottom = "0";

        legendSection.appendChild(horizontalLineBottom);

        // Insert the legendSection before any existing content
        if (legendData.container) {
            legendData.container.insertBefore(legendSection, legendData.container.firstChild);
        } else {
            console.error("Legend container is not available.");
        }
    } catch (error) {
        console.error("Error updating legend:", error);
    }
}
export const updateLegendWithJunction = async (legendData) => {

    try {
        const legendContainer = document.createElement("div");
        legendContainer.style.marginLeft = "10px";
        legendContainer.style.paddingTop = "10px";
        legendContainer.style.paddingBottom = "10px"; // Padding at the bottom

        // Heading
        const heading = document.createElement("h3");
        heading.textContent = "Railway Junction / Station";
        heading.style.margin = "0";
        heading.style.fontWeight = "bold";
        heading.style.fontSize = "14px";
        heading.style.marginLeft = "6px";

        legendContainer.appendChild(heading);

        // Function to create a subheading with an image
        const createSubheading = (name, imageUrl) => {
            const rowContainer = document.createElement("div");
            rowContainer.style.display = "flex";
            rowContainer.style.alignItems = "center";
            rowContainer.style.marginBottom = "4px"; // Margin between rows
            rowContainer.style.marginTop = "10px"; // Margin between rows
            rowContainer.style.padding = "3px 0px 3px 9px"; // Padding for the row

            const image = document.createElement("img");
            image.src = imageUrl;
            image.alt = name;
            image.style.width = "39px"; // Adjust size as needed
            image.style.height = "23px"; // Adjust size as needed
            image.style.marginRight = "10px"; // Space between image and text
            image.style.padding = "0 5px"; // Padding inside the image

            const label = document.createElement("span");
            label.textContent = name;
            label.style.fontWeight = "400";

            rowContainer.appendChild(image);
            rowContainer.appendChild(label);

            return rowContainer;
        };

        // URLs for the PNG images
        const junctionImageUrl = "/cris_lrs/images/junction.png";
        const stationImageUrl = "/cris_lrs/images/station.png";

        // Subheadings with images
        const junctionSubheading = createSubheading("Junction", junctionImageUrl);
        const stationSubheading = createSubheading("Station", stationImageUrl);

        // Append subheadings to the container
        legendContainer.appendChild(junctionSubheading);
        legendContainer.appendChild(stationSubheading);

        // Add a horizontal line at the bottom of the container
        const horizontalLine = document.createElement("hr");
        horizontalLine.style.border = "0";
        horizontalLine.style.borderTop = "1px solid silver";
        horizontalLine.style.marginTop = "10px"; // Margin above the line
        horizontalLine.style.marginBottom = "0"; // No margin below the line

        legendContainer.appendChild(horizontalLine);

        // Insert the container into the legendData container
        if (legendData.container) {
            legendData.container.insertBefore(legendContainer, legendData.container.firstChild);
        } else {
            console.error("Legend container is not available.");
        }
    } catch (error) {
        console.error("Error updating legend with junction details:", error);
    }
};
export const addCircularBoundaries = async (featureLayer, view, zoomLevel, cQuery, bridgeQuery) => {
    try {

        const query = featureLayer.createQuery();
        const overstressedCondition = "overstressed = 'Yes'";
        // if (cQuery) {
        //     query.where = `${cQuery} AND ${overstressedCondition}`;
        // } else {
        //     query.where = overstressedCondition;
        // }
        // Check if overstressedCondition is already present in cQuery or bridgeQuery
        const isOverstressedInCQuery = cQuery && cQuery.includes(overstressedCondition);
        const isOverstressedInBridgeQuery = bridgeQuery && bridgeQuery.includes(overstressedCondition);

        let whereClause = "";

        // If cQuery exists and does not contain overstressedCondition, add it
        if (cQuery && !isOverstressedInCQuery) {
            whereClause = `${cQuery} AND ${overstressedCondition}`;
        } else if (cQuery) {
            whereClause = cQuery;
        }

        // If bridgeQuery exists and does not contain overstressedCondition, add it
        if (bridgeQuery && !isOverstressedInBridgeQuery) {
            if (whereClause) {
                whereClause = `${whereClause} AND ${bridgeQuery} AND ${overstressedCondition}`;
            } else {
                whereClause = `${bridgeQuery} AND ${overstressedCondition}`;
            }
        } else if (bridgeQuery) {
            if (whereClause) {
                whereClause = `${whereClause} AND ${bridgeQuery}`;
            } else {
                whereClause = bridgeQuery;
            }
        }

        // If neither query exists, default to just overstressedCondition
        if (!whereClause) {
            whereClause = overstressedCondition;
        }

        // Assign the final where clause
        query.where = whereClause;
        query.outFields = ["*"];
        query.returnGeometry = true;
        const bufferedGeometries = [];
        const result = await featureLayer.queryFeatures(query);
        if (result.features.length === 0) {
            if (view.graphics) {
                view.graphics.removeAll();
            }
            return;
        }
        const features = result.features.filter(f => f.geometry && f.geometry.extent);
        if (view.graphics) {
            view.graphics.removeAll();
        }
        features.forEach(feature => {
            const geometry = feature.geometry;
            if (geometry.type === "polyline") {
                let bufferDistance = Math.floor(zoomLevel * 0.005);
                const buffer = geometryEngine.geodesicBuffer(geometry, bufferDistance, "meters");
                bufferedGeometries.push(buffer);
                const graphic = new Graphic({
                    geometry: buffer,
                    symbol: {
                        type: "simple-fill",
                        color: "rgba(255, 0, 0, 0.2)", // Semi-transparent red fill
                        outline: {
                            color: "red", // Red outline
                            width: 2
                        }
                    }
                });
                view.graphics.add(graphic);
            } else {
                console.warn("Feature geometry is not a polyline:", geometry);
            }
        });
    } catch (error) {
        console.error("Error adding circular boundaries:", error);
    }
};
export const extractDateTime = (isoString) => {
    const dateObj = new Date(isoString);
    const date = dateObj.toISOString().split('T')[0];
    const time = dateObj.toISOString().split('T')[1].split('.')[0];
    return {
        date,
        time
    };
}
export const capitalizeFirstLetter = (str) => {
    if (!str) return ''; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};
export const generateDistinctHexColors = (numColors) => {
    const colors = [];
    const hueStep = 360 / numColors;
    for (let i = 0; i < numColors; i++) {
        const hue = i * hueStep;
        const saturation = 70 + (i % 2) * 10;
        const lightness = 50 + (i % 3) * 10;
        colors.push(hslToHex(hue, saturation, lightness));
    }
    return colors;
};
export const filterLayer = (id, view, field, value, setChartQuery) => {
    
    let bQueryString = "";
    let cQueryString = "";
    let railwayQueryString = "";
    let divisionQueryString = "";
    let sectionQueryString = "";
    let yearQueryString = "";
    let railSectionQueryString = "";
    let gradeOfSteelQueryString = "";
    let usfdQueryString = "";
    let slabWiseQueryString = "";
    let lifeSlabPercentQueryString = "";
    let sectionSpeedQueryString = "";
    let typeOfRouteQueryString = "";

    let storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
    let bQuery = storedQueryObject.filter(f => f.id === id)[0].query;
    let cQuery = storedQueryObject.filter(f => f.id === 16)[0].query;
    const baseLayer = view.map.allLayers.items[1];
    const stationLayer = view.map.allLayers.items[2];
    const featureLayer = view.map.allLayers.items[3];
    let nbmlFeatureLayer;
    if (id === 11) {
        nbmlFeatureLayer = view.map.allLayers.items[4];
    }
    if (!baseLayer || !stationLayer || !featureLayer) {
        console.log("One of the layers is not loaded yet.");
        return;
    }
    if (field !== 'year' && field !== "rail_section" && field !== "grade_of_steel" && field !== "usfd_classification" && field !== 'gmt' && field !== 'speed' && field !== 'life_slab_percent') {
        baseLayer.definitionExpression = `${field} = '${value}'`;
        stationLayer.when(() => {
            if (stationLayer.sublayers) {
                stationLayer.sublayers.forEach(sublayer => {
                    sublayer.definitionExpression = `${field} = '${value}'`;
                });
            }
        })
    }
    const annualSectionalGMT = [
        { label: "Below 20", value: "< 20" },
        { label: "20 to 40", value: ">= 20 AND gmt < 40" },
        { label: "40 to 60", value: ">= 40 AND gmt < 60" },
        { label: "60 to 80", value: ">= 60 AND gmt < 80" },
        { label: "Above 80", value: "> 80" },
    ];
    const sectionSpeed = [
        { label: "< 100", value: "< 100" },
        { label: "100-110", value: ">= 100 AND speed < 110" },
        { label: "110-130", value: ">= 110 AND speed < 130" },
        { label: "130-160", value: ">= 130 AND speed < 160" },
    ]
    const gmtDetailsSlabLife = [
        { label: ">=50 <60", value: ">= 50 AND life_slab_percent < 60" },
        { label: ">=60 <70", value: ">= 60 AND life_slab_percent < 70" },
        { label: ">=70 <80", value: ">= 70 AND life_slab_percent < 80" },
        { label: ">=80 <90", value: ">= 80 AND life_slab_percent < 90" },
        { label: ">=90 <100", value: ">= 90 AND life_slab_percent < 100" },
        { label: ">100", value: "> 100" },
    ]
    if (id === 2) {
        if (bQuery !== "") {
            bQueryString = `${field} = '${value}'`;
        }
        if (cQuery !== "") {
            cQueryString = `${field} = '${value}'`;
        }
        if (field === "railway") {
            railwayQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                zoneQuery: railwayQueryString
            }));
        }
        if (field === "division") {
            divisionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                divisionQuery: divisionQueryString
            }));
        }
        if (field === "rail_section") {
            railSectionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                railSectionQuery: railSectionQueryString
            }));
        }
        if (field === "grade_of_steel") {
            gradeOfSteelQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                gradeOfSteelQuery: gradeOfSteelQueryString
            }));
        }
        if (field === "type_of_route") {
            typeOfRouteQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                typeOfRouteQuery: usfdQueryString
            }));
        }
        let query = [bQueryString, cQueryString, railwayQueryString, divisionQueryString, railSectionQueryString, gradeOfSteelQueryString, typeOfRouteQueryString].filter(Boolean).join(" AND ");
        featureLayer.definitionExpression += ` AND ${query}`;
    }
    if (id === 3) {
        if (bQuery !== "") {
            bQueryString = `${field} = '${value}'`;
        }
        if (cQuery !== "") {
            cQueryString = `${field} = '${value}'`;
        }
        if (field === "railway") {
            railwayQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                zoneQuery: railwayQueryString
            }));
        }
        if (field === "division") {
            divisionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                divisionQuery: divisionQueryString
            }));
        }
        if (field === "rail_section") {
            railSectionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                railSectionQuery: railSectionQueryString
            }));
        }
        if (field === "grade_of_steel") {
            gradeOfSteelQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                gradeOfSteelQuery: gradeOfSteelQueryString
            }));
        }
        if (gmtDetailsSlabLife.some(gds => gds.label === value)) {
            let gmtLifeSlab = gmtDetailsSlabLife.filter(f => f.label === value)[0].value;
            if (field === "grade_of_steel") {
                lifeSlabPercentQueryString = `${field}  ${gmtLifeSlab}`;
                setChartQuery(prevState => ({
                    ...prevState,
                    lifeSlabPercentQuery: lifeSlabPercentQueryString
                }));
            }
            let query = [bQueryString, cQueryString, railwayQueryString, divisionQueryString, railSectionQueryString, gradeOfSteelQueryString, lifeSlabPercentQueryString].filter(Boolean).join(" AND ");
            featureLayer.definitionExpression += ` AND ${query}`;
        } else {
            let query = [bQueryString, cQueryString, railwayQueryString, divisionQueryString, railSectionQueryString, gradeOfSteelQueryString].filter(Boolean).join(" AND ");
            featureLayer.definitionExpression += ` AND ${query}`;
        }
    }
    if (id === 4) {
        if (bQuery !== "") {
            bQueryString = `${field} = '${value}'`;
        }
        if (cQuery !== "") {
            cQueryString = `${field} = '${value}'`;
        }
        if (field === "railway") {
            railwayQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                zoneQuery: railwayQueryString
            }));
        }
        if (field === "division") {
            divisionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                divisionQuery: divisionQueryString
            }));
        }
        if (field === "year") {
            yearQueryString = `${field} = ${value}`;
            setChartQuery(prevState => ({
                ...prevState,
                yearQuery: yearQueryString
            }));
        }
        if (field === "rail_section") {
            railSectionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                railSectionQuery: railSectionQueryString
            }));
        }
        if (field === "grade_of_steel") {
            gradeOfSteelQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                gradeOfSteelQuery: gradeOfSteelQueryString
            }));
        }
        if (field === "usfd_classification") {
            usfdQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                usfdQuery: usfdQueryString
            }));
        }
        let query = [bQueryString, cQueryString, railwayQueryString, divisionQueryString, yearQueryString, railSectionQueryString, gradeOfSteelQueryString, usfdQueryString].filter(Boolean).join(" AND ");
        featureLayer.definitionExpression += ` AND ${query}`;


    }
    if (id === 6) {
        if (bQuery !== "") {
            bQueryString = `${field} = '${value}'`;
        }
        if (cQuery !== "") {
            cQueryString = `${field} = '${value}'`;
        }
        if (field === "railway") {
            railwayQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                zoneQuery: railwayQueryString
            }));
        }
        if (field === "division") {
            divisionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                divisionQuery: divisionQueryString
            }));
        }
        if (field === "year") {
            yearQueryString = `${field} = ${value}`;
            setChartQuery(prevState => ({
                ...prevState,
                yearQuery: yearQueryString
            }));
        }
        if (field === "rail_section") {
            railSectionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                railSectionQuery: railSectionQueryString
            }));
        }
        if (field === "grade_of_steel") {
            gradeOfSteelQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                gradeOfSteelQuery: gradeOfSteelQueryString
            }));
        }
        if (field === "usfd_classification") {
            usfdQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                usfdQuery: usfdQueryString
            }));
        }
        let query = [bQueryString, cQueryString, railwayQueryString, divisionQueryString, yearQueryString, railSectionQueryString, gradeOfSteelQueryString, usfdQueryString].filter(Boolean).join(" AND ");
        featureLayer.definitionExpression += ` AND ${query}`;
    }
    if (id === 8) {
        if (bQuery !== "") {
            bQueryString = `${field} = '${value}'`;
        }
        if (cQuery !== "") {
            cQueryString = `${field} = '${value}'`;
        }
        if (field === "railway") {
            railwayQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                zoneQuery: railwayQueryString
            }));
        }
        if (field === "division") {
            divisionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                divisionQuery: divisionQueryString
            }));
        }
        if (annualSectionalGMT.some(asg => asg.label === value)) {
            let filteredgmtslab = annualSectionalGMT.filter(f => f.label === value)[0].value;

            if (field === "gmt") {
                slabWiseQueryString = `${field}  ${filteredgmtslab}`;
                setChartQuery(prevState => ({
                    ...prevState,
                    slabQuery: slabWiseQueryString
                }));
            }
            let query = [bQueryString, cQueryString, railwayQueryString, divisionQueryString, slabWiseQueryString].filter(Boolean).join(" AND ");
            featureLayer.definitionExpression += ` AND ${query}`;
        } else {
            let query = [bQueryString, cQueryString, railwayQueryString, divisionQueryString].filter(Boolean).join(" AND ");
            featureLayer.definitionExpression += ` AND ${query}`;
        }
    }
    if (id === 9) {
        if (bQuery !== "") {
            bQueryString = `${field} = '${value}'`;
        }
        if (cQuery !== "") {
            cQueryString = `${field} = '${value}'`;
        }
        if (field === "railway") {
            railwayQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                zoneQuery: railwayQueryString
            }));
        }
        if (field === "division") {
            divisionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                divisionQuery: divisionQueryString
            }));
        }
        if (sectionSpeed.some(ss => ss.label === value)) {
            let filteredspeed = sectionSpeed.filter(f => f.label === value)[0].value;
            if (field === "speed") {
                sectionSpeedQueryString = `${field}  ${filteredspeed}`;
                setChartQuery(prevState => ({
                    ...prevState,
                    sectionSpeedQuery: sectionSpeedQueryString
                }));
            }
            let query = [bQueryString, cQueryString, railwayQueryString, divisionQueryString, sectionSpeedQueryString].filter(Boolean).join(" AND ");
            featureLayer.definitionExpression += ` AND ${query}`;
        } else {
            let query = [bQueryString, cQueryString, railwayQueryString, divisionQueryString].filter(Boolean).join(" AND ");
            featureLayer.definitionExpression += ` AND ${query}`;
        }
    }
    if (id === 11) {
        if (bQuery !== "") {
            bQueryString = `${field} = '${value}'`;
        }
        if (cQuery !== "") {
            cQueryString = `${field} = '${value}'`;
        }
        if (field === "railway") {
            railwayQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                zoneQuery: railwayQueryString,
            }));
        }
        if (field === "division") {
            divisionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                divisionQuery: divisionQueryString,
            }));
        }
        if (field === "section") {
            sectionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                sectionQuery: sectionQueryString,
            }));
        }
        let query = [bQueryString, cQueryString, railwayQueryString, divisionQueryString, sectionQueryString].filter(Boolean).join(" AND ");
        featureLayer.definitionExpression += ` AND ${query}`;
        nbmlFeatureLayer.definitionExpression += ` AND ${query}`;
    }
    if (id === 12) {
        if (bQuery !== "") {
            bQueryString = `${field} = '${value}'`;
        }
        if (cQuery !== "") {
            cQueryString = `${field} = '${value}'`;
        }
        if (field === "railway") {
            railwayQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                zoneQuery: railwayQueryString,
            }));
        }
        if (field === "division") {
            divisionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                divisionQuery: divisionQueryString,
            }));
        }
        if (field === "section") {
            sectionQueryString = `${field} = '${value}'`;
            setChartQuery(prevState => ({
                ...prevState,
                sectionQuery: sectionQueryString,
            }));
        }
        let query = [bQueryString, cQueryString, railwayQueryString, divisionQueryString, sectionQueryString].filter(Boolean).join(" AND ");
        featureLayer.definitionExpression += ` AND ${query}`;
    }
    if (id === 11) {
        nbmlFeatureLayer.queryExtent().then((response) => {
            view.goTo(response.extent);
        });
    } else {
        featureLayer.queryExtent().then((response) => {
            view.goTo(response.extent);
        });
    }
};
export const showAllFeatures = (id, view, cQuery, bQuery, lastThreeyears, setChartQuery) => {
    let storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
    const baseLayer = view.map.allLayers.items[1];
    const stationLayer = view.map.allLayers.items[2];
    const featureLayer = view.map.allLayers.items[3];
    let nbmlFeatureLayer;
    if (id === 11) {
        nbmlFeatureLayer = view.map.allLayers.items[4];
    }
    let query = "";
    if (lastThreeyears !== undefined && lastThreeyears !== null && lastThreeyears.length > 0) {
        query = `year in (${lastThreeyears.join(",")})`;
    }
    if (cQuery && query === "") {
        query += `${cQuery}`;
    } else if (cQuery) {
        query += ` AND ${cQuery}`;
    }
    if (bQuery && query === "") {
        query += `${bQuery}`;
    } else if (bQuery) {
        query += ` AND ${bQuery}`;
    }
    if (baseLayer) {
        let queryforBaseLayer = "";
        if (cQuery) {
            queryforBaseLayer = cQuery;
        }
        baseLayer.definitionExpression = queryforBaseLayer !== "" ? queryforBaseLayer : `1=1`;
    }

    if (stationLayer) {
        let queryforStationLayer = "";
        if (cQuery) {
            queryforStationLayer = cQuery;
        }
        stationLayer.when(() => {
            if (stationLayer.sublayers) {
                stationLayer.sublayers.forEach(sublayer => {
                    sublayer.definitionExpression = queryforStationLayer !== "" ? queryforStationLayer : `1=1`;
                });
            }
        });
    }

    if (id === 11) {
        nbmlFeatureLayer.definitionExpression = query === "" ? "1=1" : query;
    }
    featureLayer.definitionExpression = query === "" ? "1=1" : query;
    let idArray = [2, 3, 4, 6, 8, 9, 11, 12];
    if (storedQueryObject) {
        const updatedQueryObject = storedQueryObject.map(item =>
            idArray.includes(item.id) ? { ...item, chartQuery: "" } : item
        );
        sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
    }
    setChartQuery("");
    if (id === 11) {
        nbmlFeatureLayer.queryExtent().then((response) => {
            view.goTo(response.extent);
        });
    } else {
        featureLayer.queryExtent().then((response) => {
            view.goTo(response.extent);
        });
    }
};