import { Text, View, Image } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { getDistance } from "geolib";

const taxiStandData = require("./TaxiStands.json");

import funcSelectTaxiStand from "./funcSelectTaxiStand";

import taxiStandMarker from "../assets/taximarker.png";
const taxiStandMarkerURI = Image.resolveAssetSource(taxiStandMarker).uri

export default function TaxiStand({ userLocation, selectedLocations, setSelectedLocations, setCurrentSelection, navigation }) {
    return (
        taxiStandData.value.map((item, index) => {
            return (
                <Marker
                    key={index}
                    coordinate={{ latitude: item.Latitude, longitude: item.Longitude }}
                    onPress={() => {
                        item.Distance = getDistance(userLocation, { latitude: item.Latitude, longitude: item.Longitude });
                        setCurrentSelection(item);
                        funcSelectTaxiStand({ item, selectedLocations, setSelectedLocations, navigation });
                    }}
                    image={{uri: taxiStandMarkerURI}}
                >
                    {item.Distance != null &&
                    <Callout>
                        <View>
                            <Text>{item.Distance/1000}km away</Text>
                        </View>
                    </Callout>
                    }
                </Marker>
            )
        })
    )
}