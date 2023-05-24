import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicons from "react-native-vector-icons/Ionicons";

//import Map from "./components/Map";
import MapScreen from "./components/MapScreen";

function TaxiScreen() {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Taxi Screen</Text>
        </View>
    )
}

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === "Map") {
                            iconName = focused ? "ios-map" : "ios-map-outline";
                        } else if (route.name === "Taxi") {
                            iconName = focused ? "ios-car" : "ios-car-outline";
                        }
                        return (<Ionicons name={iconName} size={size} color={color} />)
                    },
                    tabBarActiveTintColor: "#007AFF",
                    tabBarInactiveTintColor: "gray",
                })}
            >
                <Tab.Screen name="Map" component={MapScreen}/>
                <Tab.Screen name="Taxi" component={TaxiScreen}/>
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