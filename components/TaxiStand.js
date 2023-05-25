import { Text, View, Image } from "react-native";
import { Marker, Callout } from "react-native-maps";

const taxiStandData = require("./TaxiStands.json");

import funcSelectTaxiStand from "./funcSelectTaxiStand";

import taxiStandMarker from "../assets/taximarker.png";
const taxiStandMarkerURI = Image.resolveAssetSource(taxiStandMarker).uri

export default function TaxiStand({ userLocation, selectedLocations, setSelectedLocations, setCurrentSelection }) {
    return (
        taxiStandData.value.map((item, index) => {
            return (
                <Marker
                    key={index}
                    coordinate={{ latitude: item.Latitude, longitude: item.Longitude }}
                    onPress={() => {
                        funcSelectTaxiStand({ item, userLocation, selectedLocations, setSelectedLocations, setCurrentSelection })
                    }}
                    image={{uri: taxiStandMarkerURI}}
                >
                    {item.Distance != null &&
                    <Callout>
                        <View>
                            <Text>{item.Distance}m from me</Text>
                        </View>
                    </Callout>
                    }
                </Marker>
            )
        })
    )
}