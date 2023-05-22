import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Device from "expo-device";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

export default function Map() {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS === "android" && !Device.isDevice) {
                setErrorMsg("Oops, this will not work on Snack in an Android Emulator. Try it on your device!");
                return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    let DetectedLatitude = "";
    let DetectedLongitude = "";
    let text = "Waiting..";
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
        console.log("-----", location)
        console.log("-----", text)
        DetectedLatitude = location.coords.latitude;
        DetectedLongitude = location.coords.longitude;
        console.log("DetectedLatitude -----", DetectedLatitude)
        console.log("DetectedLongitude -----", DetectedLongitude)
    }

    return (
        <>
        <View style={styles.container}>
            <MapView style={styles.map} showsUserLocation={true} followsUserLocation={true}>
                <Marker coordinate={{latitude: DetectedLatitude, longitude: DetectedLongitude}}/>
            </MapView>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    map: {
        width: "100%",
        height: "100%",
    },
})