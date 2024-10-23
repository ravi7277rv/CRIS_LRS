import { deffinitionExpression } from '../../Templates/Template';
import { loadModules } from 'esri-loader';
const [
    geometry, SpatialReference, Graphic, geometryEngine] = await loadModules(["esri/geometry", "esri/geometry/SpatialReference", "esri/Graphic", "esri/geometry/geometryEngine"], { css: true });

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
export const queryAndDisplayFeatures = async (id,layer, finalQuery, view, toast, stopLoaderForQueryBuilder) => {
    
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
            if(stopLoaderForQueryBuilder){
                stopLoaderForQueryBuilder(id)
            }
        } else {
            if (toast) {
                toast("No Features Found");
            }
        }
    } catch (error) {
        console.log(`Error while querying features: ${error}`);
    }
};
export const queryFeatureCounts = async (featureLayer, minValue, maxValue, field, lr_rr, screenQuery, year, customQuery, id, yearsArray) => {
    
    const query = featureLayer.createQuery();
    // query.where = deffinitionExpression;

    if (field) {
        if (typeof minValue === "string") {
            query.where += ` AND (${field} = '${minValue}')`;
        } if (typeof minValue !== "string" && minValue === maxValue) {
            query.where += ` AND (${field} = ${minValue})`;
        } else if (typeof minValue !== "string") {
            query.where += ` AND (${field} >= ${minValue} AND ${field} < ${maxValue})`;
        }
    }
    console.log(` AND (${field} >= ${minValue} AND ${field} < ${maxValue})`)
    if (screenQuery && screenQuery.trim()) {
        query.where += ` AND (${screenQuery})`;
    }
    if (customQuery && customQuery.trim()) {
        query.where += ` AND (${customQuery})`
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
        const y = yearsArray.filter(y => y == year)
        const _query = featureLayer.createQuery();
        _query.where = `${query.where} AND year = ${y}`;
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
            console.log(`final query: ${query.where}`);
            console.log(`this is featurelayer in asset count`, featureLayer);
            console.log("id is : ", id)
            if (id === 2 || id === 3 || id === 7 || id === 8 || id === 9 || id === 10) {
                console.log("%c,'background:red',inside the idArra")
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
                console.log("%c,'background:red',lenght on the baias of ", track_length);
                console.log(`Feature count`, result.features);
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
export const addCircularBoundaries = async (featureLayer, view, zoomLevel) => {
    try {
        const query = featureLayer.createQuery();
        query.where = "overstressed = 'Yes'";
        query.outFields = ["*"];
        query.returnGeometry = true;

        const bufferedGeometries = [];
        const result = await featureLayer.queryFeatures(query);
        const features = result.features.filter(f => f.geometry && f.geometry.extent);
        if (view.graphics) {
            view.graphics.removeAll();
        }
        features.forEach(feature => {
            const geometry = feature.geometry;
            if (geometry.type === "polyline") {
                let bufferDistance = Math.floor(zoomLevel * 0.005)
                const buffer = geometryEngine.geodesicBuffer(geometry, bufferDistance, "meters");
                bufferedGeometries.push(buffer);
                const graphic = new Graphic({
                    geometry: buffer,
                    symbol: {
                        type: "simple-fill",
                        color: "rgba(255, 0, 0, 0.2)",
                        outline: {
                            color: "red",
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