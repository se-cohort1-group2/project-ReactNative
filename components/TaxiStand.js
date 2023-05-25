import { Marker, Callout } from "react-native-maps";

import taxiStandMarker from "../assets/taximarker.png";

import funcSelectTaxiStand from "./funcSelectTaxiStand";

const taxiStandData = require("./TaxiStands.json");

export default function TaxiStand({userLocation, selectedLocations, setSelectedLocations}){

    // function removeSelectedLocation({item}){
    //   let newLocations = new Set();
  
    //   selectedLocations.forEach(element => {
    //     if (element.TaxiCode === item.TaxiCode){
    //       return false;
    //     }
  
    //     newLocations.add(element);
  
    //   });
  
    //   setSelectedLocations(newLocations);
    // }
  
    // function selectTaxiStand({item}){
    //   Alert.alert('Taxi Stand: ' + item.TaxiCode,
    //   'Address: '+ item.Name, [
    //     { text: 'Add', onPress: () => {
    //       item.Distance = getDistance(userLocation,{latitude: item.Latitude,longitude: item.Longitude});
  
    //       setSelectedLocations(selectedLocations => new Set(selectedLocations).add(item));
    //         console.log(selectedLocations);
    //     } },
    //     {
    //       text: 'Remove', onPress: () => {
    //         removeSelectedLocation({item});
    //       }
    //     },
    //     {
    //       text: 'Cancel',
    //       onPress: () => console.log('Pressed cancelled'),
    //       style: 'cancel',
    //     },
    //   ],
    //   { cancelable: true });
    // }
  
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
              {/* {item.Distance != null && <Callout>
                <View>
                  <Text>{item.Distance}km from me</Text>
                </View>
              </Callout>} */}
          </Marker>
        )
      })
    )
  }