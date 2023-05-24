import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicons from "react-native-vector-icons/Ionicons";

import MapScreen from "./components/MapScreen";
import TaxiStandsScreen from "./components/TaxiStandsScreen";

const Tab = createBottomTabNavigator();

export default function App() {

    const [JumpToLatitude, setJumpToLatitude] = useState(1.291210939);
    const [JumpToLongitude, setJumpToLongitude] = useState(103.8459884);

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === "Map") {
                            iconName = focused ? "ios-map" : "ios-map-outline";
                        } else if (route.name === "Taxi Stands") {
                            iconName = focused ? "ios-car" : "ios-car-outline";
                        }
                        return (<Ionicons name={iconName} size={size} color={color} />)
                    },
                    tabBarActiveTintColor: "#007AFF",
                    tabBarInactiveTintColor: "gray",
                })}
            >
                <Tab.Screen
                    name="Map"
                    children={props => <MapScreen
                        {...props}
                        JumpToLatitude={JumpToLatitude}
                        JumpToLongitude={JumpToLongitude}
                        setJumpToLatitude={setJumpToLatitude}
                        setJumpToLongitude={setJumpToLongitude}
                    />}
                />
                <Tab.Screen
                    name="Taxi Stands"
                    children={props => <TaxiStandsScreen
                        {...props}
                        setJumpToLatitude={setJumpToLatitude}
                        setJumpToLongitude={setJumpToLongitude}
                    />}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
})