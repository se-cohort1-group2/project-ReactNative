import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";

import * as Location from "expo-location";
import MapView, { Marker, Polygon, Polyline, Callout } from "react-native-maps";
import { getDistance, getCenterOfBounds, isPointInPolygon } from "geolib";
import DropDownPicker from "react-native-dropdown-picker";

import taxiStandMarker from "../assets/taximarker.png";
import funcGetPlanningAreaStatic from "./funcGetPlanningAreaStatic";

const taxiStandData = require("./TaxiStands.json");
const taxiAvailability = require("./TaxiAvailability.json");

function TaxiStand({ userLocation, distance, setSelectedLocation, setShowPolyLine, setDistance }) {
    return (
        taxiStandData.value.map((item, index) => {
            return (
                <Marker
                    key={index}
                    coordinate={{ latitude: item.Latitude, longitude: item.Longitude }}
                    onPress={() => selectTaxiStand(userLocation, item.TaxiCode, item.Name, item.Latitude, item.Longitude, setSelectedLocation, setShowPolyLine, setDistance)}
                    centerOffset={{ x: -18, y: -60 }}
                    anchor={{ x: 0.69, y: 1 }}
                    image={taxiStandMarker}
                >
                    {distance != null &&
                        <Callout>
                            <View>
                                <Text>{distance}km from me</Text>
                            </View>
                        </Callout>
                    }
                </Marker>
            )
        })
    )
}

function selectTaxiStand(userLocation, taxiCode, name, latitude, longitude, setSelectedLocation, setShowPolyLine, setDistance) {
    Alert.alert(
        "Taxi Stand: " + taxiCode,
        "Address: " + name,
        [
            { text: "Navigate", onPress: () => {
                setSelectedLocation({ latitude: latitude, longitude: longitude })
                setDistance(getDistance(userLocation, { latitude: latitude, longitude: longitude }))
                setShowPolyLine(true)
            }},
            { text: "Cancel", onPress: () => setShowPolyLine(false), style: "cancel" }
        ],
        { cancelable: false }
    )
}

export default function MapScreen() {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
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
        { labelStyle: {padding: 5}, label: "QUEENSTOWN", value: "QUEENSTOWN" },
        { labelStyle: {padding: 5}, label: "DOWNTOWN CORE", value: "DOWNTOWN CORE" },
        { labelStyle: {padding: 5}, label: "NEWTON", value: "NEWTON" },
        { labelStyle: {padding: 5}, label: "ORCHARD", value: "ORCHARD" },
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
    }, []);

    let text = "Detecting location...";
    let userLocation = {
        latitude: null,
        longitude: null
    }
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = "Location detected."
        userLocation.latitude = location.coords.latitude;
        userLocation.longitude = location.coords.longitude;
    }

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

        //Count taxis in polygon
        let taxiCount = 0;
        taxiAvailability.value.forEach(stand => {
            if (isPointInPolygon({ latitude: stand.Latitude, longitude: stand.Longitude }, swapCoord[0][0][0][0])) {
                taxiCount += 1;
            }
        })
        console.log(taxiCount);
        setTaxisAvailable(taxiCount);
        // setCenter(swapCoord[0][0][0][0][0]);
        // setZoom(13.5);
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.topContainer}>
                <Text style={styles.footer}>{text}{distance != null && " Selected location is " + `${distance}` + "km away."}</Text>
            </View>
            <View style={styles.mapContainer}>
                <MapView
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
                        distance={distance}
                        setSelectedLocation={setSelectedLocation}
                        setShowPolyLine={setShowPolyLine}
                        setDistance={setDistance}
                    />
                    {showPolyLine && <Polyline
                        coordinates={[ userLocation, selectedLocation ]}
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
                    dropDownContainerStyle={{marginBottom: 18}}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    onChangeValue={(value) => {
                        console.log(value);
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
        padding: 15,
    },
    dropdownlabel: {
        padding: 5,
        //fontSize: 16,
    }
})