import { Text, View } from "react-native";
import { Marker, Callout } from "react-native-maps";

import taxiStandMarker from "../assets/taximarker.png";

import funcSelectTaxiStand from "./funcSelectTaxiStand";

const taxiStandData = require("./TaxiStands.json");

export default function TaxiStand({userLocation, selectedLocations, setSelectedLocations}){
 
    return(
        taxiStandData.value.map((item, index) => {
          
        return(
          <Marker 
          key= {index}
          coordinate={{latitude: item.Latitude, longitude: item.Longitude}}
          onPress={()=> funcSelectTaxiStand({item, userLocation, selectedLocations, setSelectedLocations})}
          centerOffset={{x: -18, y: -60}}
          anchor={{x: 0.69, y: 1}}
          image={taxiStandMarker}>
              {item.Distance != null && <Callout>
                <View>
                  <Text>{item.Distance}km from me</Text>
                </View>
              </Callout>}
          </Marker>
        )
      })
    )
  }