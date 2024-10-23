import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { loadModules } from 'esri-loader';
import QueryBuilder from '../Widgets/QueryBuilder';
import AssetCount from '../Widgets/AssetCount';
import YearWiseQuery from '../Widgets/YearWiseQuery';
import LogoutModal from '../Modals/LogoutModal';
import BlueSwitch from '../Buttons/BlueSwitch';
import UpArrowButton from '../Buttons/UpArrowButton';
import './SplitScreen.css';
import { Remove_User } from "../../actions";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from '@mui/material';
import $ from 'jquery';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { baseTrackRenderer, nbmlOnTRCSimpleRenderer } from '../../Templates/Renderer';
import { nbmlOnTRCPopUpTemplate, baseTrackPopUpTemplate } from '../../Templates/PopUpTemplate';
import { assetCountOfScreens } from '../../Templates/ScreenAsset';
import { featureTable, indiaWebMercatorExtent, junctionLayer, monsoonQuery, nbmlLayer, trackLayer } from '../../Templates/Template';
import { areAllValuesSelected, updateRailways, updateLegendForId4And6, addCircularBoundaries, updateLegendForId13, capitalizeFirstLetter, getYears, getZoneDivisionFeaturesAndZoom } from '../Utils/Functions';
import { TrackInsightes, exportFeatureTable, featureTables, BridgeInsightes, operationalLayers, indiaExtent, createFeatureTable } from '../../Templates/Template';
import Chart from '../Charts/Chart';
import Loader from '../Loader/Loader';
import globalUrlConfig from '../../BaseUrlConfig';
const [Extent, Popup, FeatureLayer, MapView, Map, Zoom, ScaleBar, Expand, BasemapGallery, reactiveUtils, Legend, LayerList, typeRendererCreator, IdentityManager, geometry, SpatialReference, Fullscreen, Print, colorRendererCreator, histogram, ClassedColorSlider, Home, geometryEngine, Point, FeatureTable, MapImageLayer, Graphic, GroupLayer,
] = await loadModules(["esri/geometry/Extent", "esri/widgets/Popup", "esri/layers/FeatureLayer", "esri/views/MapView", "esri/Map", "esri/widgets/Zoom", "esri/widgets/ScaleBar",
    "esri/widgets/Expand", "esri/widgets/BasemapGallery", "esri/core/reactiveUtils", "esri/widgets/Legend", "esri/widgets/LayerList", "esri/smartMapping/renderers/type", "esri/identity/IdentityManager", "esri/geometry", "esri/geometry/SpatialReference", "esri/widgets/Fullscreen", "esri/widgets/Print", "esri/smartMapping/renderers/color", "esri/smartMapping/statistics/histogram",
    "esri/widgets/smartMapping/ClassedColorSlider", "esri/widgets/Home", "esri/geometry/geometryEngine", "esri/geometry/Point", "esri/widgets/FeatureTable", "esri/layers/MapImageLayer", "esri/Graphic", "esri/layers/GroupLayer",], { css: true });
export let expandFlag = false;

export let selectedFeatureId1 = undefined;
const SplitScreen = () => {
    const dispatch = useDispatch();
    let screenId
    const [isOpenLogModal, setIsOpenLogModal] = useState(false)
    const trackInsightesDropdownRef = useRef(null);
    const bridgeInsightesDropdownRef = useRef(null);
    const zoneDropdownRef = useRef(null);
    const divisionDropdownRef = useRef(null);
    const sectionDropdownRef = useRef(null);
    const effectRun = useRef(false);
    const omsLayerSelectedRef = useRef("");
    const [isAlertDisplay, setIsAlertDisplay] = useState(false);
    const [alertObject, setAlertObject] = useState({});
    const [initialMap, setInitialMap] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [trackDropdown, setTrackDropdown] = useState(false);
    const [bridgeDropdown, setBridgeDropdown] = useState(false);
    const [openZoneDivFilter, setOpenZoneDivFilter] = useState(false);
    const [zoneDropDown, setZoneDropDown] = useState(false);
    const [divisionDropDown, setDivisionDropDown] = useState(false);
    const [sectionDropDown, setSectionDropDown] = useState(false);
    const [railwayZone, setRailwayZone] = useState([]);
    const [railwayDivision, setRailwayDivision] = useState([]);
    const [railwaySection, setRailwaySection] = useState([]);
    const [mapObject, setMapObject] = useState([]);
    const [railwayNames, setRailwayNames] = useState(null);
    const [divisionNames, setDivisionNames] = useState(null);
    const [sectionNames, setSectionNames] = useState(null);
    const [isSyncEnabled, setIsSyncEnabled] = useState(true);
    const watchersRef = useRef([]);
    const [active, setActive] = useState(null);
    const [trackInsightes, setTrackInsightes] = useState(TrackInsightes);
    const [bridgeInsightes, setBridgeInsightes] = useState(BridgeInsightes);
    const [screens, setScreens] = useState([
        { id: 0, label: "", value: "", url: "" }
    ]);
    const [eventDataStatus, setEventDataStatus] = useState([]);
    const [loadingStatesForScreen, setLoadingStatesForScreen] = useState({});
    const [loadingStatesForQueryBuilder, setLoadingStatesForQueryBuilder] = useState({});
    const [userProfileDropdown, setUserProfileDropdown] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isAuthorizedUser, setIsAuthorizedUser] = useState(false);
    const queryObject = [
        { id: 1, query: "" },
        { id: 2, query: "" },
        { id: 3, query: "" },
        { id: 4, query: "", years: [] },
        { id: 5, query: "" },
        { id: 6, query: "", years: [] },
        { id: 7, query: "" },
        { id: 8, query: "" },
        { id: 9, query: "" },
        { id: 10, query: "" },
        { id: 11, query: "" },
        { id: 12, query: "", years: [] },
        { id: 13, query: "" },
        { id: 14, query: "" },
        { id: 15, query: "" },
        { id: 16, query: "" }
    ];
    useEffect(() => {
        sessionStorage.setItem("finalQuery", JSON.stringify(queryObject));
    }, [])
    const storedUser = sessionStorage.getItem('esUser');
    useEffect(() => {
        const getUserDataWithZoneAndDiv = async () => {
            let username = storedUser;
            try {
                let response = await fetch(globalUrlConfig.REACT_APP_API_BASE_URL + '/getUser_Zone_Division', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username }),
                });
                if (!response.ok) {
                    let jsonData = await response.json();
                    return toast.error(`HTTP error! Status: ${jsonData.message}`)
                }
                let jsonData = await response.json();
                setUserData(jsonData);
            } catch (error) {
                return toast.error("Error :", error.response)
            }
        }
        getUserDataWithZoneAndDiv();
    }, [])

    const startLoaderForScreen = (screenId) => {
        setLoadingStatesForScreen(prev => ({ ...prev, [screenId]: true }));
    };
    const stopLoaderForScreen = (screenId) => {
        setLoadingStatesForScreen(prev => ({ ...prev, [screenId]: false }));
    };
    const startLoaderForQueryBuilder = (screenId) => {
        setLoadingStatesForQueryBuilder(prev => ({ ...prev, [screenId]: true }));
        $(`#viewDiv-${screenId}`).css("opacity", "0.5");
        $(`#viewDiv-${screenId}`).css("pointer-events", "none");
    };
    const stopLoaderForQueryBuilder = (screenId) => {
        setLoadingStatesForQueryBuilder(prev => ({ ...prev, [screenId]: false }));
        $(`#viewDiv-${screenId}`).css("opacity", "1");
        $(`#viewDiv-${screenId}`).css("pointer-events", "auto");
    };

    const trackFeatureLayer = new FeatureLayer({
        url: trackLayer,
        title: "Base Track",
        renderer: baseTrackRenderer,
        popupTemplate: baseTrackPopUpTemplate
    })
    const junctionMapImagelayer = new MapImageLayer({
        url: junctionLayer,
        title: "Railway Junction / Station",
    });
    const showAlert = () => {
        setIsAlertDisplay(true);
    }

    useEffect(() => {
        setTimeout(() => {
            setIsAlertDisplay(false)
            setAlertObject({});
        }, 3000);
    }, [isAlertDisplay]);
    const prevScreensRef = useRef(screens);
    const openLogoutMOdal = () => {
        if (screens.length >= 1 && screens[0].value !== "") {
            return toast.info("Please Close KPI Screen First");
        }
        setIsOpenLogModal(true);
        setUserProfileDropdown(false)
    }
    const handleLogout = () => {
        dispatch(Remove_User());
        IdentityManager.destroyCredentials();
        window.location.reload();
        sessionStorage.removeItem('esUser');
        sessionStorage.removeItem('finalQuery');
    };
    const formatTitle = (field) => {
        if (field) {
            return field
                .toLowerCase()
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
    };
    const calculateGrid = (count) => {
        let numRows, numCols;
        if (count <= 9) {
            if (count === 1) {
                numRows = 1;
                numCols = 1;
            } else if (count === 2) {
                numRows = 1;
                numCols = 2;
            } else if (count === 3) {
                numRows = 1;
                numCols = 3;
            } else if (count === 4) {
                numRows = 2;
                numCols = 2;
            } else if (count === 5) {
                numRows = 25;
                numCols = 3;
            } else if (count === 6) {
                numRows = 2;
                numCols = 3;
            } else if (count === 7) {
                numRows = 37;
                numCols = 3;
            } else if (count === 8) {
                numRows = 38;
                numCols = 3;
            } else if (count === 9) {
                numRows = 3;
                numCols = 3;
            }
        }
        return { numRows, numCols };
    };
    useEffect(() => {
        if (effectRun.current) return;
        const loadInitialLayer = async () => {
            var layer = new FeatureLayer({
                url: trackLayer
            });
            await Promise.all([layer.load()]);
            // setLayerFromMap(prevLayer => [...prevLayer, { title: layer.title, layer: layer }]);
            // setLayerFromScreenStyle(prevLayer => [...prevLayer, { title: layer.title, layer: layer }]);
        }
        loadInitialLayer();
        effectRun.current = true;
    }, []);
    const { numRows, numCols } = calculateGrid(screens.length);
    //#region API fetching the Zone, Division, Section And Status of event data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(globalUrlConfig.REACT_APP_API_BASE_URL + '/getZone');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                let zoneData = jsonData.data.map(d => ({ ...d, isSelected: true }));
                let filteredZone;
                if (userData && userData.role === "org_admin") {
                    setRailwayNames([]);
                    setRailwayNames([{ label: "All", value: "All", isSelected: true }, ...zoneData]);
                    setRailwayZone([]);
                    setRailwayZone(zoneData.map(d => d.value));
                    setIsAuthorizedUser(true);
                } else if (userData && userData.zone !== "" && userData.division !== "") {
                    filteredZone = zoneData.filter(zd => zd.value === userData.zone);
                    setRailwayNames([]);
                    setRailwayNames([...filteredZone]);
                    setRailwayZone([]);
                    setRailwayZone(filteredZone.map(d => d.value));
                    setIsAuthorizedUser(true);
                } else {
                    return;
                }
            } catch (error) {
                // setError(error);
            } finally {
                // setIsLoading(false);
            }
        };
        if (userData) { // Ensure this runs only after userData is set
            fetchData();
        }
    }, [userData]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(globalUrlConfig.REACT_APP_API_BASE_URL + '/getDivision?zone=' + railwayZone.join());
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                let divisionData = jsonData.data.map(d => ({ ...d, isSelected: true }));
                let filteredDivision;
                if (userData && userData.role === "org_admin") {
                    setDivisionNames([]);
                    setDivisionNames([{ label: "All", value: "All", isSelected: true }, ...divisionData]);
                    setRailwayDivision([]);
                    setRailwayDivision(divisionData.map(d => d.value));
                    setIsAuthorizedUser(true);
                } else if (userData && userData.zone !== "" && userData.division !== "") {
                    filteredDivision = divisionData.filter(zd => zd.value === userData.division);
                    setDivisionNames([]);
                    setDivisionNames([...filteredDivision]);
                    setRailwayDivision([]);
                    setRailwayDivision(filteredDivision.map(d => d.value));
                    setIsAuthorizedUser(true);
                } else {
                    return;
                }
            } catch (error) {
                // setError(error);
            } finally {
                // setIsLoading(false);
            }
        };
        if (userData) { // Ensure this runs only after userData is set
            fetchData();
        };
    }, [railwayZone, userData]);
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await fetch(globalUrlConfig.REACT_APP_API_BASE_URL + '/getSection?zone=' + railwayZone.join() + '&division=' + railwayDivision.join());
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                let sectionData = jsonData.data.map(d => ({ ...d, isSelected: true }));
                setSectionNames([]);
                setSectionNames([{ label: "All", value: "All", isSelected: true }, ...sectionData]);
                setRailwaySection([]);
                setRailwaySection(sectionData.map(s => s.value));
            } catch (error) {
                // setError(error);
            } finally {
                // setIsLoading(false);
            }
        };

        if (userData) { // Ensure this runs only after userData is set
            fetchData();
        }
    }, [railwayZone, railwayDivision, userData]);
    useEffect(() => {
        const fetchEventDataStatus = async () => {
            try {
                const response = await fetch(globalUrlConfig.REACT_APP_API_BASE_URL + '/kpi_update_status');
                if (!response) {
                    throw new Error('Failed to fetch Event Data Status');
                }
                const jsonData = await response.json();
                let data = jsonData.data.map(d => d);
                setEventDataStatus(data);
            } catch (error) {
                //setError(error)
            } finally {
                //setIsLoading(false)
            }
        }
        fetchEventDataStatus()
    }, [])
    //#endregion
    //#region MapScreens Draggable
    const handleDragStart = (event, index) => {
        setDraggedItem(index);
    };
    const handleDragOver = (event, index) => {
        event.preventDefault();
    };
    const handleDrop = (event, dropIndex) => {
        const updatedScreens = [...screens];
        updatedScreens.splice(dropIndex, 0, updatedScreens.splice(draggedItem, 1)[0]);
        setScreens(updatedScreens);
    };
    //#endregion
    //#region LoadNewMap Screen 
    const handleTrackInsightes = (item) => (event) => {
        const value = item.value;
        screenId = item.id;
        const isChecked = event.target.checked;
        const updatedTrackInsightes = trackInsightes.map((trackInsighte) =>
            trackInsighte.value === value ? { ...trackInsighte, checked: screens.length === 9 ? false : isChecked } : trackInsighte
        );
        let screenObj;
        if (isChecked) {
            if (screens.length < 9) {
                screenObj = {
                    id: screenId,
                    label: item.label,
                    value: item.value,
                    url: item.url,
                    renderer: item.renderer,
                    popupTemplate: item.popupTemplate,
                    field: item.field,
                    title: item.title,
                    checked: isChecked
                };
                if (screens[0].value === "") {
                    screens.splice(0, 1);
                    setScreens([screenObj])
                } else {
                    setScreens(prevScreens => [...prevScreens, screenObj]);
                }
            } else {
                toast.error("You Can't add more than 9 screens")
            }
            startLoaderForScreen(screenId);
        } else {
            if (screens.length === 1) {
                screens[0].id = 0;
                screens[0].value = "";
                screens[0].label = "";
                screens[0].url = "";
                screens[0].checked = false;
                setInitialMap(!initialMap);
            } else {
                setScreens(screens.filter((screen) => screen.value !== value));
                setMapObject(mapObject.filter((mo) => mo.title !== value));
            }
            setMapObject(prev => [...prev.filter(f => f.id !== screenId)]);
            delete featureTables[screenId];
            let storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
            if (storedQueryObject) {
                const updatedQueryObject = storedQueryObject.map(item =>
                    item.id === screenId ? { ...item, query: "" } : item
                );
                sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
            }
        }
        setTrackInsightes(updatedTrackInsightes);
        esriPopUpUpdateSizes();
    };
    const handleTrackInsightesDropdown = () => {
        if (!isAuthorizedUser) {
            return toast("You have not been assigned with zone or division")
        }
        setTrackDropdown(!trackDropdown)
        setUserProfileDropdown(false);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (trackInsightesDropdownRef.current && !trackInsightesDropdownRef.current.contains(event.target)) {
                setTrackDropdown(false);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);
    const handleBridgeInsightes = (bridgeItem) => (event) => {
        const value = bridgeItem.value;
        screenId = bridgeItem.id;
        const isChecked = event.target.checked;
        const updateBridgeInsightes = bridgeInsightes.map((bridgeInsighte) =>
            bridgeInsighte.value === value ? { ...bridgeInsighte, checked: screens.length === 9 ? false : isChecked } : bridgeInsighte
        );
        let screenObj;
        if (isChecked) {
            if (screens.length < 9) {
                screenObj = {
                    id: screenId,
                    label: bridgeItem.label,
                    value: bridgeItem.value,
                    url: bridgeItem.url,
                    renderer: bridgeItem.renderer,
                    popupTemplate: bridgeItem.popupTemplate,
                    field: bridgeItem.field,
                    title: bridgeItem.title,
                    checked: isChecked
                };
                if (screens[0].value === "") {
                    screens.splice(0, 1);
                    setScreens([screenObj]);
                } else {
                    setScreens(prevScreens => [...prevScreens, screenObj]);
                }

            } else {
                toast.error("You Can't add more thean 9 screen")
            }
            startLoaderForScreen(screenId);
        } else {
            if (screens.length === 1) {
                screens[0].id = 0;
                screens[0].value = "";
                screens[0].label = "";
                screens[0].url = "";
                screens[0].checked = false;
                setInitialMap(!initialMap);
            } else {
                setScreens(screens.filter((screen) => screen.value !== value));
                setMapObject(mapObject.filter((mo) => mo.title !== value));
            }
            setMapObject(prev => [...prev.filter(f => f.id !== screenId)])
            delete featureTables[screenId];
            let storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
            if (storedQueryObject) {
                const updatedQueryObject = storedQueryObject.map(item =>
                    item.id === screenId ? { ...item, query: "" } : item
                );
                sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
            }
        }
        setBridgeInsightes(updateBridgeInsightes);
        esriPopUpUpdateSizes();
    };
    const handleBridgeInsightesDropdown = () => {
        if (!isAuthorizedUser) {
            return toast("You have not been assigned with zone or division")
        }
        setUserProfileDropdown(false);
        setBridgeDropdown(!bridgeDropdown);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (bridgeInsightesDropdownRef.current && !bridgeInsightesDropdownRef.current.contains(event.target)) {
                setBridgeDropdown(false);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);
    const handleCloseMapDiv = (id) => {
        if (id >= 1 && id <= 12) {
            const updatedTrackInsightes = trackInsightes.map((trackIn) => trackIn.id === id ? { ...trackIn, checked: false } : trackIn);
            setTrackInsightes(updatedTrackInsightes);
            if (screens.length === 1) {
                screens[0].id = 0;
                screens[0].label = "";
                screens[0].value = "";
                screens[0].checked = false;
                setInitialMap(!initialMap);
            } else {
                setScreens(screens.filter((screen) => screen.id !== id));
            }
        } else {
            const updatedBridgeInsightes = bridgeInsightes.map((bridgeIn) => bridgeIn.id === id ? { ...bridgeIn, checked: false } : bridgeIn);
            setBridgeInsightes(updatedBridgeInsightes);
            if (screens.length === 1) {
                screens[0].id = 0;
                screens[0].label = "";
                screens[0].value = "";
                screens[0].checked = false;
                setInitialMap(!initialMap);
            } else {
                setScreens(screens.filter((screen) => screen.id !== id));
            }
        };
    };
    useEffect(() => {
        const loadInitialMap = async () => {
            const map = new Map({
                basemap: "gray-vector",
            });
            const initialView = new MapView({
                map: map,
                zoom: 3,
                extent: indiaWebMercatorExtent,
                constraints: {
                    geometry: indiaWebMercatorExtent,  // Limits the extent to the India boundary
                    minZoom: 3, // Prevents zooming out too much
                    snapToZoom: false,
                    rotationEnabled: false,
                    maxExtent: indiaWebMercatorExtent // Prevents panning out of India
                },
                popup: new Popup({
                    dockEnabled: true,
                    dockOptions: {
                        buttonEnabled: false,
                        breakpoint: false,
                        position: 'top-right'
                    },
                    visibleElements: {
                        closeButton: false
                    }
                }),
                container: `viewDiv-0`,
                ui: {
                    components: ["attribution"]
                },
            });
            let railwayQuery = "";
            let divisionQuery = "";
            let finalQuery = "";
            if (userData.zone) {
                railwayQuery = `railway in ('${userData.zone}')`;
            }
            if (userData.division) {
                divisionQuery = `division in ('${userData.division}')`;
            }
            finalQuery = [railwayQuery, divisionQuery].filter(Boolean).join(" AND ");
            if (!finalQuery)
                finalQuery = "1=1";

            trackFeatureLayer.definitionExpression = finalQuery;
            junctionMapImagelayer.when(() => {
                if (junctionMapImagelayer.sublayers) {
                    junctionMapImagelayer.sublayers.forEach(sublayer => {
                        sublayer.definitionExpression = finalQuery;
                    });
                } else {
                    console.error("No sublayers found in the MapImageLayer.");
                }
            }).catch(error => {
                console.error("Failed to load the MapImageLayer:", error);
            });
            trackFeatureLayer.queryExtent().then(function (result) {
                if (result.extent) {
                    initialView.goTo(result.extent.expand(1.5));
                }
            }).catch(function (error) {
                console.error("Error querying extent: ", error);
            });
            map.addMany([trackFeatureLayer, junctionMapImagelayer]);
            const home = new Home({
                view: initialView,
            })
            const zoom = new Zoom({
                view: initialView
            });
            const fullscreen = new Fullscreen({
                view: initialView
            })
            const scaleBar = new ScaleBar({
                view: initialView
            });
            const legendData = new Legend({
                view: initialView
            });
            const expandLegend = new Expand({
                view: initialView,
                content: legendData,
                expandTooltip: "Legend",
                expanded: true
            });
            const basemapGallery = new BasemapGallery({
                view: initialView,
                container: document.createElement("div")
            });
            const bgExpand = new Expand({
                view: initialView,
                content: basemapGallery
            });
            const expandTableWidget = new Expand({
                view: initialView,
                content: document.createElement("div"),
                expandIconClass: "esri-icon-table",
                expandTooltip: "Feature Table",
                collapseTooltip: "Collapse Feature Table"
            });
            const layerList = new LayerList({
                view: initialView
            });
            const expandLayerList = new Expand({
                view: initialView,
                content: layerList
            });
            function destroyFeatureTable() {
                var container = document.getElementById('layerContainer-0');
                container.style.display = 'none';
            }
            expandTableWidget.watch(["expanded", "collapsed"], (expanded, collapsed) => {
                if (expanded) {
                    expandLegend.collapse();
                    bgExpand.collapse();
                    expandLayerList.collapse();
                    createFeatureTable(0, initialView, trackFeatureLayer);
                    expandFlag = true;
                } else if (collapsed) {
                    destroyFeatureTable();
                }
            });
            // Function to close all Expand widgets except the provided one
            function closeOtherExpands(exceptExpand) {
                [expandLayerList, bgExpand,].forEach(expand => {
                    if (expand !== exceptExpand) {
                        expand.collapse();
                    }
                });
            };
            function closeTableExpands(currentExpand) {
                const expandWidgets = [expandLegend, expandTableWidget];
                expandWidgets.forEach(expand => {
                    if (expand !== currentExpand) {
                        expand.expanded = false;
                    }
                });
            };
            expandLegend.watch("expanded", (isExpanded) => {
                if (isExpanded) {
                    closeOtherExpands(expandLegend);
                }
            });
            expandLayerList.watch('expanded', () => {
                if (expandLayerList.expanded) {
                    expandTableWidget.collapse();
                    bgExpand.collapse();
                    expandLegend.collapse()

                }
            });
            bgExpand.watch('expanded', () => {
                if (bgExpand.expanded) {
                    expandTableWidget.collapse();
                    expandLegend.collapse()
                    expandLayerList.collapse();
                }
            })
            expandTableWidget.watch('expanded', () => {
                if (expandTableWidget.expanded) {
                }
            });
            window.addEventListener('click', (event) => {
                const isOutsideClick = ![expandLayerList, bgExpand].some(expand => {
                    return expand && expand.container && expand.container.contains(event.target);
                });
                if (isOutsideClick) {
                    closeOtherExpands(null);
                }
            });
            initialView.ui.add(zoom, "top-left");
            initialView.ui.add(fullscreen, "top-left");
            initialView.ui.add(home, "top-right");
            initialView.ui.add(expandLayerList, "top-right");
            initialView.ui.add(expandLegend, "bottom-right");
            initialView.ui.add(expandTableWidget, "top-left");
            initialView.ui.add(bgExpand, "top-right");
            initialView.ui.add(scaleBar, "bottom-left");
            initialView.extent = indiaExtent;
            await initialView.when();

        };
        if (userData) { // Ensure this runs only after userData is set
            loadInitialMap();
        }

        return () => {
        };
    }, [initialMap, userData]);
    const sync = (source) => {
        try {
            if (!active || !active.viewpoint || active !== source) {
                return;
            }
            mapObject.map(mo => mo.newView).forEach((view) => {
                if (isSyncEnabled && view !== active) {
                    view.viewpoint = active.viewpoint;
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    const synchronizeMaps = () => {
        try {
            if (mapObject.length > 0) {
                for (const view of mapObject.map(mo => mo.newView)) {
                    const handle = reactiveUtils.watch(
                        () => [view.interacting, view.viewpoint],
                        ([interacting, viewpoint]) => {
                            if (interacting) {
                                setActive(view);
                                sync(view);
                            }
                        }
                    );
                    watchersRef.current.push(handle);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    const teardownWatchers = () => {
        watchersRef.current.forEach(handle => handle.remove());
        watchersRef.current = [];
    };
    const handleSyncUnSyncMap = (e) => {
        setUserProfileDropdown(false);
        setOpenZoneDivFilter(false)
        if (screens.length < 2) {
            return toast("At least two screens should be selected for Sync/UnSync Map");
        }

        let sync = e.target.checked;
        setIsSyncEnabled(sync);
    }
    useEffect(() => {
        if (isSyncEnabled) {
            synchronizeMaps();
        } else {
            teardownWatchers();
        }

        // Clean up on component unmount
        return () => {
            teardownWatchers();
        };
    }, [active, mapObject, isSyncEnabled]);

    let expandForId4And6;
    let expandForId13;
    let storedQueryObject;
    let cQuery;
    useEffect(() => {
        const loadMapForNewScreens = async () => {
            storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
            cQuery = storedQueryObject.filter(so => so.id === 16)[0].query;
            const clusterConfig = {
                type: "cluster",
                clusterRadius: "100px",
                popupTemplate: {
                    title: "Cluster summary",
                    content: "This cluster represents {cluster_count} Weld Fracture.",
                    fieldInfos: [{
                        fieldName: "cluster_count",
                        format: {
                            places: 0,
                            digitSeparator: true
                        }
                    }]
                },
                clusterMinSize: "18px",
                clusterMaxSize: "36px",
                labelingInfo: [{
                    deconflictionStrategy: "none",
                    labelExpressionInfo: {
                        expression: `Text($feature.cluster_count, '#,###')`
                    },
                    symbol: {
                        type: "text",
                        color: "white",
                        font: {
                            weight: "bold",
                            family: "Noto Sans",
                            size: "12px"
                        }
                    },
                    labelPlacement: "center-center",
                }]
            };
            screens.forEach(async (screen) => {
                if (!prevScreensRef.current.some(prevScreen => prevScreen.id === screen.id)) {
                    const map = new Map({
                        basemap: "gray-vector"
                    });
                    const newView = new MapView({
                        map: map,
                        zoom: 3,
                        extent: indiaWebMercatorExtent,
                        constraints: {
                            geometry: indiaWebMercatorExtent,  // Limits the extent to the India boundary
                            minZoom: 3, // Prevents zooming out too much
                            snapToZoom: false,
                            rotationEnabled: false,
                            maxExtent: indiaWebMercatorExtent // Prevents panning out of India
                        },
                        popup: new Popup({
                            dockEnabled: true,
                            dockOptions: {
                                buttonEnabled: false,
                                breakpoint: false,
                                position: 'top-right'
                            },
                            visibleElements: {
                                closeButton: false
                            }
                        }),
                        container: `viewDiv-${screen.id}`,
                        ui: {
                            components: ["attribution"]
                        },
                    });
                    let userDefinitionExpression = "";
                    const userZone = userData.zone || "";
                    const userDivision = userData.division || "";
                    if (userZone && !userDivision)
                        userDefinitionExpression = `railway IN ('${userZone}')`;
                    if (userZone && userDivision)
                        userDefinitionExpression = `railway IN ('${userZone}') AND division IN ('${userDivision}')`;
                    let userQuery = userData.role === "org_admin" ? "1=1" : userDefinitionExpression;
                    $(`#viewDiv-${screen.id}`).css("pointer-events", "none");
                    $(`#viewDiv-${screen.id}`).css("opacity", "0.5");
                    let featurelayer;
                    featurelayer = new FeatureLayer({
                        url: screen.url,
                        title: screen.title,
                        renderer: screen.renderer,
                        popupTemplate: screen.popupTemplate,
                        definitionExpression: screen.id === 14 ? monsoonQuery : userQuery,
                    });
                    console.log(`this is the feature layer : ${featurelayer}`)
                    if (screen.id !== 2)
                        await Promise.all([featurelayer.load()]);
                    if (screen.id === 13) {
                        addCircularBoundaries(featurelayer, newView, newView.scale, cQuery, undefined);
                    }
                    let nbmlFeatureLayer;
                    if (screen.id === 11) {
                        nbmlFeatureLayer = new FeatureLayer({
                            url: nbmlLayer,
                            title: "NBML Location (No. of Blocks)",
                            renderer: nbmlOnTRCSimpleRenderer,
                            popupTemplate: nbmlOnTRCPopUpTemplate
                        });
                    }
                    if (screen.id === 4 || screen.id === 6) {
                        const legendForId4And6 = new Legend({
                            view: newView,
                            layerInfos: [
                                {
                                    layer: trackFeatureLayer,
                                    title: "Base Track",
                                },
                                {
                                    layer: junctionMapImagelayer,
                                    title: "Railway Junction / Station",
                                },
                            ],
                        });
                        expandForId4And6 = new Expand({
                            expandIconClass: "esri-icon-legend",
                            expanded: true
                        });
                        newView.when(() => {
                            updateLegendForId4And6(featurelayer, legendForId4And6, screen.title);
                        });
                        newView.ui.add(expandForId4And6, "bottom-right");
                        legendForId4And6.when(() => {
                            const legendNode = legendForId4And6.domNode;
                            legendNode.classList.add(`legend${screen.id}`);
                            legendNode.classList.remove('esri-widget--panel');
                        });
                        legendForId4And6.style.display = expandForId4And6.expanded ? 'block' : 'none';

                        expandForId4And6.watch("expanded", function (expanded) {
                            if (expanded == false) {
                                $(`.legend${screen.id}`).css('display', 'none');
                                $('.esri-layer-list').css('display', 'block')
                                $('.esri-print').css('display', 'block')
                            }
                            else {
                                $(`.legend${screen.id}`).css('display', 'block')
                            }
                            legendForId4And6.style.display = expanded ? 'block' : 'none';
                        });
                        newView.ui.add(legendForId4And6, "bottom-right");
                    }
                    if (screen.id === 4 || screen.id === 6) {
                        featurelayer.featureReduction = clusterConfig;
                    }
                    if (screen.id === 13) {
                        const legendForId13 = new Legend({
                            view: newView,
                            layerInfos: [
                                {
                                    layer: trackFeatureLayer,
                                    title: "Base Track",
                                },
                                {
                                    layer: junctionMapImagelayer,
                                    title: "Railway Junction / Station",
                                },
                            ],
                        });
                        expandForId13 = new Expand({
                            expandIconClass: "esri-icon-legend",
                            expanded: true
                        });
                        newView.when(() => {
                            updateLegendForId13(featurelayer, legendForId13, screen.title);
                        });
                        newView.ui.add(expandForId13, "bottom-right");
                        legendForId13.when(() => {
                            const legendNode = legendForId13.domNode;
                            legendNode.classList.add(`legend${screen.id}`);
                            legendNode.classList.remove('esri-widget--panel');
                        });
                        legendForId13.style.display = legendForId13.expanded ? 'block' : 'none';

                        expandForId13.watch("expanded", function (expanded) {
                            if (expanded == false) {
                                $(`.legend${screen.id}`).css('display', 'none');
                                $('.esri-layer-list').css('display', 'block')
                                $('.esri-print').css('display', 'block')
                            }
                            else {
                                $(`.legend${screen.id}`).css('display', 'block')
                            }
                            legendForId13.style.display = expanded ? 'block' : 'none';
                        });
                        newView.ui.add(legendForId13, "bottom-right");
                    }
                    esriPopUpUpdateSizes();
                    if (!screen.renderer) {
                        generateRenderer(newView, featurelayer, screen.field)
                    }
                    if (screen.id === 11) {
                        map.addMany([trackFeatureLayer, junctionMapImagelayer, featurelayer, nbmlFeatureLayer]);
                    } else {
                        map.addMany([trackFeatureLayer, junctionMapImagelayer, featurelayer]);
                    }
                    newView.on("click", function (event) {
                        newView.hitTest(event).then(function (response) {
                            if (response.results.length > 0) {
                                var result = response.results[0];
                                var clickedLayer = result.graphic.layer;
                                if (clickedLayer.title === screen.title) {
                                    trackFeatureLayer.popupTemplate = null;
                                } else if (clickedLayer.title === 'Base Track') {
                                    trackFeatureLayer.popupTemplate = baseTrackPopUpTemplate;
                                }
                            }
                        }).catch(function (error) {
                            console.error('HitTest error: ', error);
                        });
                    });
                    const home = new Home({
                        view: newView,
                    });
                    const zoom = new Zoom({
                        view: newView
                    });
                    const scaleBar = new ScaleBar({
                        view: newView
                    });
                    const legendData = new Legend({
                        view: newView,
                    });
                    const expandLegend = new Expand({
                        view: newView,
                        content: legendData,
                        expandTooltip: "Legend",
                        expanded: true
                    });
                    const basemapGallery = new BasemapGallery({
                        view: newView,
                        container: document.createElement("div")
                    });
                    const bgExpand = new Expand({
                        view: newView,
                        content: basemapGallery,
                        expandTooltip: "BaseMap Gallery",
                    });
                    const layerList = new LayerList({
                        view: newView
                    });
                    const expandLayerList = new Expand({
                        view: newView,
                        content: layerList,
                        expandTooltip: "Layer List",
                    });
                    const expandTableWidget = new Expand({
                        view: newView,
                        content: document.createElement("div"),
                        expandIconClass: "esri-icon-table",
                        expandTooltip: "Feature Table",
                        collapseTooltip: "Collapse Feature Table"
                    });
                    const fullscreen = new Fullscreen({
                        view: newView
                    });
                    // $(document).on('click', function(event) {
                    //     event.preventDefault()
                    //     if ($(event.target).hasClass('esri-icon-zoom-in-fixed') || $(event.target).hasClass('esri-icon-zoom-out-fixed')) {
                    //        setOpacityToOne(screen.id)
                    //     }
                    // });
                    // const print = new Print({
                    //     view: newView,
                    //     printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
                    // });
                    // const bgExpandPrint = new Expand({
                    //     view: newView,
                    //     content: print,
                    //     expandTooltip: "Print Widget",
                    // });
                    newView.popup.watch("visible", (isVisible) => {
                        if (isVisible) {
                            expandLegend.collapse();
                        }
                    });
                    const closePopup = () => {
                        newView.popup.close();
                    };
                    function destroyFeatureTable() {
                        var container = document.getElementById(`layerContainer-${screen.id}`);
                        container.style.display = 'none';
                        expandFlag = false;
                    }
                    // bgExpandPrint.watch("expanded", (expanded) => {
                    //     if (expanded) {
                    //         expandLegend.expanded = false;

                    //     }
                    // });
                    expandTableWidget.watch("expanded", function (expanded) {
                        if (expanded) {
                            expandLegend.collapse();
                            bgExpand.collapse();
                            chartWidgetExpand.collapse();
                            if (screen.id === 4 || screen.id === 6) {
                                expandForId4And6.expanded = false
                            }
                            if (screen.id === 13) {
                                expandForId13.expanded = false
                            }
                        }
                    });
                    expandTableWidget.watch(["expanded", "collapsed"], (expanded, collapsed) => {
                        if (expanded) {
                            closePopup();
                            createFeatureTable(id, newView, featurelayer);
                            expandFlag = true;
                        } else if (collapsed) {
                            destroyFeatureTable();
                        }
                    });
                    reactiveUtils.watch(
                        () => basemapGallery.activeBasemap,
                        () => {
                            const mobileSize = newView.heightBreakpoint === "xsmall" || newView.widthBreakpoint === "xsmall";

                            if (mobileSize) {
                                bgExpand.collapse();
                            }
                        }
                    );

                    function closeTableExpands(currentExpand) {
                        const expandWidgets = [expandLegend, expandTableWidget];
                        expandWidgets.forEach(expand => {
                            if (expand !== currentExpand) {
                                expand.expanded = false;
                            }
                        });
                    }
                    expandLegend.watch("expanded", (isExpanded) => {
                        if (isExpanded) {
                            closePopup();
                            closeTableExpands(expandLegend);
                            chartWidgetExpand.expanded = false;
                        }
                    });
                    expandLayerList.watch('expanded', () => {
                        if (expandLayerList.expanded) {
                            closePopup();
                            expandLegend.expanded = false;
                            expandTableWidget.collapse()
                            closeOtherExpands(expandLayerList);
                            if (screen.id == 4 || screen.id == 6) {
                                expandForId4And6.expanded = false
                            }
                            if (screen.id === 13) {
                                expandForId13.expanded = false
                            }
                            chartWidgetExpand.expanded = false;
                        }
                    });
                    // bgExpandPrint.watch('expanded', () => {
                    //     if (bgExpandPrint.expanded) {
                    //         closePopup();
                    //         closeOtherExpands(bgExpandPrint);
                    //         expandTableWidget.collapse()
                    //         if (screen.id == 4 || screen.id == 6) {
                    //             expandForId4And6.expanded = false
                    //         }
                    //         if (screen.id === 13) {
                    //             expandForId13.expanded = false
                    //         }
                    //     }
                    // });

                    bgExpand.watch('expanded', () => {
                        if (bgExpand.expanded) {
                            closePopup();
                            closeOtherExpands(bgExpand)
                            expandTableWidget.collapse();
                            chartWidgetExpand.expanded = false;
                        }
                    });

                    window.addEventListener('click', (event) => {
                        const elements = [expandLayerList, bgExpand, queryData, yearExpand, assetCount];
                        const isOutsideClick = !elements.some(expand => {
                            return expand && expand.container && expand.container.contains(event.target);
                        });

                        if (isOutsideClick) {
                            closeOtherExpands(null);
                        }
                    });
                    const QueryBuilderContainer = document.createElement("div");
                    const queryData = new Expand({
                        view: newView,
                        content: QueryBuilderContainer,
                        expandIconClass: "custom-expand-icon",
                        expandTooltip: "Query Builder",
                        collapseTooltip: "Collapse Feature Table"
                    });
                    function closeOtherExpands(exceptExpand) {
                        [expandLayerList, bgExpand, queryData, yearExpand, assetCount,].forEach(expand => {
                            if (expand !== exceptExpand) {
                                expand.collapse();
                            }
                        });
                    };
                    queryData.watch('expanded', () => {
                        if (queryData.expanded) {
                            closeOtherExpands(queryData);
                            closePopup();
                            expandTableWidget.collapse()
                            if (screen.id == 4 || screen.id == 6) {
                                expandForId4And6.expanded = false
                            }
                            if (screen.id === 13) {
                                expandForId13.expanded = false
                            }
                            chartWidgetExpand.expanded = false;
                        }
                    });
                    queryData.watch("expanded", (expanded) => {
                        if (expanded) {
                            expandLegend.expanded = false;
                        }
                    });
                    const yearContainer = document.createElement("div")
                    const yearExpand = new Expand({
                        view: newView,
                        content: yearContainer,
                        expandIconClass: "esri-icon-layer-list",
                        expandTooltip: "Year Wise Query",
                    });
                    yearExpand.watch('expanded', () => {
                        if (yearExpand.expanded) {
                            closePopup();
                            closeOtherExpands(yearExpand);
                            if (screen.id == 4 || screen.id == 6) {
                                expandForId4And6.expanded = false
                            }
                            if (screen.id === 13) {
                                expandForId13.expanded = false
                            }
                            expandLegend.expanded = false;
                            chartWidgetExpand.expanded = false;
                        }
                    });
                    yearExpand.watch("expanded", (expanded) => {
                        if (expanded) {

                        }
                    });
                    const AssetCountContainer = document.createElement("div");
                    const assetCount = new Expand({
                        view: newView,
                        content: AssetCountContainer,
                        expandIconClass: "esri-icon-description",
                        expandTooltip: "Asset Info",
                    });
                    const ChartContainer = document.createElement("div");
                    const chartWidgetExpand = new Expand({
                        view: newView,
                        content: ChartContainer,
                        expandIconClass: "custom-expand-chart-icon",
                        expandTooltip: "Chart",
                    })

                    let id = screen.id;
                    let title = screen.title;
                    let newMapObj = { id, title, newView, checked: true };
                    setMapObject(prevMapObj => [...prevMapObj, newMapObj]);
                    const renderYearWiseQuery = () => {
                        const div = document.createElement("div");
                        const root = ReactDOM.createRoot(div);
                        root.render(
                            <YearWiseQuery
                                id={screen.id}
                                layer={screen.id === 4 || screen.id === 6 || screen.id === 12 ? featurelayer : null}
                                title={screen.id === 12 ? "OMS Repeated" : screen.title}
                                view={screen.id === 12 ? newView : null}
                                omsLayerSelectedRef={omsLayerSelectedRef}
                                featuretables={featureTables}
                                destroyFeatureTable={destroyFeatureTable}

                            />
                        );
                        return div;
                    };
                    if (screen.id === 4 || screen.id === 6 || screen.id === 12) {
                        yearContainer.appendChild(renderYearWiseQuery());
                    }
                    const queryBuilder = () => {
                        const div = document.createElement("div");
                        const root = ReactDOM.createRoot(div);
                        root.render(
                            <QueryBuilder
                                newMapObj={newMapObj}
                                layer={featurelayer}
                                id={id}
                                geometry={geometry}
                                SpatialReference={SpatialReference}
                                startLoaderForQueryBuilder={startLoaderForQueryBuilder}
                                stopLoaderForQueryBuilder={stopLoaderForQueryBuilder}
                            />
                        );
                        return div;
                    };
                    QueryBuilderContainer.appendChild(queryBuilder());

                    assetCount.watch("expanded", async (expanded) => {
                        if (expanded) {
                            try {

                                let screenAsset = assetCountOfScreens.filter(acs => acs.id === screen.id)[0]
                                if (id === 4 || id === 6) {
                                    screenAsset = await getYears(featurelayer, screenAsset);
                                }
                                let fQuery = JSON.parse(sessionStorage.getItem("finalQuery"));
                                closePopup();
                                closeOtherExpands(assetCount);
                                expandTableWidget.collapse()
                                expandLegend.expanded = false;
                                chartWidgetExpand.expanded = false;
                                if (screen.id == 4 || screen.id == 6) {
                                    expandForId4And6.expanded = false
                                }
                                if (screen.id === 13) {
                                    expandForId13.expanded = false
                                }
                                ReactDOM.render(
                                    <AssetCount
                                        newMapObj={newMapObj}
                                        asset={screenAsset}
                                        featureLayer={featurelayer}
                                        nbmlFeatureLayer={screen.id === 11 ? nbmlFeatureLayer : null}
                                        finalQuery={fQuery}
                                        eventDataStatus={eventDataStatus.filter(f => f.kpi_name === screen.value)}
                                    />,
                                    assetCount.content
                                );
                            } catch (error) {
                                console.log(error)
                            }

                        }
                    });
                    if (screen.id !== 12 && screen.id !== 16) {
                        newView.ui.add(queryData, "top-right");
                    }
                    newView.ui.add(zoom, "top-left");
                    newView.ui.add(home, "top-left");
                    newView.ui.add(fullscreen, "top-left");
                    newView.ui.add(expandLayerList, "top-right");
                    // newView.ui.add(bgExpandPrint, "top-right");
                    if (screen.id === 4 || screen.id === 6 || screen.id === 12) {
                        newView.ui.add(yearExpand, "top-right");
                    }
                    newView.ui.add(assetCount, "top-right")
                    if (screen.id === 2 || screen.id === 3 || screen.id === 4 || screen.id === 6 || screen.id === 8 || screen.id === 9 || screen.id === 11 || screen.id === 12) {
                        newView.ui.add(chartWidgetExpand, "top-right")
                    }
                    newView.ui.add(expandTableWidget, "top-left");
                    newView.ui.add(bgExpand, "top-left");
                    if (screen.id !== 4 && screen.id !== 6 && screen.id !== 13) {
                        newView.ui.add(expandLegend, "bottom-right");
                    }
                    newView.ui.add(scaleBar, "bottom-left");
                    await newView.when();
                    if (userData.role === "org_admin") {
                        newView.extent = indiaExtent;
                    } else {
                        newView.extent = featurelayer.fullExtent;
                    }
                    newView.on("click", () => {
                        if (assetCount.expanded) {
                            assetCount.collapse();
                        }
                    });
                    function closeAssetCount() {
                        if (assetCount.expanded) {
                            assetCount.collapse();
                        }
                    }
                    function addClickListener(widget) {
                        widget.on("click", closeAssetCount);
                    }
                    if (screen.id === 13) {
                        newView.watch("zoom", () => {
                            let storedQuery = JSON.parse(sessionStorage.getItem("finalQuery"));
                            let bridgeQuery = storedQuery.filter(f => f.id === 13)[0].query;
                            addCircularBoundaries(featurelayer, newView, newView.scale, cQuery, bridgeQuery);
                        });
                    }

                    chartWidgetExpand.watch("expanded", async (expanded) => {
                        if (expanded) {

                            try {
                                let fQuery = JSON.parse(sessionStorage.getItem("finalQuery"));
                                let cQuery = fQuery.filter(f => f.id === 16)[0].query;
                                let bQuery = fQuery.filter(f => f.id === id)[0].query;
                                let years = fQuery.filter(f => f.id === id)[0].years;
                                closePopup();
                                closeOtherExpands(chartWidgetExpand);
                                expandTableWidget.collapse()
                                expandLegend.expanded = false;
                                if (screen.id == 4 || screen.id == 6) {
                                    expandForId4And6.expanded = false
                                }
                                if (screen.id === 13) {
                                    expandForId13.expanded = false
                                }
                                ReactDOM.render(
                                    <Chart
                                        newMapObj={newMapObj}
                                        layer={featurelayer}
                                        layer2={screen.id === 11 ? nbmlFeatureLayer : null}
                                        id={id}
                                        cQuery={cQuery}
                                        bQuery={bQuery}
                                        years={years}
                                    />,
                                    chartWidgetExpand.content
                                );
                            } catch (error) {
                                console.log(error)
                            }

                        }
                    });
                    const widgetsToMonitor = [yearExpand, expandTableWidget, expandLayerList, queryData];
                    widgetsToMonitor.forEach(addClickListener);
                    if (screen.id === 15) {
                        createFeatureTable(screen.id, newView, featurelayer);
                        let fields = [
                            "",
                            "railway",
                            "division",
                            "section",
                            "from_km",
                            "from_m",
                            "to_km",
                            "to_m",
                            "bridge_no_",
                            "category",
                            "structure_type",
                            "span_configuration",
                            "type_of_foundation",
                            "name_of_river",
                            "hfl",
                            "danger_level"]
                        exportFeatureTable(featureTable, fields);
                        setTimeout(() => {
                            destroyFeatureTable();
                        }, 400)
                    }
                    if (screen.id === 16) {
                        createFeatureTable(screen.id, newView, featurelayer);
                        let fields = [
                            "objectid",
                            "path",
                            "name",
                            "datetime",
                            "direction",
                            "x",
                            "y",
                            "z",
                        ]
                        exportFeatureTable(featureTable, fields);
                        // destroyFeatureTable();
                    }
                    let layerView;
                    if (screen.id === 11) {
                        layerView = await newView.whenLayerView(nbmlFeatureLayer);
                    } else {
                        layerView = await newView.whenLayerView(featurelayer);
                    }
                    const handle = layerView.watch("updating", (updating) => {
                        if (!updating) {
                            stopLoaderForScreen(screen.id);
                            $(`#viewDiv-${screen.id}`).css("opacity", "1")
                            $(`#viewDiv-${screen.id}`).css("pointer-events", "auto");
                            handle.remove();
                        }
                    });
                }
            });
            prevScreensRef.current = screens;
        };
        if (userData) {
            loadMapForNewScreens();
        }
    }, [screens, mapObject]);
    //#endregion
    //#region Filter Zone Division Route Section KM_Post Date 
    useEffect(() => {
        const getFeaturesAndZoom = async () => {
            let railwayQuery = "";
            let divisionQuery = "";
            let sectionQuery = "";
            let finalQuery = "";
            let storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
            const isAdmin = userData.role == 'org_admin' ? true : false;
            if (railwayNames && railwayNames.filter(sc => sc.isSelected === true).length > 0) {
                const allSelected = railwayNames.some(sc => sc.label === "All" && sc.isSelected === true);
                if (isAdmin) {
                    if (!allSelected) {
                        const selectedValues = railwayNames
                            .filter(sc => sc.isSelected === true && sc.label !== "All")
                            .map(sc => sc.value);

                        if (selectedValues.length > 0) {
                            railwayQuery = "railway in ('" + selectedValues.join("','") + "')";
                        }
                    }
                } else {
                    const selectedValues = railwayNames
                        .filter(sc => sc.isSelected === true && sc.label !== "All")
                        .map(sc => sc.value);

                    if (selectedValues.length > 0) {
                        railwayQuery = "railway in ('" + selectedValues.join("','") + "')";
                    }
                }
            }
            if (divisionNames && divisionNames.filter(sc => sc.isSelected === true).length > 0) {
                const allSelected = divisionNames.some(sc => sc.label === "All" && sc.isSelected === true);
                if (isAdmin) {
                    if (!allSelected) {
                        const selectedValues = divisionNames
                            .filter(sc => sc.isSelected === true && sc.label !== "All")
                            .map(sc => sc.value);

                        if (selectedValues.length > 0) {
                            divisionQuery = "division in ('" + selectedValues.join("','") + "')";
                        }
                    }
                } else {
                    const selectedValues = divisionNames
                        .filter(sc => sc.isSelected === true && sc.label !== "All")
                        .map(sc => sc.value);

                    if (selectedValues.length > 0) {
                        divisionQuery = "division in ('" + selectedValues.join("','") + "')";
                    }
                }
            }
            if (sectionNames && sectionNames.filter(sc => sc.isSelected === true).length > 0) {
                const allSelected = sectionNames.some(sc => sc.label === "All" && sc.isSelected === true);
                if (!allSelected) {
                    const selectedValues = sectionNames
                        .filter(sc => sc.isSelected === true && sc.label !== "All")
                        .map(sc => sc.value);

                    if (selectedValues.length > 0) {
                        sectionQuery = "section in ('" + selectedValues.join("','") + "')";
                    }
                }
            }
            for (const screen of mapObject) {
                let screen_Id = screen.id;
                let screen_titel = screen.title;
                let newView = screen.newView;
                const baseLayer = screen.newView.map.allLayers.items[1];
                const stationLayer = screen.newView.map.allLayers.items[2];
                let nbmlLayer;
                if (screen.id === 11) {
                    nbmlLayer = screen.newView.map.allLayers.items[4];
                }
                let filterLayer = screen.newView.map.allLayers.items.filter(ly => operationalLayers.map(olyr => olyr.name).includes(ly.title));
                if (filterLayer.length > 0) {
                    finalQuery = [railwayQuery, divisionQuery, sectionQuery].filter(Boolean).join(" AND ");
                    let finalQuery2 = "";
                    if (screen_Id === 14) {
                        finalQuery2 = finalQuery !== "" ? `${finalQuery} AND ${monsoonQuery}` : monsoonQuery;
                    }
                    if (finalQuery) {
                        if (finalQuery2 !== "") {
                            if (storedQueryObject) {
                                const updatedQueryObject = storedQueryObject.map(item =>
                                    item.id === 16 ? { ...item, query: finalQuery2 } : item
                                );
                                sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
                            }
                        } else {
                            if (storedQueryObject) {
                                const updatedQueryObject = storedQueryObject.map(item =>
                                    item.id === 16 ? { ...item, query: finalQuery } : item
                                );
                                sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
                            }
                        }
                    } else {
                        if (storedQueryObject) {
                            const updatedQueryObject = storedQueryObject.map(item =>
                                item.id === 16 ? { ...item, query: "" } : item
                            );
                            sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
                        }
                    }
                    if (!finalQuery)
                        finalQuery = "1=1";
                    baseLayer.definitionExpression = finalQuery;
                    stationLayer.when(() => {
                        if (stationLayer.sublayers) {
                            stationLayer.sublayers.forEach(sublayer => {
                                sublayer.definitionExpression = finalQuery;
                            });
                        }
                    })
                    filterLayer[0].definitionExpression = screen.id === 14 ? finalQuery2 : finalQuery;
                    if (nbmlLayer)
                        nbmlLayer.definitionExpression = finalQuery;
                    if (filterLayer[0] && filterLayer[0].type !== 'feature') {
                        return
                    }
                    const query = filterLayer[0].createQuery();
                    query.where = finalQuery;
                    const layerView = await newView.whenLayerView(filterLayer[0]);
                    const handle = layerView.watch("updating", async (updating) => {
                        if (!updating) {
                            try {
                                let results;

                                results = await filterLayer[0].queryFeatures(query);
                                let features = results.features;
                                if (features.length !== 0) {
                                    let featureExtent;
                                    if (features[0].geometry.type === "point") {
                                        const validFeatures = features.filter(feature => {
                                            const geometry = feature.geometry;
                                            return geometry && ((geometry.type === "point" && geometry.x !== 0 && geometry.y !== 0) ||
                                                (geometry.type !== "point" && geometry.extent));
                                        });

                                        const geometries = validFeatures.map(feature => feature.geometry);
                                        if (geometries.length > 1) {
                                            featureExtent = geometryEngine.union(geometries).extent;
                                        } else if (geometries.length === 1) {
                                            const pointGeometry = geometries[0];
                                            const pointLat = pointGeometry.latitude;
                                            const pointLon = pointGeometry.longitude;

                                            const point = new Point({
                                                latitude: pointLat,
                                                longitude: pointLon,
                                                spatialReference: { wkid: 4326 }
                                            });

                                            const buffer = 0.8;

                                            featureExtent = new geometry.Extent({
                                                xmin: point.longitude - buffer,
                                                ymin: point.latitude - buffer,
                                                xmax: point.longitude + buffer,
                                                ymax: point.latitude + buffer,
                                                spatialReference: { wkid: 4326 }
                                            });
                                        }
                                    } else {
                                        featureExtent = features.filter(f => f.geometry.paths[0].length > 0).reduce((extent, feature) => {
                                            return extent ? extent.union(feature.geometry.extent) : feature.geometry.extent;
                                        }, null);
                                    }

                                    if (featureExtent) {
                                        const paddingFactor = 0.005; // Adjust this factor as needed for less zoom
                                        const expandedExtent = featureExtent.expand(1 + paddingFactor);
                                        screen.newView.goTo(expandedExtent);
                                    }
                                } else {
                                    setAlertObject({ screenId: screen_Id, title: screen_titel })
                                    showAlert();

                                }
                            } catch (error) {
                                console.error("Error querying features: ", error);
                            }
                            handle.remove();
                        }
                    });
                }
            }
        }
        if (screens[0].label !== "") {
            getFeaturesAndZoom();
        }
        // }, [mapObject]);
    }, [mapObject, sectionNames, railwayNames, divisionNames]);
    const handleFilterZoneDivSecRoute = () => {
        if (screens[0].value === "") {
            return toast("Please Select Track or Bridge Insights Screens")
        }
        setOpenZoneDivFilter(!openZoneDivFilter);
        setUserProfileDropdown(false);
    };
    const handleZoneDivSecRouteClose = () => {
        setOpenZoneDivFilter(false);
    };
    const handleResetFilterZoneDivRoute = () => {
        setRailwayZone(railwayNames.filter(f => f.value !== "All").map(rn => rn.value));
        setRailwayDivision([]);
        setRailwaySection([]);
        let storedQueryObject = JSON.parse(sessionStorage.getItem("finalQuery"));
        if (storedQueryObject) {
            const updatedQueryObject = storedQueryObject.map(item =>
                item.id === 16 ? { ...item, query: "" } : item
            );
            sessionStorage.setItem("finalQuery", JSON.stringify(updatedQueryObject));
        }
        setRailwayNames(prev => {
            let sValue = prev.map((f) => ({ ...f, isSelected: true }));
            return sValue;
        });
        setRailwayDivision(prev => {
            let sValue = prev.map((f) => ({ ...f, isSelected: false }));
            return sValue;
        });

        setRailwaySection(prev => {
            let sValue = prev.map((f) => ({ ...f, isSelected: false }));
            return sValue;
        });
        for (const screen of mapObject) {
            let filterLayer = screen.newView.map.allLayers.items.filter(ly => operationalLayers.map(olyr => olyr.name).includes(ly.title))
            if (filterLayer.length > 0) filterLayer[0].definitionExpression = "1=1";
            screen.newView.extent = indiaExtent;
        }
    };
    //#endregion
    //#region Handle Zone Select 
    const handleZoneDropDown = () => {
        setZoneDropDown(!zoneDropDown);
        setDivisionDropDown(false);
        setSectionDropDown(false);
    };
    const handleRailZoneSelect = (item) => (event) => {
        let selectedValue = item.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateRailways(selectedValue, isChecked, railwayNames, railwayZone)
        setRailwayNames(updatedValuesFromLayer)
        setRailwayZone(selectedValues)
        setRailwayDivision([]);
        setRailwaySection([]);
    };
    const closeRailwayZoneDropdown = () => {
        setZoneDropDown(false);
    }
    //#endregion
    //#region Handle Division Select 
    const handleDiviDropDown = () => {
        setDivisionDropDown(!divisionDropDown);
        setZoneDropDown(false);
        setSectionDropDown(false);

    };
    const handleDivisionSelect = (item) => (event) => {
        let selectedValue = item.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateRailways(selectedValue, isChecked, divisionNames, railwayDivision)
        setDivisionNames(updatedValuesFromLayer)
        setRailwayDivision(selectedValues)
        setRailwaySection([])
    };
    const closeDivisionDropdown = () => {
        setDivisionDropDown(false)
    }
    //#endregion
    //#region Handle Section Select 
    const handleSectionDropDown = () => {
        setSectionDropDown(!sectionDropDown);
        setZoneDropDown(false);
        setDivisionDropDown(false);
    };
    const handleSectionSelect = (item) => (event) => {
        let selectedValue = item.value;
        let isChecked = event.target.checked;
        const { updatedValuesFromLayer, selectedValues } = updateRailways(selectedValue, isChecked, sectionNames, railwaySection)
        setSectionNames(updatedValuesFromLayer);
        setRailwaySection(selectedValues);
    };
    const closeSectionDropdown = () => {
        setSectionDropDown(false);
    }
    //#endregion
    const generateRenderer = async (view, layer, field) => {
        await Promise.all([layer.load()]);
        const typeParams = {
            layer: layer, //Layer
            view: view,
            field: field, // Field Name 
            legendOptions: {
                title: `${formatTitle(field)}`
            }
        };
        typeRendererCreator
            .createRenderer(typeParams)
            .then((response) => {
                layer.renderer = response.renderer;
            })
            .catch((error) => {
                console.error("there was an error: ", error);
            });
    };
    //Hideing the Custome Filter
    useEffect(() => {
        let mapScreen = document.getElementsByClassName("splitScreen-Mainscreen");
        let header = document.getElementsByClassName("splitScreen-Header-Two-ScreenDivision");
        let headerOne = document.getElementsByClassName("splitScreen-Header-One");
        const handleClickeOutSide = () => {
            setOpenZoneDivFilter(false);
            setUserProfileDropdown(false);
        };
        Array.from(mapScreen).forEach(element => {
            element.addEventListener("click", handleClickeOutSide);
        });
        Array.from(header).forEach(element => {
            element.addEventListener("click", handleClickeOutSide)
        })
        Array.from(headerOne).forEach(element => {
            element.addEventListener("click", handleClickeOutSide)
        })
        return () => {
            Array.from(mapScreen).forEach(element => {
                element.removeEventListener("click", handleClickeOutSide);
            });
            Array.from(header).forEach(element => {
                element.removeEventListener("click", handleClickeOutSide);
            });
            Array.from(headerOne).forEach(element => {
                element.removeEventListener("click", handleClickeOutSide);
            });
        }
    }, []);
    const esriPopUpUpdateSizes = () => {
        let mapdivHeight = document.getElementsByClassName("mapView-div")[0].offsetHeight;
        if (mapdivHeight < 435) {
            $('.esri-popup__content').css('height', '75px');
        } else {
            $('.esri-popup__content').css('height', '289px');
        }
    };
    //#endregion

    const handleUserProfile = () => {
        setUserProfileDropdown(!userProfileDropdown);
        setOpenZoneDivFilter(false);
        setTrackDropdown(false)
        setBridgeDropdown(false);
    }
    return (
        <>
            {
                isOpenLogModal &&
                <Modal
                    open={isOpenLogModal}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <LogoutModal
                        handleLogout={handleLogout}
                        setIsOpenLogModal={setIsOpenLogModal}
                    />
                </Modal>
            }
            <div className="splitScreen-Container">
                <div className="splitScreen-Row">
                    <div className="splitScreen-RowOne">
                        <div className="splitScreen-Header">
                            <div className="splitScreen-Header-One">
                                <div className="splitScreen-Header-One-TagImage">
                                    <img className="imgTagName" src="/cris_lrs/images/crisTag.png" alt="CrisTag.png" />
                                </div>
                                <div className="splitScreen-Header-One-TagName">
                                    <h3>Dynamic Analysis Dashboard</h3>
                                </div>
                            </div>
                            <div className="splitScreen-Header-Two">
                                <div className="splitScreen-Header-Two-ScreenDivision">
                                    <div className="trackdropDown" ref={trackInsightesDropdownRef} >
                                        <button
                                            className='btndropTrackBridge'
                                            id="btnDropDown"
                                            onClick={handleTrackInsightesDropdown}
                                        >
                                            <span>Track Insights</span>
                                            <svg width="30px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                <g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z" fill="#015cb2" /> </g>
                                            </svg>
                                        </button>
                                        {
                                            trackDropdown &&
                                            <div className="trackDropDownContent">
                                                {
                                                    trackInsightes && trackInsightes.map((item, index) => (
                                                        <label
                                                            key={index}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={item.value}
                                                                onChange={handleTrackInsightes(item)}
                                                                checked={screens.length <= 9 ? item.checked : false}
                                                                style={{ marginRight: "8px" }}
                                                            />
                                                            {item.label}
                                                        </label>
                                                    ))
                                                }
                                            </div>
                                        }
                                    </div>
                                    <div className="bridgeDropDown" ref={bridgeInsightesDropdownRef}>
                                        <button
                                            className='btndropTrackBridge'
                                            id="btnDropDown"
                                            onClick={handleBridgeInsightesDropdown}
                                        >
                                            <span>Bridge Insights</span>
                                            <svg width="30px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                <g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z" fill="#015cb2" /> </g>
                                            </svg>
                                        </button>
                                        {
                                            bridgeDropdown &&
                                            <div className="bridgeDropDownContent">
                                                {
                                                    bridgeInsightes && bridgeInsightes.map((bridgeItem, index) => (
                                                        <label
                                                            key={index}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={bridgeItem.value}
                                                                onChange={handleBridgeInsightes(bridgeItem)}
                                                                checked={screens.length <= 9 ? bridgeItem.checked : false}
                                                                style={{ marginRight: "8px" }}
                                                            />
                                                            {bridgeItem.label}
                                                        </label>
                                                    ))
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="splitScreen-Header-Two-FilterDropdown">
                                    <div className='mapSyncUnsync'>
                                        <span>Map Sync</span>
                                        <BlueSwitch
                                            title="Map Sync/UnSync"
                                            checked={isSyncEnabled}
                                            onChange={handleSyncUnSyncMap}
                                            color="warning"
                                            className={`mapSyncSwitcher ${screens.length < 2 ? "opacity" : ""} small-switch`}
                                        />
                                    </div>
                                    <img className={`filterIcon filterIcon1024 ${screens[0].value === "" ? "opacity" : ""}`} title='Filter' src="/cris_lrs/images/filter.png" alt="filter.png" onClick={handleFilterZoneDivSecRoute} />
                                    {
                                        openZoneDivFilter &&
                                        <div className="filterZoneDivSecRoute">
                                            <div className="filterZonedivSecRoute-Header">
                                                <h3>Filter</h3><span onClick={handleZoneDivSecRouteClose}>X</span>
                                            </div>
                                            <div className="filterZoneDivSecRoute-Content">
                                                <div className="dropdown">
                                                    <span>Zone :</span>
                                                    <div className="multiSelect" ref={zoneDropdownRef} >
                                                        <button onClick={handleZoneDropDown}>
                                                            <div className='selectedOption'>
                                                                {railwayZone.length > 0 ? (
                                                                    <>
                                                                        {userData && userData.zone !== "" ? (
                                                                            <>
                                                                                {
                                                                                    railwayZone.map((railIn, index) => (
                                                                                        <span key={index} className='displayValue'>{railIn}</span>
                                                                                    ))
                                                                                }
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {areAllValuesSelected(railwayNames, railwayZone) ? (
                                                                                    <span key="all" className='displayValue'>All</span>
                                                                                ) : (
                                                                                    railwayZone.map((railIn, index) => (
                                                                                        <span key={index} className='displayValue'>{railIn}</span>
                                                                                    ))
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <span>Select Value</span>
                                                                )}
                                                            </div>
                                                            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z" fill="#000000" />
                                                            </svg>
                                                        </button>
                                                        {
                                                            zoneDropDown &&
                                                            <div className="multiOptions">
                                                                <div className="optionsDiv">
                                                                    <div className="optionLabel">
                                                                        {
                                                                            railwayNames && railwayNames.map((item, index) => (
                                                                                <label
                                                                                    key={index}
                                                                                    style={{
                                                                                        pointerEvents: `${railwayNames.length === 1 ? "none" : "auto"}`,
                                                                                        opacity: `${railwayNames.length === 1 ? "0.7" : "1"}`
                                                                                    }}
                                                                                >
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        value={item.value}
                                                                                        onChange={handleRailZoneSelect(item)}
                                                                                        checked={item.isSelected}
                                                                                    />
                                                                                    {item.label}
                                                                                </label>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <UpArrowButton closeDropdown={closeRailwayZoneDropdown} className="railwayUpArrow" />
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="dropdown">
                                                    <span>Division :</span>
                                                    <div className="multiSelect" ref={divisionDropdownRef} >
                                                        <button onClick={handleDiviDropDown}>
                                                            <div className='selectedOption'>
                                                                {railwayDivision.length > 0 ? (
                                                                    <>
                                                                        {
                                                                            userData && userData.division !== "" ? (
                                                                                <>
                                                                                    {
                                                                                        railwayDivision.map((railIn, index) => (
                                                                                            <span key={index} className='displayValue'>{railIn}</span>
                                                                                        ))
                                                                                    }
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    {areAllValuesSelected(divisionNames, railwayDivision) ? (
                                                                                        <span key="all" className='displayValue'>All</span>
                                                                                    ) : (
                                                                                        railwayDivision.map((railIn, index) => (
                                                                                            <span key={index} className='displayValue'>{railIn}</span>
                                                                                        ))
                                                                                    )}
                                                                                </>
                                                                            )
                                                                        }
                                                                    </>
                                                                ) : (
                                                                    <span>Select Value</span>
                                                                )}
                                                            </div>
                                                            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z" fill="#000000" />
                                                            </svg>
                                                        </button>
                                                        {
                                                            divisionDropDown &&
                                                            <div className="multiOptions">
                                                                <div className="optionsDiv">
                                                                    <div className="optionLabel">
                                                                        {
                                                                            divisionNames && divisionNames.map((item, index) => (
                                                                                <label
                                                                                    key={index}
                                                                                    style={{
                                                                                        pointerEvents: `${divisionNames.length === 1 ? "none" : "auto"}`,
                                                                                        opacity: `${divisionNames.length === 1 ? "0.7" : "1"}`
                                                                                    }}
                                                                                >
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        value={item.value}
                                                                                        onChange={handleDivisionSelect(item)}
                                                                                        checked={item.isSelected}
                                                                                    />
                                                                                    {item.label}
                                                                                </label>
                                                                            ))
                                                                        }</div>
                                                                </div>
                                                                <UpArrowButton closeDropdown={closeDivisionDropdown} />
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="dropdown">
                                                    <span>Section :</span>
                                                    <div className="multiSelect " ref={sectionDropdownRef} >
                                                        <button onClick={handleSectionDropDown}>
                                                            <div className='selectedOption'>
                                                                {railwaySection.length > 0 ? (
                                                                    <>
                                                                        {areAllValuesSelected(sectionNames, railwaySection) ? (
                                                                            <span key="all" className='displayValue'>All</span>
                                                                        ) : (
                                                                            railwaySection.map((railIn, index) => (
                                                                                <span key={index} className='displayValue'>{railIn}</span>
                                                                            ))
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <span>Select Value</span>
                                                                )}
                                                            </div>
                                                            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z" fill="#000000" />
                                                            </svg>
                                                        </button>
                                                        {
                                                            sectionDropDown &&
                                                            <div className="multiOptions">
                                                                <div className="optionsDiv">
                                                                    <div className="optionLabel">
                                                                        {
                                                                            sectionNames && sectionNames.map((item, index) => (
                                                                                <label
                                                                                    key={index}
                                                                                >
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        value={item.value}
                                                                                        onChange={handleSectionSelect(item)}
                                                                                        checked={item.isSelected}
                                                                                    />
                                                                                    {item.label}
                                                                                </label>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <UpArrowButton closeDropdown={closeSectionDropdown} />
                                                            </div>
                                                        }
                                                    </div>
                                                </div>

                                                <div className="dropdownBtnDvi">
                                                    <button className='btnQuery' onClick={handleResetFilterZoneDivRoute}>Reset</button>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <svg onClick={handleUserProfile} className='userSVG' style={{ cursor: "pointer" }} width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                        <g id="SVGRepo_iconCarrier"> <circle cx="12" cy="9" r="3" stroke="#ffffff" strokeWidth="1.5" /> <circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="1.5" /> <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" /> </g>
                                    </svg>
                                    {
                                        userProfileDropdown &&
                                        <div className="userLoginDiv">
                                            <div className="userLogHead">
                                                <span>User</span>
                                            </div>
                                            <div className="userDiv">
                                                <section className='svg_span_section sec1'>
                                                    <svg className='userSVG' width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                        <g id="SVGRepo_iconCarrier"> <circle cx="12" cy="9" r="3" stroke="#9b9b9b" strokeWidth="1.5" /> <circle cx="12" cy="12" r="10" stroke="#9b9b9b" strokeWidth="1.5" /> <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="#9b9b9b" strokeWidth="1.5" strokeLinecap="round" /> </g>
                                                    </svg>
                                                    <span>{capitalizeFirstLetter(userData?.user)}</span>
                                                </section>
                                            </div>
                                            <div className="userDiv">
                                                <section className='svg_span_section' onClick={openLogoutMOdal} style={{ cursor: "pointer" }}>
                                                    <svg className='logoutSVG' style={{ cursor: "pointer" }} title="Logout" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#9b9b9b">
                                                        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokelinejoin="round" />
                                                        <g id="SVGRepo_iconCarrier"> <path d="M21 12L13 12" stroke="#9b9b9b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9" stroke="#9b9b9b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19" stroke="#9b9b9b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> </g>
                                                    </svg>
                                                    <span>LogOut</span>
                                                </section>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="splitScreen-RowTwo">
                        <div className={`splitScreen-Mainscreen grid-${numRows}-${numCols}`}>
                            {
                                screens && screens.map((item, index) => (
                                    <div
                                        className='mapView-div'
                                        id={`viewDiv-${item.id}`}
                                        key={item.id}
                                        style={{
                                            border: '2px solid white',
                                            margin: "2px"
                                        }}
                                    >
                                        {
                                            item.label &&
                                            <div id={item.id} className='mapView-div-header'
                                                draggable
                                                onDragStart={(event) => handleDragStart(event, index)}
                                                onDragOver={(event) => handleDragOver(event, index)}
                                                onDrop={(event) => handleDrop(event, index)}
                                            >
                                                <h3>{item.label}</h3>
                                                <span
                                                    onClick={() => handleCloseMapDiv(item.id)}
                                                >X</span>
                                            </div>
                                        }
                                        <div className='screenLoader'>
                                            {
                                                loadingStatesForScreen[item.id] && <Loader />
                                            }
                                        </div>
                                        <div className="queryBuilderLoader">
                                            {
                                                loadingStatesForQueryBuilder[item.id] && <Loader />
                                            }
                                        </div>
                                        <div className='alertDiv'>
                                            {
                                                isAlertDisplay && alertObject.screenId === item.id &&
                                                <div className={`alertDivInside`}>
                                                    <p>{alertObject.title} has no data</p>
                                                </div>
                                            }
                                        </div>
                                        <div className="layerContainer" id={`layerContainer-${item.id}`}>
                                            <div className="tableDiv" id={`tableDiv-${item.id}`}></div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SplitScreen;  