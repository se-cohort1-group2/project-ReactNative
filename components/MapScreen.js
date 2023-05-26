import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Alert, Image, Pressable } from "react-native";

import * as Location from "expo-location";
import MapView, { Marker, Polygon, Polyline, Callout } from "react-native-maps";
import { getDistance, getCenterOfBounds, isPointInPolygon } from "geolib";
import DropDownPicker from "react-native-dropdown-picker";

import funcGetPlanningAreaStatic from "./funcGetPlanningAreaStatic";
import TaxiStand from "./TaxiStand";
const taxiCountData = require("./TaxiCount.json");
const taxiAvailability = require("./TaxiAvailability.json");

export default function MapScreen({ JumpToLatitude, JumpToLongitude, setJumpToLatitude, setJumpToLongitude, selectedLocations, setSelectedLocations, navigation }) {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [currentSelection, setCurrentSelection] = useState(null);

    //Set initial view
    const [center, setCenter] = useState([1.343, 103.814]);
    const camera = {
        center: {
            latitude: center[0],
            longitude: center[1],
        },
        pitch: 2,
        heading: 20,
        altitude: 50000, // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
        zoom: 12 // Only when using Google Maps.
    }

    //DropdownPicker
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { disabled: true, label: "Central Region", value: "central" },
        { parent: "central", label: "GEYLANG", value: "GEYLANG" },
        { parent: "central", label: "KALLANG", value: "KALLANG" },
        { parent: "central", label: "ROCHOR", value: "ROCHOR" },
        { parent: "central", label: "NEWTON", value: "NEWTON" },
        { parent: "central", label: "ORCHARD", value: "ORCHARD" },
        { parent: "central", label: "DOWNTOWN CORE", value: "DOWNTOWN CORE" },

        { disabled: true, label: "East Region", value: "east" },
        { parent: "east", label: "PASIR RIS", value: "PASIR RIS" },
        { parent: "east", label: "TAMPINES", value: "TAMPINES" },
        { parent: "east", label: "BEDOK", value: "BEDOK" },

        { disabled: true, label: "North-East Region", value: "northeast" },
        { parent: "northeast", label: "ANG MO KIO", value: "ANG MO KIO" },
        { parent: "northeast", label: "SERANGOON", value: "SERANGOON" },
        { parent: "northeast", label: "HOUGANG", value: "HOUGANG" },
        { parent: "northeast", label: "SENGKANG", value: "SENGKANG" },

        { disabled: true, label: "North Region", value: "north" },
        { parent: "north", label: "WOODLANDS", value: "WOODLANDS" },
        { parent: "north", label: "YISHUN", value: "YISHUN" },

        { disabled: true, label: "West Region", value: "west" },
        { parent: "west", label: "JURONG WEST", value: "JURONG WEST" },
        { parent: "west", label: "CLEMENTI", value: "CLEMENTI" },
        { parent: "west", label: "BUKIT BATOK", value: "BUKIT BATOK" },
        { parent: "west", label: "BUKIT PANJANG", value: "BUKIT PANJANG" },
        { parent: "west", label: "CHOA CHU KANG", value: "CHOA CHU KANG" },
    ]);

    //Planning area
    const [AreaPolygonList, setAreaPolygonList] = useState([]);
    const [polygon, setPolygon] = useState([
        {
            latitude: 1.343,
            longitude: 103.814
        }
    ]);

    //Taxi count
    const [taxisAvailable, setTaxisAvailable] = useState(0);

    // //takes too long to iterate through
    // function logMapElements(value1, key, map) {
    //     let taxiCount = 0;
    //         taxiAvailability.value.forEach(stand => {
    //             if (isPointInPolygon({ latitude: stand.Latitude, longitude: stand.Longitude }, value1)) {
    //                 taxiCount += 1;
    //             }
    //         })
    //     console.log(key + ": " + taxiCount);
    // }

    // //Count taxis in polygon
    // function testFunction() {
    //     const map1 = new Map();
    //     AreaPolygonList.forEach(area => {
    //         map1.set(area.pln_area_n, handlerSelectArea(area.pln_area_n));
    //     })
    //     map1.forEach(logMapElements);
    // }

    //Handler to display polygon for selected area
    const handlerSelectArea = (id) => {
        const foundIndex = AreaPolygonList.findIndex((item) => item.pln_area_n === id);
        const parsedGeoJson = JSON.parse(AreaPolygonList[foundIndex].geojson);
        let swapCoord = parsedGeoJson.coordinates.map((coordSet1) => {
            let swapCoordSet1 = coordSet1.map((coordSet2) => {
                let swapCoordSet2 = coordSet2.map((coord) => {
                    return {
                        latitude: coord[1], longitude: coord[0]
                    }
                })
                return [swapCoordSet2];
            })
            return [swapCoordSet1];
        })
        setPolygon(swapCoord[0][0][0][0]);
        //console.log(getCenterOfBounds(swapCoord[0][0][0][0]));
        setZoomToLatitude(getCenterOfBounds(swapCoord[0][0][0][0]).latitude)
        setZoomToLongitude(getCenterOfBounds(swapCoord[0][0][0][0]).longitude)

        //get taxi count from json
        let taxiCount = 0;
        taxiCountData.map(obj => {
            if (obj.area === id) {
                taxiCount = obj.taxiCount;
            }
        });
        setTaxisAvailable(taxiCount);

        //Count taxis in polygon - takes too long to generate each count
        // let taxiCount = 0;
        // taxiAvailability.value.forEach(stand => {
        //     if (isPointInPolygon({ latitude: stand.Latitude, longitude: stand.Longitude }, swapCoord[0][0][0][0])) {
        //         taxiCount += 1;
        //     }
        // })
        // console.log(taxiCount);
        // setTaxisAvailable(taxiCount);
    }

    //Detect user location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
        funcGetPlanningAreaStatic(setAreaPolygonList); //Get static planning area
        // testFunction();
    }, []);

    //Set user location
    let text = "Detecting location...";
    let userLocation = {
        latitude: null,
        longitude: null
    }
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = "Tap to view detected location."
        userLocation.latitude = location.coords.latitude;
        userLocation.longitude = location.coords.longitude;
    }

    //Jump to user's current location using the top bar, or jump to a taxi stand selected from the list
    const mapRef = useRef(null);
    const JumpToTaxiStand = () => {
        mapRef.current.animateToRegion({
            latitude: JumpToLatitude,
            longitude: JumpToLongitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
        }, 1000)
    }
    const JumpToCurrentLocation = () => {
        setJumpToLatitude(location.coords.latitude)
        setJumpToLongitude(location.coords.longitude)
    }
    useEffect(() => {
        JumpToTaxiStand();
    }, [JumpToLatitude, JumpToLongitude]);

    //Zoom to region in dropdown menu
    const [ZoomToLatitude, setZoomToLatitude] = useState(1.291210939);
    const [ZoomToLongitude, setZoomToLongitude] = useState(103.8459884);
    const ZoomToPlanningArea = () => {
        mapRef.current.animateToRegion({
            latitude: ZoomToLatitude,
            longitude: ZoomToLongitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        }, 1000)
    }
    useEffect(() => {
        ZoomToPlanningArea();
    }, [ZoomToLatitude, ZoomToLongitude]);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.topContainer}>
                <Pressable onPress={JumpToCurrentLocation}>
                    <Text style={styles.footer}>
                        {text}{currentSelection != null && " Selected location is " + `${currentSelection.Distance/1000}` + "km away."}
                    </Text>
                </Pressable>
            </View>
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    showsUserLocation={true}
                    zoomTapEnabled={true}
                    initialCamera={camera}
                >
                    <Polygon
                        coordinates={polygon}
                        strokeColor="#F00"
                        fillColor="rgba(255,0,0,0.1)"
                        strokeWidth={1}
                    />
                    <TaxiStand 
                        userLocation={userLocation}
                        selectedLocations={selectedLocations}
                        setSelectedLocations={setSelectedLocations}
                        setCurrentSelection={setCurrentSelection}
                        navigation={navigation}
                    />
                    {currentSelection != null && <Polyline
                        coordinates={[ userLocation, {latitude: currentSelection.Latitude, longitude: currentSelection.Longitude} ]}
                        strokeColor="#717D7E"
                        fillColor="#717D7E"
                        strokeWidth={6}
                    />}
                </MapView>
            </View>
            <View style={styles.bottomContainer}>
                <DropDownPicker
                    containerStyle={styles.dropdown}
                    labelStyle={styles.dropdownlabel}
                    listItemLabelStyle={styles.dropdownlabel}
                    placeholderStyle={styles.dropdownlabel}
                    placeholder="Select an area to view"
                    dropDownContainerStyle={{ marginBottom: 22 }}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    onChangeValue={(value) => {
                        handlerSelectArea(value);
                    }}
                />
                <Text style={styles.footer}>Taxis available in this area: {taxisAvailable}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "white",
        flex: 1,
        justifyContent: "space-between",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    topContainer: {
        //height: 25,
    },
    mapContainer: {
        flexBasis: "50%",
        flexGrow: 1,
    },
    bottomContainer: {
        //height: 105,
    },
    footer: {
        backgroundColor: "#D5D8DC",
        color: "#2E4053",
        textAlign: "center",
        fontSize: 12,
        padding: 5,
    },
    dropdown: {
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    dropdownlabel: {
        padding: 5,
    }
})