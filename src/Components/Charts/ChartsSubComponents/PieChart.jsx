import React, { Fragment, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { generateDistinctHexColors,showAllFeatures } from '../../Utils/Functions';

const PieChart = ({id, title, dataSeries, labels, filterData, cQuery,bQuery,lastThreeyears,view, width,height,setChartQuery }) => {
    const [selectedValue, setSelectedValue] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [colors, setColors] = useState([]);

    const handleDataPointSelection = (event, chartContext, config) => {
        
        const clickedCategory = labels[config.dataPointIndex];
        setSelectedValue(prevSelected => {
            if (prevSelected.includes(clickedCategory)) {
                const updatedSelected = prevSelected.filter(labels => labels !== clickedCategory);
                setSelectedIndices(prevIndices => prevIndices.filter(index => index !== config.dataPointIndex));
                if (updatedSelected.length === 0) {
                    showAllFeatures(id,view,cQuery,bQuery,lastThreeyears,setChartQuery);
                }
                return updatedSelected;
            } else {
                filterData(clickedCategory);
                setSelectedIndices(prevIndices => [...prevIndices, config.dataPointIndex]);
                return [...prevSelected, clickedCategory];
            }
        });
    };

    useEffect(() => {
        const newColors = generateDistinctHexColors(dataSeries.length);
        setColors(newColors);
    }, [dataSeries]);
    useEffect(() => {
        setChartData((prevData) => ({
            ...prevData,
            series: dataSeries,
            options: {
                ...prevData.options,
                colors: colors // Update colors when they change
            }
        }));
    }, [dataSeries, colors]);

    const [chartData, setChartData] = useState({
        series: dataSeries, // Pie chart uses a series of numbers
        options: {
            chart: {
                type: 'pie',
                toolbar: {
                    show: true, // Show the toolbar
                    tools: {
                        download: false,
                        zoom: false,
                        selection: false,
                        pan: false,
                        reset: false,
                        customIcons: [
                            {
                                icon: `<div class='allFeaturesIconWrapper'>
                                            <svg width="25px" height="16px" class='allFeaturesIcon' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                            <g stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                                                <g fill="#696969" transform="translate(70.530593, 46.125620)">
                                                <path d="M185.469407,39.207713 L356.136074,39.207713 L356.136074,81.8743797 L185.469407,81.8743797 L185.469407,39.207713 Z M185.469407,188.541046 L356.136074,188.541046 L356.136074,231.207713 L185.469407,231.207713 L185.469407,188.541046 Z M185.469407,337.87438 L356.136074,337.87438 L356.136074,380.541046 L185.469407,380.541046 L185.469407,337.87438 Z M119.285384,-7.10542736e-15 L144.649352,19.5107443 L68.6167605,118.353113 L2.84217094e-14,58.3134476 L21.0721475,34.2309934 L64.0400737,71.8050464 L119.285384,-7.10542736e-15 Z M119.285384,149.333333 L144.649352,168.844078 L68.6167605,267.686446 L2.84217094e-14,207.646781 L21.0721475,183.564327 L64.0400737,221.13838 L119.285384,149.333333 Z M119.285384,298.666667 L144.649352,318.177411 L68.6167605,417.01978 L2.84217094e-14,356.980114 L21.0721475,332.89766 L64.0400737,370.471713 L119.285384,298.666667 Z"></path>
                                             </g>
                                            </g>
                                            </svg>
                                        </div>`,
                                title: 'Show All Features',
                                class: 'custom-icon',
                                click: () => {
                                    showAllFeatures(id,view,cQuery,bQuery,lastThreeyears,setChartQuery);
                                }
                            }
                        ]
                    }
                },
                events: {
                    dataPointSelection: handleDataPointSelection
                }
            },
            title: {
                text: title,
                style: {
                    fontSize: "12px"
                }
            },
            labels: labels, // Pie chart uses labels instead of categories
            colors: colors,
            theme: { mode: "light" },
            legend: {
                show: true,
                position: "left",
                onItemHover: {
                    highlightDataSeries: false
                }
            },
            tooltip: {
                enabled: true,
                onDatasetHover: {
                    highlightDataSeries: false
                }
            },
            dataLabels: {
                style: {
                    colors: ["white"],
                    fontSize: "10px"
                }
            }
        }
    });

    return (
        <Fragment>
            <Chart
                type='pie'
                width={width}
                height={height}
                series={chartData.series}
                options={chartData.options}
            />
        </Fragment>
    );
};

export default PieChart;