import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";

import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

import taxiStandMarker from "../assets/taximarker.png";

const taxiStandData = require("./TaxiStands.json");

function TaxiStand() {
    return (
        taxiStandData.value.map((item, index) => {
            return (
                <Marker
                    key={index}
                    coordinate={{ latitude: item.Latitude, longitude: item.Longitude }}
                    onPress={() => selectTaxiStand(item.TaxiCode, item.Name, item.Latitude, item.Longitude)}
                    centerOffset={{ x: -18, y: -60 }}
                    anchor={{ x: 0.69, y: 1 }}
                    image={taxiStandMarker}
                />
            )
        })
    )
}

function selectTaxiStand(taxiCode, name, latitude, longitude) {
    Alert.alert(
        "Taxi Stand: " + taxiCode,
        "Address: " + name
    )
}

export default function MapScreen() {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

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

    return (
        <View style={styles.container}>

            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                >
                    <TaxiStand/>
                </MapView>
            </View>

            <View style={styles.locationBar}>
                <Text style={styles.locationText}>{text}</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    mapContainer: {
        height: "96%",
    },
    locationBar: {
        height: "4%",
        justifyContent: "center",
        backgroundColor: "#D5D8DC",
    },
    locationText: {
        color: "#2E4053",
        textAlign: "center",
        fontSize: 12,
    },
})