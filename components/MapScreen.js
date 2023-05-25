import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';

import MapView, {Marker, Polyline, Callout} from 'react-native-maps';
import {getDistance} from 'geolib';
import * as Location from 'expo-location';

import taxiStandMarker from '../assets/taximarker.png'

const taxiStandData = require('./TaxiStands.json');



function TaxiStand({userLocation, selectedLocations, setSelectedLocations}){

  function removeSelectedLocation({item}){
    let newLocations = new Set();

    selectedLocations.forEach(element => {
      if (element.TaxiCode === item.TaxiCode){
        return false;
      }

      newLocations.add(element);

    });

    setSelectedLocations(newLocations);
  }

  function selectTaxiStand({item}){
    Alert.alert('Taxi Stand: ' + item.TaxiCode,
    'Address: '+ item.Name, [
      { text: 'Add', onPress: () => {
        item.Distance = getDistance(userLocation,{latitude: item.Latitude,longitude: item.Longitude});

        setSelectedLocations(selectedLocations => new Set(selectedLocations).add(item));
          console.log(selectedLocations);
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

  return(
      taxiStandData.value.map((item, index) => {
        
      return(
        <Marker 
        key= {index}
        coordinate={{latitude: item.Latitude, longitude: item.Longitude}}
        onPress={()=> selectTaxiStand({item})}
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


// function findDistance(userLocation){
//   return (
//     taxiStandData.value.map((item, index) => {
//       return(
//         item.distance = getDistance(userLocation, {latitude: item.Latitude, longitude: item.Longitude})
//       )
//     })
//   )
// }

export default function MapScreen() {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState(new Set());
  const [distance, setDistance] = useState(null);
  const [showPolyLine, setShowPolyLine] = useState(false);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  let userLocation = {
    latitude: null,
    longitude: null
  };
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = 'Location detected.'
    userLocation.latitude = location.coords.latitude;
    userLocation.longitude = location.coords.longitude;
  }

  return (
    <View style={styles.container}>
        <MapView 
        style={styles.map} 
        showsUserLocation={true} 
        zoomTapEnabled={true}>
            
            <TaxiStand 
              userLocation={userLocation}
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}/>
            {/* {showPolyLine && <Polyline
              coordinates={[userLocation,selectedLocation]}
              strokeColor="#717D7E"
              fillColor="#717D7E"
              strokeWidth={6}
              />} */}

        </MapView>

        <Text style={styles.footer}>{text}</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '85%'
  },
  footer:{
    color: '#2E4053',
    backgroundColor: '#D5D8DC',
    textAlign:'center',
    padding: 5,
    fontSize: 12,
    height: '5%',

  }
});
