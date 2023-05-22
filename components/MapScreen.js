import React, { useState, useEffect } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, View, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import taxiStandMarker from '../assets/taximarker.png'

const taxiStandData = require('../TaxiStands.json');



function TaxiStand(){

  
  return(
      taxiStandData.value.map((item, index) => {
      return(
        <Marker 
        key= {index}
        coordinate={{latitude: item.Latitude, longitude: item.Longitude}}
        onPress={()=> selectTaxiStand(item.TaxiCode, item.Name, item.Latitude, item.Longitude)}
        centerOffset={{x: -18, y: -60}}
        anchor={{x: 0.69, y: 1}}
        image={taxiStandMarker}/>
      )
    })
  )
}

function selectTaxiStand(taxiCode, name, latitude, longitude){
  Alert.alert('Taxi Stand: ' + taxiCode,
  'Address: '+ name);
}

export default function MapScreen() {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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
        followsUserLocation={true}
        zoomTapEnabled={true}>
        <TaxiStand/>
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
    width: '95%',
    height: '92%',
    marginHorizontal: '2.5%',
    marginTop: '2.5%'
  },
  footer:{
    alignItems: 'stretch',
    color: '#2E4053',
    backgroundColor: '#D5D8DC',
    textAlign:'center',
    fontSize: 12,
    padding: 5,
    margin:10,
  }
});
