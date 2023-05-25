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

const funcGetLastItem = (setOfItems) => {
    const item = [...setOfItems].pop();
    //console.log(item);
    const position = {latitude: item.Latitude, longitude: item.Longitude}
    return position;
}

export default function MapScreen({ JumpToLatitude, JumpToLongitude, setJumpToLatitude, setJumpToLongitude }) {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [selectedLocations, setSelectedLocations] = useState(new Set());
    const [distance, setDistance] = useState(null);
    const [showPolyLine, setShowPolyLine] = useState(false);

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
        { labelStyle: {padding: 5}, label: "DOWNTOWN CORE", value: "DOWNTOWN CORE" },
        { labelStyle: {padding: 5}, label: "NEWTON", value: "NEWTON" },
        { labelStyle: {padding: 5}, label: "ORCHARD", value: "ORCHARD" },
        { labelStyle: {padding: 5}, label: "PASIR RIS", value: "PASIR RIS" },
        { labelStyle: {padding: 5}, label: "QUEENSTOWN", value: "QUEENSTOWN" },
        { labelStyle: {padding: 5}, label: "ANG MO KIO", value: "ANG MO KIO" },
        { labelStyle: {padding: 5}, label: "BEDOK", value: "BEDOK" },
        { labelStyle: {padding: 5}, label: "BISHAN", value: "BISHAN" },
        { labelStyle: {padding: 5}, label: "BUKIT BATOK", value: "BUKIT BATOK" },
        { labelStyle: {padding: 5}, label: "CHOA CHU KANG", value: "CHOA CHU KANG" },
        { labelStyle: {padding: 5}, label: "CLEMENTI", value: "CLEMENTI" },
        { labelStyle: {padding: 5}, label: "GEYLANG", value: "GEYLANG" },
        { labelStyle: {padding: 5}, label: "HOUGANG", value: "HOUGANG" },
        { labelStyle: {padding: 5}, label: "JURONG WEST", value: "JURONG WEST" },
        { labelStyle: {padding: 5}, label: "KALLANG", value: "KALLANG" },
        { labelStyle: {padding: 5}, label: "MARINE PARADE", value: "MARINE PARADE" },
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
        console.log(getCenterOfBounds(swapCoord[0][0][0][0]));
        setJumpToLatitude(getCenterOfBounds(swapCoord[0][0][0][0]).latitude)
        setJumpToLongitude(getCenterOfBounds(swapCoord[0][0][0][0]).longitude)

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
    const JumpToRegion = () => {
        mapRef.current.animateToRegion({
            latitude: JumpToLatitude,
            longitude: JumpToLongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 1000)
    }
    const JumpToCurrentLocation = () => {
        setJumpToLatitude(location.coords.latitude)
        setJumpToLongitude(location.coords.longitude)
    }
    useEffect(() => {
        JumpToRegion();
    }, [JumpToLatitude, JumpToLongitude]);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.topContainer}>
                <Pressable onPress={JumpToCurrentLocation}>
                    <Text style={styles.footer}>{text}{distance != null && " Selected location is " + `${distance}` + "m away."}</Text>
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
                    />
                    {selectedLocations.size > 0 && <Polyline
                        coordinates={[ userLocation, funcGetLastItem(selectedLocations) ]}
                        strokeColor="#717D7E"
                        fillColor="#717D7E"
                        strokeWidth={6}
                    />}
                    {showPolyLine && <Polyline
                        coordinates={[ userLocation, selectedLocations ]}
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
                    placeholderStyle={styles.dropdownlabel}
                    placeholder="Select a region"
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
                <Text style={styles.footer}>Taxis available in this region: {taxisAvailable}</Text>
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