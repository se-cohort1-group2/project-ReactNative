import { Alert } from "react-native";
import { getDistance } from "geolib";


export default function funcSelectTaxiStand({item, userLocation, selectedLocations, setSelectedLocations}){

    function removeSelectedLocation(){
        let newLocations = new Set();
    
        selectedLocations.forEach(element => {
          if (element.TaxiCode === item.TaxiCode){
            return false;
          }
    
          newLocations.add(element);
    
        });
    
        setSelectedLocations(newLocations);
      }

    Alert.alert('Taxi Stand: ' + item.TaxiCode,
    'Address: '+ item.Name, [
        { text: 'Add', onPress: () => {
        item.Distance = getDistance(userLocation,{latitude: item.Latitude,longitude: item.Longitude});

        setSelectedLocations(selectedLocations => new Set(selectedLocations).add(item));
        } },
        {
        text: 'Remove', onPress: () => {
            removeSelectedLocation({item});
        }
        },
        {
        text: 'Cancel',
        onPress: () => console.log('Pressed cancelled'),
        style: 'cancel',
        },
    ],
    { cancelable: true });
}