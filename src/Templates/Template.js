import { loadModules } from 'esri-loader';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { expandFlag } from '../Components/SplitScreen/SplitScreen';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { bridgeOrmClassBreaksRenderer, bridgeWaterLevelClassBreaksRenderer, gmtClassBreaksRenderer, levelCrossingRenderer, monsoonReservesClassBreaksRenderer, omsPeakRenderer, permanentSpeedRestrictionsClassBreaksRenderer, railFractureRenderer, railSectionClassBreaksRenderer, SectionalGmtClassBreaksRenderer, SectionalSpeedClassBreaksRenderer, specialRouteClassBreaksRenderer, trackQualityClassBreaksRenderer, umlOnTRCSimpleRenderer, weldFractureReportRenderer } from './Renderer';
import { bridgeORN_1or2_PopUpTemplate, GMTPopupTemplate, levelCrossingPopUpTemplate, monsoonReservesPopUpTemplate, omsPeaks15PopUpTemplate, omsPeaksPopUpTemplate, permanentSpeedRestrictionsPopUpTemplate, railFracturePopUpTemplate, railSectionPopUpTemplate, sectionalGmtPopUpTemplate, sectionalSpeedPopUpTemplate, specialRoutePopUpTemplate, trackQualityPopUPTemplate, umlLocationPopUpTemplate, weldFractureReportPopUpTemplate } from './PopUpTemplate';
import { screenRelatedFields } from './TableFields';
import globalUrlConfig from '../BaseUrlConfig';
const [
    Extent, reactiveUtils, FeatureTable, LabelClass,webMercatorUtils] = await loadModules(["esri/geometry/Extent", "esri/core/reactiveUtils", "esri/widgets/FeatureTable", "esri/layers/support/LabelClass","esri/geometry/support/webMercatorUtils"], { css: true });
export let featureTables = {};
Chart.register(annotationPlugin)
export let deffinitionExpression = "loc_error <> 'ROUTE NOT FOUND'";
export let monsoonQuery = "loc_error <> 'ROUTE NOT FOUND' AND qty_available <> 0"
export let featureTable;
export let selectedFeatureId = undefined;
export let bridgeWaterLevelPopUptemplate = {
    title: 'Bridge Water Level',
    content: createPopupContent
};
let matchingFeature
function createPopupContent() {
    const contentElement = document.createElement('div');
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped');
    matchingFeature = featureValue.find(f => f.attributes.objectid === selectedFeatureId);
    table.innerHTML = `
    <tr><td>Asset ID </td><td class='popup-cell'>${matchingFeature ? matchingFeature.attributes.objectid : ""}</td></tr>
    <tr><td>Railway </td><td class='popup-cell'>${matchingFeature ? matchingFeature.attributes.railway : ""}</td></tr>
    <tr><td>Division </td><td class='popup-cell'>${matchingFeature ? matchingFeature.attributes.division : ""}</td></tr>
    <tr><td>Section/Station </td><td class='popup-cell'>${matchingFeature ? matchingFeature.attributes.section_station : ""}</td></tr>
    <tr><td>Location</td><td class='popup-cell'>${matchingFeature ? matchingFeature.attributes.from_km : ""}Km ${matchingFeature ? matchingFeature.attributes.from_met : ""}m - ${matchingFeature ? matchingFeature.attributes.to_km : ""}Km ${matchingFeature ? matchingFeature.attributes.to_met : ""}m</td></tr>
    <tr><td>Bridge No.</td><td class='popup-cell'>${matchingFeature ? matchingFeature.attributes.bridgeno : ""}</td></tr>
    <tr><td>Category</td><td class='popup-cell'>${matchingFeature ? matchingFeature.attributes.category : ""}</td></tr>
    <tr><td>Structure Type </td><td class='popup-cell'>${matchingFeature ? matchingFeature.attributes.structure_type : ""}</td></tr>
    <tr><td>Span Configuration </td><td class='popup-cell'>${matchingFeature ? matchingFeature.attributes.span_configuration : ""}</td></tr>
    <tr><td>Type of Foundation </td><td class='popup-cell'>${matchingFeature ? matchingFeature.attributes.type_of_foundation : ""}</td></tr>
    <tr><td>Name of River </td><td class='popup-cell'>${matchingFeature ? matchingFeature.attributes.river : ""}</td></tr>
    <tr><td>HFL </td><td class='popup-cell'>${matchingFeature ? matchingFeature.attributes.hfl : ""}</td></tr>
    <tr><td>Danger Level </td><td class='popup-cell'>${matchingFeature ? matchingFeature.attributes.dl : ""}</td></tr>
    </table>`;
    contentElement.appendChild(table);

    const heading = document.createElement('h6');
    heading.textContent = 'Water Level in last 7 days Including Current Day';
    heading.style.fontSize = '16px';
    heading.style.fontWeight = '500';
    heading.style.display = 'flex';
    heading.style.justifyContent = 'center';
    contentElement.appendChild(heading);

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 150;
    contentElement.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const zoomInOut = document.createElement('div')
    zoomInOut.style.display = 'flex';
    zoomInOut.style.flexDirection = 'row';
    zoomInOut.style.gap = '2px';
    zoomInOut.style.marginLeft = '1rem';
    contentElement.appendChild(zoomInOut);

    const zoomIn = document.createElement('button');
    zoomIn.id = 'zoom-in';
    zoomIn.style.width = '20px';
    zoomIn.style.height = '20px';
    zoomIn.textContent = '+';
    zoomIn.style.fontSize = '15px';
    zoomIn.style.display = 'flex';
    zoomIn.style.justifyContent = 'center';
    zoomIn.style.alignItems = 'center';
    zoomIn.style.border = '1px solid black';
    zoomIn.style.tooltip = 'Zoom In';
    zoomIn.style.tooltipPosition = 'above';

    zoomIn.onclick = () => ZoomInFun();
    zoomInOut.appendChild(zoomIn);

    const zoomOut = document.createElement('button');
    zoomOut.id = 'zoom-out';
    zoomOut.style.width = '20px';
    zoomOut.style.height = '20px';
    zoomOut.textContent = '—';
    zoomOut.style.fontSize = '15px';
    zoomOut.style.display = 'flex';
    zoomOut.style.justifyContent = 'center';
    zoomOut.style.alignItems = 'center';
    zoomOut.style.border = '1px solid black';
    zoomOut.style.tooltip = 'Zoom Out';
    zoomOut.onclick = () => ZoomOutFun();
    zoomInOut.appendChild(zoomOut);

    let zoomVariable = false

    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    tooltip.id = 'custom-tooltip';

    contentElement.appendChild(tooltip);
    const ZoomInFun = () => {
        const currentMin = dangerLevel - 1;
        const currentMax = dangerLevel + 1;
        const zoomFactor = 0.8;

        const newMin = currentMin + (currentMax - currentMin) * (1 - zoomFactor);
        const newMax = currentMax - (currentMax - currentMin) * (1 - zoomFactor);

        chart.options.scales.y.min = newMin;
        chart.options.scales.y.max = newMax;

        chart.update();
        zoomVariable = true


    }

    const ZoomOutFun = () => {
        if (zoomVariable === true) {
            const currentMin = 14;
            const currentMax = 86;
            const zoomFactor = 1.2;

            const newMin = currentMin - (currentMax - currentMin) * (zoomFactor - 1);
            const newMax = currentMax + (currentMax - currentMin) * (zoomFactor - 1);

            chart.options.scales.y.min = Math.round(newMin);
            chart.options.scales.y.max = Math.round(newMax);

            chart.update();


        }
    }


    const currentDate = new Date();

    const fetchLast7Days = () => {
        let last7Days = [];
        for (let i = 0; i < 7; i++) {
            let date = new Date();
            date.setDate(currentDate.getDate() - i);

            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const formattedDate = `${day}-${month}`;

            last7Days.push(formattedDate);
        }
        return last7Days;
    }

    const last7Days = fetchLast7Days();

    const dangerLevel = matchingFeature.attributes.dl;
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [last7Days[6], last7Days[5], last7Days[4], last7Days[3], last7Days[2], last7Days[1], last7Days[0]],
            datasets: [{
                label: 'Water Level',
                data: [
                    matchingFeature.attributes.wl7,
                    matchingFeature.attributes.wl6,
                    matchingFeature.attributes.wl5,
                    matchingFeature.attributes.wl4,
                    matchingFeature.attributes.wl3,
                    matchingFeature.attributes.wl2,
                    matchingFeature.attributes.wl1,
                ],
                backgroundColor: function (context) {
                    let value = context.dataset.data[context.dataIndex];
                    return value > dangerLevel ? 'rgb(255, 0, 0)' : 'rgba(54, 162, 235, 1)';
                },
                borderColor: function (context) {
                    let value = context.dataset.data[context.dataIndex];
                    return value > dangerLevel ? 'rgb(255, 0, 0)' : 'rgba(54, 162, 235, 1)';
                },
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Water Level ⟶'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date ⟶'
                    }
                }
            },

            plugins: {
                legend: {
                    display: false
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: dangerLevel,
                            yMax: dangerLevel,
                            borderColor: 'red',
                            borderWidth: 2,
                            label: {
                                content: 'Danger Level',
                                enabled: true,
                                position: 'end'
                            },
                            enter: function (context, event) {
                                const x = event.native.layerX;
                                const y = event.native.layerY;
                                tooltip.innerHTML = 'Danger Level: ' + dangerLevel;
                                tooltip.style.left = x + 'px';
                                tooltip.style.top = y - 30 + 'px';
                                tooltip.style.display = 'block';
                            },
                            leave: function () {
                                tooltip.style.display = 'none';
                            }
                        },
                        line2: {
                            type: 'line',
                            yMin: dangerLevel - 0.5,
                            yMax: dangerLevel - 0.5,
                            borderColor: 'yellow',
                            borderWidth: 2,
                            label: {
                                content: 'Approaching Danger Level',
                                enabled: true,
                                position: 'end'
                            },
                            enter: function (context, event) {
                                const x = event.native.layerX;
                                const y = event.native.layerY;
                                tooltip.innerHTML = 'Approaching Danger Level: ' + (dangerLevel - 0.5);
                                tooltip.style.left = x + 'px';
                                tooltip.style.top = y - 30 + 'px';
                                tooltip.style.display = 'block';
                                tooltip.style.transition = 'ease-in-out 1s'
                            },
                            leave: function () {
                                tooltip.style.display = 'none';
                            }
                        }
                    }
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: false,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'y',
                    }
                }
            }
        }
    });
    const legendContainer = document.createElement('div');
    legendContainer.style.display = 'flex';
    legendContainer.style.justifyContent = 'center';
    legendContainer.style.marginTop = '10px';

    const legendBox = document.createElement('div');
    legendBox.style.width = '36px';
    legendBox.style.height = '20px';
    legendBox.style.backgroundColor = 'rgba(54, 162, 235, 1)';
    legendBox.style.marginRight = '10px';

    const legendLabel = document.createElement('span');
    legendLabel.textContent = 'Water level';
    legendLabel.style.fontSize = '14px';
    legendContainer.appendChild(legendBox);
    legendContainer.appendChild(legendLabel);
    contentElement.appendChild(legendContainer);

    return contentElement;
}
export let featureValue;
export const exportFeatureTableToCSV = async (featureTable, fields) => {
    try {
        const columns = fields.map(field => field);
        let csvContent = columns.join(",") + "\n";

        const queryResponse = await featureTable.layer.queryFeatures();
        const features = queryResponse.features;
        featureValue = features;
        let filteredFeatures;
        if (features[0].geometry.type === "point") {
            filteredFeatures = features.filter(f => f.geometry.latitude !== 0 && f.geometry.longitude !== 0);
        } else {
            filteredFeatures = features.filter(f => f.geometry.extent !== null);
        }
        filteredFeatures.forEach((feature) => {
            let row = columns.map(col => {
                let cellValue = feature.attributes[col];

                // Check if the cell value contains commas, double quotes, or newlines
                if (/[,"]/.test(cellValue)) {
                    // If yes, enclose the cell value in double quotes and escape existing double quotes
                    cellValue = `"${cellValue.replace(/"/g, '""')}"`;
                }
                return cellValue;
            }).join(",");

            csvContent += row + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${featureTable.layer.title}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error exporting feature table to CSV:', error);
    }
};
export const exportFeatureTable = async (featureTable, fields) => {

    try {
        const columns = fields.map(field => field);
        let csvContent = columns.join(",") + "\n";

        const queryResponse = await featureTable.layer.queryFeatures();
        const features = queryResponse.features;
        featureValue = features;
        let filteredFeatures;
        if (features[0].geometry.type === "point") {
            filteredFeatures = features.filter(f => f.geometry.latitude !== 0 && f.geometry.longitude !== 0);
        } else {
            filteredFeatures = features.filter(f => f.geometry.extent !== null);
        }
        filteredFeatures.forEach((feature) => {
            let row = columns.map(col => {
                let cellValue = feature.attributes[col];

                // Check if the cell value contains commas, double quotes, or newlines
                if (/[,"]/.test(cellValue)) {
                    // If yes, enclose the cell value in double quotes and escape existing double quotes
                    cellValue = `"${cellValue.replace(/"/g, '""')}"`;
                }
                return cellValue;
            }).join(",");

            csvContent += row + "\n";
        });


    } catch (error) {
        console.error('Error exporting feature table to CSV:', error);
    }
};
// export const createFeatureTable = async (id, view, layer) => {
//     let scFields = screenRelatedFields.filter((srf) => srf.id === id);
//     let fields = scFields[0].fields.map(f => f.value);
//     if (!featureTables[id]) {
//         let fieldConfigs = [];
//         if (id > 0) {
//             fieldConfigs = fields.map(field => ({ name: field }));
//         } else {
//             fieldConfigs = fields.map(field => ({ name: field }));
//         }

//         const originalExtent = view.extent.clone();

//         featureTable = new FeatureTable({
//             view: view,
//             layer: layer,
//             visibleElements: {
//                 menuItems: {
//                     clearSelection: true,
//                     refreshData: false,
//                     toggleColumns: true,
//                     selectedRecordsShowAllToggle: true,
//                     selectedRecordsShowSelectedToggle: true,
//                     zoomToSelection: true
//                 }
//             },

//             container: document.getElementById(`tableDiv-${id}`),
//             fieldConfigs: fieldConfigs
//         });

//         featureTables[id] = featureTable;

//         reactiveUtils.when(
//             () => view.stationary,
//             () => {
//                 featureTable.filterGeometry = view.extent;
//             },
//             { initial: true }
//         );

//         let selectedFeatureIds = [];

//         featureTable.on('selection-change', (event) => {
//             featureTable.filterGeometry = view.extent;
//             if (expandFlag == true) {
//                 if (event.added.length > 0) {
//                     event.added.forEach((selectedFeature) => {
//                         const objectId = selectedFeature.objectId;
//                         if (!selectedFeatureIds.includes(objectId)) {
//                             selectedFeatureIds.push(objectId);
//                         }
//                     });
//                 } else if (event.removed.length > 0 && event.added.length === 0) {
//                     event.removed.forEach((removedFeature) => {
//                         const objectId = removedFeature.objectId;
//                         selectedFeatureIds = selectedFeatureIds.filter(id => id !== objectId);
//                     });

//                 }
//             }
//             else if (expandFlag == false) {
//                 if (event.added.length > 0) {
//                     if (selectedFeatureId === undefined) {
//                         selectedFeatureId = event.added[0].objectId;
//                     } else if (selectedFeatureId === event.added[0].objectId) {
//                         selectedFeatureId = undefined;
//                     } else {
//                         selectedFeatureId = event.added[0].objectId;
//                     }
//                 }
//             }
//         });

//         function clearSelection() {
//             selectedFeatureIds = []
//             featureTable.clearSelection();
//             view.goTo(originalExtent);
//             selectedContainer.style.display = 'none'
//         }

//         async function updateViewToSelectedFeatures() {
//             let query = layer.createQuery();
//             if (selectedFeatureIds && selectedFeatureIds.length > 0) {
//                 query.objectIds = selectedFeatureIds;

//                 let result = await layer.queryFeatures(query);
//                 if (result.features.length > 0) {
//                     const geometries = result.features.map(feature => feature.geometry);
//                     const extent = geometries.reduce((acc, geometry) => {
//                         if (geometry.type === "point") {
//                             const pointExtent = new Extent({
//                                 xmin: geometry.x - 0.0001,
//                                 ymin: geometry.y - 0.0001,
//                                 xmax: geometry.x + 0.0001,
//                                 ymax: geometry.y + 0.0001,
//                                 spatialReference: geometry.spatialReference
//                             });
//                             if (!acc) {
//                                 acc = pointExtent;
//                             } else {
//                                 acc = acc.union(pointExtent);
//                             }
//                         } else if (geometry.type === "polyline" || geometry.type === "polygon") {
//                             if (!acc) {
//                                 acc = geometry.extent;
//                             } else {
//                                 acc = acc.union(geometry.extent);
//                             }
//                         }
//                         return acc;
//                     }, null);

//                     if (extent) {
//                         view.goTo(extent.expand(1.2));
//                     }
//                 } else {
//                     toast("No Features Selected in Table");
//                 }
//             } else {
//                 toast("No Features Selected in Table");
//             }
//         }

//         view.on("immediate-click", async (event) => {
//             const response = await view.hitTest(event);
//             const candidate = response.results.find((result) => {
//                 return result.graphic && result.graphic.layer && result.graphic.layer === layer;
//             });
//             if (candidate) {
//                 const objectId = candidate.graphic.getObjectId();
//                 if (featureTable.highlightIds.includes(objectId)) {
//                     featureTable.highlightIds.remove(objectId);
//                 } else {
//                     featureTable.highlightIds.add(objectId);
//                 }
//             }
//         });

//         reactiveUtils.watch(

//             () => featureTable.highlightIds.length,
//             (highlightIdsCount) => {
//                 featureTable.viewModel.activeFilters.forEach((filter) => {
//                     if (filter.type === "selection") {
//                         const selectionIdCount = filter.objectIds.length;
//                         if (selectionIdCount !== highlightIdsCount) {
//                             featureTable.filterBySelection();
//                         }
//                     }
//                 });
//             }
//         );


//         const container = document.getElementById(`layerContainer-${id}`);
//         container.style.display = 'block';

//         // Create the dropdown container
//         const dropdownContainer = document.createElement('div');
//         dropdownContainer.className = 'dropdownContainer';
//         dropdownContainer.style.position = 'absolute';
//         dropdownContainer.style.top = '8px';
//         dropdownContainer.style.right = '6%';
//         dropdownContainer.style.Width = '50% !important';
//         dropdownContainer.style.Height = '20px';
//         dropdownContainer.style.display = 'inline-block';

//         container.appendChild(dropdownContainer);

//         // Create the dropdown button
//         const dropdownButton = document.createElement('button');
//         dropdownButton.textContent = 'Actions';
//         dropdownButton.className = 'dropdown-btn';
//         dropdownButton.style.borderRadius = '5px';
//         dropdownButton.style.padding = '2px 6px';
//         dropdownButton.style.fontSize = '13px';
//         dropdownButton.style.border = '1px solid #c1bebe';
//         dropdownButton.style.backgroundColor = '#fff';
//         dropdownButton.style.zIndex = '1000';
//         dropdownButton.style.cursor = 'pointer';

//         // Toggle dropdown on button click
//         dropdownButton.onclick = () => {
//             dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
//         };

//         dropdownContainer.appendChild(dropdownButton);

//         // Create the dropdown content
//         const dropdownContent = document.createElement('div');
//         dropdownContent.className = 'dropdown-content';
//         dropdownContent.style.display = 'none';
//         dropdownContent.style.position = 'absolute';
//         dropdownContent.style.backgroundColor = '#f9f9f9';
//         dropdownContent.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
//         dropdownContent.style.zIndex = '1000';
//         dropdownContent.style.minWidth = '125px';
//         dropdownContent.style.border = '1px solid #c1bebe';
//         dropdownContent.style.borderRadius = '5px';
//         dropdownContent.style.right = '0'

//         // Style for buttons inside dropdown
//         const dropdownButtonStyle = (button) => {
//             button.style.display = 'block';
//             button.style.width = '100%';
//             button.style.padding = '10px';
//             button.style.textAlign = 'left';
//             button.style.border = 'none';
//             button.style.borderBottom = '1px solid #c1bebe';
//             button.style.backgroundColor = '#fff';
//             button.style.cursor = 'pointer';
//             button.style.fontSize = '13px';
//             button.style.borderRadius = '0';
//             button.style.fontWeight = '400';
//         };

//         // Create and append the buttons inside the dropdown content
//         const exportButton = document.createElement('button');
//         exportButton.textContent = 'Export Data';
//         exportButton.className = 'export_table_data';
//         exportButton.onclick = () => exportFeatureTableToCSV(featureTable, fields);
//         dropdownButtonStyle(exportButton);
//         dropdownContent.appendChild(exportButton);

//         const zoomButton = document.createElement('button');
//         zoomButton.textContent = 'Zoom In';
//         zoomButton.className = 'zoomIn-class';
//         zoomButton.onclick = () => updateViewToSelectedFeatures();
//         dropdownButtonStyle(zoomButton);
//         dropdownContent.appendChild(zoomButton);

//         const clearSelectButton = document.createElement('button');
//         clearSelectButton.textContent = 'Clear Selection';
//         clearSelectButton.className = 'clearSelection-class';
//         clearSelectButton.onclick = () => clearSelection();
//         dropdownButtonStyle(clearSelectButton);
//         dropdownContent.appendChild(clearSelectButton);

//         const showAllButton = document.createElement('button');
//         showAllButton.textContent = 'All Features';
//         showAllButton.className = 'showAll-class';
//         dropdownButtonStyle(showAllButton);
//         dropdownContent.appendChild(showAllButton);

//         const showSelectedButton = document.createElement('button');
//         showSelectedButton.textContent = 'Selected Features';
//         showSelectedButton.className = 'showSelected-class';
//         showSelectedButton.onclick = () => {
//             if (selectedFeatureIds.length > 0) {
//                 const query = layer.createQuery();
//                 query.objectIds = selectedFeatureIds;
//                 layer.queryFeatures(query).then((result) => {
//                     selectedContainer.innerHTML = '';
//                     const table = document.createElement('table');
//                     table.style.width = '100%';
//                     table.style.borderCollapse = 'collapse';
//                     table.style.tableLayout = 'fixed';

//                     const thead = document.createElement('thead');
//                     thead.style.position = 'sticky';
//                     thead.style.top = '0';
//                     thead.style.backgroundColor = '#fff';
//                     thead.style.zIndex = '1';

//                     const headerRow = document.createElement('tr');
//                     fields.forEach(field => {
//                         const th = document.createElement('th');
//                         th.style.border = '1px solid #c1bebe';
//                         th.style.padding = '8px';
//                         th.style.backgroundColor = '#f2f2f2';
//                         th.style.fontWeight = '400';
//                         th.style.fontSize = '14px';
//                         th.style.whiteSpace = 'nowrap';
//                         th.style.overflow = 'hidden';

//                         th.textContent = field;
//                         headerRow.appendChild(th);
//                     });
//                     thead.appendChild(headerRow);
//                     table.appendChild(thead);

//                     const tbodyWrapper = document.createElement('div');
//                     tbodyWrapper.style.height = '236px';
//                     tbodyWrapper.style.overflow = 'auto';
//                     tbodyWrapper.style.width = '100%';

//                     const tbody = document.createElement('tbody');
//                     result.features.forEach(feature => {
//                         const row = document.createElement('tr');
//                         fields.forEach(field => {
//                             const td = document.createElement('td');
//                             td.style.border = '1px solid #c1bebe';
//                             td.style.padding = '8px';
//                             td.style.fontSize = '14px';
//                             td.style.fontWeight = '400';
//                             td.textContent = feature.attributes[field] || '';
//                             row.appendChild(td);
//                         });
//                         tbody.appendChild(row);
//                     });
//                     table.appendChild(tbody);
//                     tbodyWrapper.appendChild(table);
//                     selectedContainer.appendChild(tbodyWrapper);

//                     selectedContainer.style.display = 'block';
//                 });
//             } else {
//                 toast("No feature selected");
//             }
//         };
//         dropdownButtonStyle(showSelectedButton);
//         dropdownContent.appendChild(showSelectedButton);

//         dropdownContainer.appendChild(dropdownContent);

//         // Create selected container
//         const selectedContainer = document.createElement('div');
//         selectedContainer.id = `selectedContainer-${id}`;
//         selectedContainer.style.display = 'none';
//         selectedContainer.style.border = '1px solid #c1bebe';
//         selectedContainer.style.padding = '10px';
//         selectedContainer.style.backgroundColor = '#fff';
//         selectedContainer.style.position = 'absolute';
//         selectedContainer.style.bottom = '1px';
//         selectedContainer.style.left = '1px';
//         selectedContainer.style.width = '99.8%';
//         selectedContainer.style.height = '230px';
//         selectedContainer.style.overflow = 'hidden';
//         container.appendChild(selectedContainer);

//         showAllButton.addEventListener('click', () => {
//             selectedContainer.style.display = 'none';
//             view.goTo(originalExtent)
//         });

//         // Close the dropdown when clicking outside
//         document.addEventListener('click', (event) => {
//             if (!dropdownContainer.contains(event.target)) {
//                 dropdownContent.style.display = 'none';
//             }
//         });
//     } else {
//         const container = document.getElementById(`layerContainer-${id}`);
//         container.style.display = 'block';
//     }
// };

export const createFeatureTable = async (id, view, layer) => {
    const scFields = screenRelatedFields.find((srf) => srf.id === id);
    let fields = scFields ? scFields.fields.map(f => f.value) : fields;

    if (!featureTables[id]) {
        const fieldConfigs = fields.map(field => ({ name: field }));

     
        const originalExtent = view.extent.clone();
        featureTable = new FeatureTable({
            view,
            layer,
            visibleElements: {
                menuItems: {
                    clearSelection: true,
                    refreshData: false,
                    toggleColumns: true,
                    selectedRecordsShowAllToggle: true,
                    selectedRecordsShowSelectedToggle: true,
                    zoomToSelection: true
                }
            },
            container: document.getElementById(`tableDiv-${id}`),
            fieldConfigs: fieldConfigs.map((fieldConfig) => {
                if (id === 12 && fieldConfig.name === "oms_year") {
                  return {
                    ...fieldConfig,
                    format: {
                      digitSeparator: false,  
                      places: 0 
                    },
                  };
                }
                return fieldConfig;  
              }),
        });

        featureTables[id] = featureTable;
        let selectedFeatureIds = [];
        let isShowingSelected = false;

        const allFeatures = await layer.queryFeatures({ where: '1=1' });

        reactiveUtils.when(() => view.stationary, () => {
            featureTable.filterGeometry = view.extent;
        }, { initial: true });

        view.on("immediate-click", async (event) => {
            const response = await view.hitTest(event);
            const candidate = response.results.find((result) => {
                return result.graphic && result.graphic.layer && result.graphic.layer === layer;
            });
            if (candidate) {
                const objectId = candidate.graphic.getObjectId();
                if (featureTable.highlightIds.includes(objectId)) {
                    featureTable.highlightIds.remove(objectId);
                } else {
                    featureTable.highlightIds.add(objectId);
                }
            }
        });

        reactiveUtils.watch(

            () => featureTable.highlightIds.length,
            (highlightIdsCount) => {
                featureTable.viewModel.activeFilters.forEach((filter) => {
                    if (filter.type === "selection") {
                        const selectionIdCount = filter.objectIds.length;
                        if (selectionIdCount !== highlightIdsCount) {
                            featureTable.filterBySelection();
                        }
                    }
                });
            }
        );
        featureTable.on('selection-change', (event) => {
            featureTable.filterGeometry = view.extent;
            if (expandFlag == true) {
                if (event.added.length > 0) {
                    event.added.forEach((selectedFeature) => {
                        const objectId = selectedFeature.objectId;
                        if (!selectedFeatureIds.includes(objectId)) {
                            selectedFeatureIds.push(objectId);
                        }
                    });
                } else if (event.removed.length > 0 && event.added.length === 0) {
                    event.removed.forEach((removedFeature) => {
                        const objectId = removedFeature.objectId;
                        selectedFeatureIds = selectedFeatureIds.filter(id => id !== objectId);
                    });
                }
                if (event.added.length > 0) {
                    if (selectedFeatureId === undefined) {
                        selectedFeatureId = event.added[0].objectId;
                    } else if (selectedFeatureId === event.added[0].objectId) {
                        selectedFeatureId = undefined;
                    } else {
                        selectedFeatureId = event.added[0].objectId;
                    }
                }
            } else if (expandFlag == false) {
                if (event.added.length > 0) {
                    if (selectedFeatureId === undefined) {
                        selectedFeatureId = event.added[0].objectId;
                    } else if (selectedFeatureId === event.added[0].objectId) {
                        selectedFeatureId = undefined;
                    } else {
                        selectedFeatureId = event.added[0].objectId;
                    }
                }
            }
        });

        async function updateViewToSelectedFeatures() {
            if (selectedFeatureIds.length > 0) {
                const query = layer.createQuery();
                query.objectIds = selectedFeatureIds;
                const result = await layer.queryFeatures(query);

                if (result.features.length > 0) {
                    const geometries = result.features.map(f => f.geometry);
                    const extent = geometries.reduce((acc, geometry) => {
                        if (geometry.type === "point") {
                            const pointExtent = new Extent({
                                xmin: geometry.x - 0.0001,
                                ymin: geometry.y - 0.0001,
                                xmax: geometry.x + 0.0001,
                                ymax: geometry.y + 0.0001,
                                spatialReference: geometry.spatialReference
                            });
                            acc = acc ? acc.union(pointExtent) : pointExtent;
                        } else {
                            acc = acc ? acc.union(geometry.extent) : geometry.extent;
                        }
                        return acc;
                    }, null);
                    if (extent) view.goTo(extent.expand(1.2));
                } else {
                    toast("No Features Selected in Table");
                }
            } else {
                toast("No Features Selected in Table");
            }
        }

        function showSelectedFeatures() {
            if (selectedFeatureIds.length > 0) {
                featureTable.filterBySelection();
                isShowingSelected = true;
            } else {
                toast("No Features Selected");
            }
        }

        function clearSelections() {
            selectedFeatureIds = [];
            featureTable.clearSelection();
            featureTable.filterGeometry = null;
            featureTable.source = allFeatures.features;
            view.goTo(originalExtent);
            isShowingSelected = false;
        }

        function showAllFeatures() {
            if (isShowingSelected) {
                featureTable.clearSelectionFilter()
                isShowingSelected = false;
            }
        }

        const container = document.getElementById(`layerContainer-${id}`);
        container.style.display = 'block';

        const resizeHandle = document.createElement('div');
        resizeHandle.style.width = '50px';
        resizeHandle.style.height = '40px';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.right = '38px';
        resizeHandle.style.top = '0';
        // resizeHandle.style.cursor = 'n-resize';
        resizeHandle.style.fontSize = '22px';
        resizeHandle.style.paddingLeft = '25px';
        // resizeHandle.innerText = '↕';
        resizeHandle.title = 'Resize';
        // Insert SVG icon
        resizeHandle.innerHTML = `
                <svg width="20px" height="20px" style={{cursor:"pointer"}} viewBox="0 -9 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000" transform="rotate(90)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>arrow-left-right</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-256.000000, -1200.000000)" fill="#000000"> <path d="M287.718,1206.22 L281.795,1200.28 C281.404,1199.89 280.768,1199.89 280.376,1200.28 C279.984,1200.68 279.984,1201.31 280.376,1201.71 L284.635,1205.98 L259.365,1205.98 L263.624,1201.71 C264.016,1201.31 264.016,1200.68 263.624,1200.28 C263.232,1199.89 262.597,1199.89 262.205,1200.28 L256.282,1206.22 C256.073,1206.43 255.983,1206.71 255.998,1206.98 C255.983,1207.26 256.073,1207.54 256.282,1207.75 L262.205,1213.69 C262.597,1214.08 263.232,1214.08 263.624,1213.69 C264.016,1213.29 264.016,1212.66 263.624,1212.26 L259.365,1207.99 L284.635,1207.99 L280.376,1212.26 C279.984,1212.66 279.984,1213.29 280.376,1213.69 C280.768,1214.08 281.404,1214.08 281.795,1213.69 L287.718,1207.75 C287.927,1207.54 288.017,1207.26 288.002,1206.98 C288.017,1206.71 287.927,1206.43 287.718,1206.22" id="arrow-left-right" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>
                `;

        container.appendChild(resizeHandle);



        


        let isResizing = false;
        let lastDownY = 0;

        const minHeight = 250;
        const maxHeight = 650;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            lastDownY = e.clientY;
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        });

        function resize(e) {
            if (!isResizing) return;

            const dy = e.clientY - lastDownY;
            const newHeight = container.offsetHeight - dy;
            const newTop = container.offsetTop + dy;

            // Apply min and max height constraints
            if (newHeight >= minHeight && newHeight <= maxHeight) {
                container.style.height = `${newHeight}px`;
                container.style.top = `${newTop}px`;
            }

            lastDownY = e.clientY;
        }

        function stopResize() {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        }



        // Dropdown setup
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'dropdownContainer';
        dropdownContainer.style.position = 'absolute';
        dropdownContainer.style.top = '8px';
        dropdownContainer.style.right = '6%';
        dropdownContainer.style.display = 'inline-block';
        container.appendChild(dropdownContainer);

        const dropdownButton = document.createElement('button');
        dropdownButton.textContent = 'Actions';
        dropdownButton.className = 'dropdown-btn';
        dropdownButton.style.borderRadius = '5px';
        dropdownButton.style.padding = '2px 6px';
        dropdownButton.style.fontSize = '13px';
        dropdownButton.style.border = '1px solid #c1bebe';
        dropdownButton.style.backgroundColor = '#fff';
        dropdownButton.style.cursor = 'pointer';
        dropdownButton.onclick = () => {
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        };
        dropdownContainer.appendChild(dropdownButton);

        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content';
        dropdownContent.style.display = 'none';
        dropdownContent.style.position = 'absolute';
        dropdownContent.style.backgroundColor = '#f9f9f9';
        dropdownContent.style.boxShadow = '0px 8px 16px rgba(0,0,0,0.2)';
        dropdownContent.style.zIndex = '1000';
        dropdownContent.style.minWidth = '125px';
        dropdownContent.style.border = '1px solid #c1bebe';
        dropdownContent.style.borderRadius = '5px';
        dropdownContent.style.right = '0';
        dropdownContainer.appendChild(dropdownContent);

        // Button creation helper
        const createDropdownButton = (text, className, onClick) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.className = className;
            button.style.display = 'block';
            button.style.width = '100%';
            button.style.padding = '10px';
            button.style.textAlign = 'left';
            button.style.border = 'none';
            button.style.borderBottom = '1px solid #c1bebe';
            button.style.backgroundColor = '#fff';
            button.style.cursor = 'pointer';
            button.style.fontSize = '13px';
            button.onclick = onClick;
            dropdownContent.appendChild(button);
        };

        document.addEventListener('click', (event) => {
            if (!dropdownContainer.contains(event.target)) {
                dropdownContent.style.display = 'none';
            }
        });
        createDropdownButton('Export Data', 'export_table_data', () => exportFeatureTableToCSV(featureTable, fields));
        createDropdownButton('Zoom In', 'zoomIn-class', () => updateViewToSelectedFeatures());
        createDropdownButton('Clear Selection', 'clearSelection-class', () => clearSelections());
        createDropdownButton('Show All Features', 'showAll-class', () => showAllFeatures());
        createDropdownButton('Show Selected Features', 'showSelected-class', () => showSelectedFeatures());

    } else {
        const container = document.getElementById(`layerContainer-${id}`);
        container.style.display = 'block';
    }
};

export const labelClass = new LabelClass({
    labelExpressionInfo: {
        expression: "$feature.sttnname1 + ' ( ' + $feature.sttncode+ ' )'"
    },
    symbol: {
        type: "text",
        color: "#481E14",
        font: {
            family: "playfair-display",
            size: 9
        },
        padding: {
            left: 2,
            right: 2,
            top: 2,
            bottom: 2
        },
        // yoffset: -1
    },
    labelPlacement: "above-center",
    maxScale: 0,
    minScale: 0
});
export const junctionLabelClass = new LabelClass({
    labelExpressionInfo: {
        expression: "$feature.sttnname1"
    },
    symbol: {
        type: "text",
        color: "#000", // Change the text color to green
        halo: {
            color: "#000000", // Border color (black)
            size: 1 // Border thickness
        },
        font: {
            family: "playfair-display",
            size: 9
        },
        background: {
            color: "#FFFFFF", // Background color (white)
            padding: {
                left: 4,
                right: 4,
                top: 2,
                bottom: 2
            }
        },
        padding: {
            left: 2,
            right: 2,
            top: 2,
            bottom: 2
        },
        yoffset: -1,
    },
    labelPlacement: "above-center",
    maxScale: 0,
    minScale: 0
});

//Operational Layer
export const operationalLayers = [
    { id: 1, name: "Permanent Speed Restriction", },
    { id: 2, name: "Rail Section Analysis", },
    { id: 3, name: "GMT Details (% Service Life Passed)", },
    { id: 4, name: "Rail Fracture", },
    { id: 5, name: "Level Crossing (TVU)", },
    { id: 6, name: "Weld Fracture", },
    { id: 7, name: "Special Route", },
    { id: 8, name: "Annual Sectional GMT(Traffic Density)", },
    { id: 9, name: "Sectional Speed (Kmph)", },
    { id: 10, name: "Track Quality", },
    { id: 11, name: "UML Location (No. of Peaks)", },
    { id: 12, name: "OMS Repeated Location", },
    { id: 13, name: "Bridge ORN", },
    { id: 14, name: "Monsoon Reserves", },
    { id: 15, name: "Bridge Water Level", },
];
export const TrackInsightes = [
    { id: 1, label: "Permanent Speed Restriction", value: "Permanent Speed Restriction", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_psr_details_event/MapServer", renderer: permanentSpeedRestrictionsClassBreaksRenderer, popupTemplate: permanentSpeedRestrictionsPopUpTemplate, title: "Permanent Speed Restriction", checked: false },
    { id: 2, label: "Rail Section Analysis", value: "Rail Section Analysis", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_rail_details_event/MapServer", renderer: railSectionClassBreaksRenderer, popupTemplate: railSectionPopUpTemplate, title: "Rail Section Analysis", checked: false },
    { id: 3, label: "GMT Details", value: "GMT Details", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_event_gmt_detail_event/MapServer", renderer: gmtClassBreaksRenderer, popupTemplate: GMTPopupTemplate, title: "GMT Details (% Service Life Passed)", field: "rail_secti", checked: false },
    { id: 4, label: "Rail Fracture", value: "Rail Fracture", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/mplayer_rail_fractures_event/MapServer", renderer: railFractureRenderer, popupTemplate: railFracturePopUpTemplate, title: "Rail Fracture", checked: false },
    { id: 5, label: "Level Crossing", value: "Level Crossing", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_level_crossing_details_event/MapServer/0", renderer: levelCrossingRenderer, popupTemplate: levelCrossingPopUpTemplate, title: "Level Crossing (TVU)", checked: false },
    { id: 6, label: "Weld Fracture", value: "Weld Fracture", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_weld_fractures_event/MapServer", renderer: weldFractureReportRenderer, popupTemplate: weldFractureReportPopUpTemplate, title: "Weld Fracture", checked: false },
    { id: 7, label: "Special Route", value: "Special Route", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_special_route_event/MapServer", renderer: specialRouteClassBreaksRenderer, popupTemplate: specialRoutePopUpTemplate, title: "Special Route", checked: false },
    { id: 8, label: "Annual Sectional GMT(Traffic Density)", value: "Annual Sectional GMT(Traffic Density)", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_sectional_gmt_event/MapServer", title: "Annual Sectional GMT(Traffic Density)", renderer: SectionalGmtClassBreaksRenderer, popupTemplate: sectionalGmtPopUpTemplate, checked: false },
    { id: 9, label: "Sectional Speed", value: "Sectional Speed", url: "", title: "Sectional Speed (Kmph)", renderer: SectionalSpeedClassBreaksRenderer, popupTemplate: sectionalSpeedPopUpTemplate, checked: false },
    { id: 10, label: "Track Quality", value: "Track Quality", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_track_quality_event/MapServer", title: "Track Quality", renderer: trackQualityClassBreaksRenderer, popupTemplate: trackQualityPopUPTemplate, checked: false },
    { id: 11, label: "NBML/UML Locations", value: "UML Locations", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_trc_uml_locations_event/MapServer", title: "UML Location (No. of Peaks)", renderer: umlOnTRCSimpleRenderer, popupTemplate: umlLocationPopUpTemplate, checked: false },
    { id: 12, label: "OMS Repeated Location", value: "OMS Repeated Location", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_event_oms_repeated_loc_event/MapServer", title: "OMS Repeated Location", renderer: omsPeakRenderer, popupTemplate: omsPeaksPopUpTemplate, checked: false },
];
export const BridgeInsightes = [
    { id: 13, label: "Bridge ORN", value: "Bridge ORN", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_bridge_orn_event/MapServer", title: "Bridge ORN", renderer: bridgeOrmClassBreaksRenderer, popupTemplate: bridgeORN_1or2_PopUpTemplate, checked: false },
    { id: 14, label: "Monsoon Reserves", value: "Monsoon Reserves", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_monsoon_reserve_event/MapServer", title: "Monsoon Reserves", renderer: monsoonReservesClassBreaksRenderer, popupTemplate: monsoonReservesPopUpTemplate, checked: false },
    { id: 15, label: "Bridge Water Level", value: "Bridge Water Level", url: globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_bridge_water_level_event/MapServer", title: "Bridge Water Level", renderer: bridgeWaterLevelClassBreaksRenderer, popupTemplate: bridgeWaterLevelPopUptemplate, checked: false },
    // { id: 16, label: "Geo Tagged Images", value: "Geo Tagged Images", url: "https://mlinfomap.org/server/rest/services/GeoTagged/MapServer/0", title: "Geo Tagged Images", renderer: "", popupTemplate: "", checked: false },
];
export const trackLayer = globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/IR_Calibrated_Tracks_2/MapServer";
export const junctionLayer = globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/Station_IR2/MapServer";
export const nbmlLayer = globalUrlConfig.REACT_APP_BASE_SERVICE_URL + "/maplayer_trc_nbml_locations_event/MapServer";

export const operatorsList = [
    { id: 1, label: "Greater Than", value: ">" },
    { id: 2, label: "Less Than", value: "<" },
    { id: 3, label: "Equal To", value: "=" },
]
export const commonFields = [
    { label: "Railway", value: "railway", type: "string" },
    { label: "Division", value: "division", type: "string" },
    { label: "Route", value: "route", type: "string" },
    { label: "Section", value: "section", type: "string" },
    { label: "Type of Route", value: "routeclass", type: "string" },
]

export const classifications = [
    { label: "Equal-Interval", value: "equal-interval" },
    { label: "Quantile", value: "quantile" },
    { label: "Natural-Breaks", value: "natural-breaks" },
    { label: "Manual", value: "manual" },

];
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
    .esri-legend__layer-caption{
    display:none !important;
    color:white;
  }
`;
document.head.appendChild(style);

const indiaWGS84Extent = new Extent({
    xmin: 68.1766451354,
    ymin: 6.7475150000,
    xmax: 97.4025614766,
    ymax: 35.4940095078,
    spatialReference: { wkid: 4326 }
});

export const indiaWebMercatorExtent = webMercatorUtils.project(indiaWGS84Extent, { wkid: 102100 });

export const indiaExtent = {
    xmin: 68.1113787,
    ymin: 6.5546079,
    xmax: 97.395561,
    ymax: 35.6745457,
    spatialReference: {
        wkid: 4326
    }
};



























