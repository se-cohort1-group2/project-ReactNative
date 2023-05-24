import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";

import * as Location from "expo-location";
import MapView, { Marker, Polygon } from "react-native-maps";
import DropDownPicker from 'react-native-dropdown-picker';

import taxiStandMarker from "../assets/taximarker.png";
import funcGetPlanningAreaStatic from "./funcGetPlanningAreaStatic";

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
        { label: 'QUEENSTOWN', value: 'QUEENSTOWN' },
        { label: 'DOWNTOWN CORE', value: 'DOWNTOWN CORE' },
        { label: 'NEWTON', value: 'NEWTON' },
        { label: 'ORCHARD', value: 'ORCHARD' },
    ]);

    //Planning area
    const [AreaPolygonList, setAreaPolygonList] = useState([]);
    const [polygon, setPolygon] = useState([
        {
            latitude: 1.343,
            longitude: 103.814
        }
    ]);

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
        // setCenter(swapCoord[0][0][0][0][0]);
        // setZoom(13.5);
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                showsUserLocation={true}
                followsUserLocation={true}
                zoomTapEnabled={true}
                initialCamera={camera}
            >
                <TaxiStand />
                <Polygon
                    coordinates={polygon}
                    strokeColor="#F00"
                    fillColor="rgba(255,0,0,0.2)"
                    strokeWidth={1}
                />
            </MapView>
            <DropDownPicker
                containerStyle={styles.dropdown}
                labelStyle={styles.dropdownlabel}
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
            <Text style={styles.footer}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    map: {
        width: "95%",
        height: "80%",
        marginHorizontal: "2.5%",
        marginTop: "2.5%",
    },
    footer: {
        alignItems: "stretch",
        color: "#2E4053",
        backgroundColor: "#D5D8DC",
        textAlign: "center",
        fontSize: 12,
        padding: 5,
        margin: 10,
    },
    dropdown: {
        width: "95%",
        alignItems: "center",
        marginHorizontal: "2.5%",
        marginTop: "2.5%",
    },
    dropdownlabel: {
        width: "95%",
        alignItems: "center",

    }
})