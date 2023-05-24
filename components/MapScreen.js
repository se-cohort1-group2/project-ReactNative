import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";

import * as Location from "expo-location";
import MapView, { Marker, Polygon, Polyline, Callout } from "react-native-maps";
import { getDistance, getCenterOfBounds, isPointInPolygon } from "geolib";
//import DropDownPicker from "react-native-dropdown-picker";

import taxiStandMarker from "../assets/taximarker.png";
//import funcGetPlanningAreaStatic from "./funcGetPlanningAreaStatic";

const taxiStandData = require("./TaxiStands.json");
//const taxiAvailability = require("./TaxiAvailability.json");

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
        //funcGetPlanningAreaStatic(setAreaPolygonList); //Get static planning area
    }, []);

    let text = "Waiting..";
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

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                showsUserLocation={true}
                zoomTapEnabled={true}
                //initialCamera={camera}
            >
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
            {/* {showPolyLine && <Text style={{ fontSize: 6 }}>Hello</Text>} */}
            <Text style={styles.footer}>
                {text}{distance != null && " Selected location is " + `${distance}` + "km away."}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    map: {
        width: "100%",
        height: "85%",
    },
    footer: {
        color: "#2E4053",
        backgroundColor: "#D5D8DC",
        textAlign: "center",
        padding: 5,
        fontSize: 12,
        height: "5%",
    },
})