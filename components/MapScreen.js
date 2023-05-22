import React, { useState, useEffect } from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';
import { StyleSheet, View, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import taxiStandMarker from '../assets/taximarker.png'

const taxiStandData = require('../TaxiStands.json');



function TaxiStand({setSelectedLocation, setShowPolyLine}){

  
  return(
      taxiStandData.value.map((item, index) => {
      return(
        <Marker 
        key= {index}
        coordinate={{latitude: item.Latitude, longitude: item.Longitude}}
        onPress={()=> selectTaxiStand(item.TaxiCode, item.Name, item.Latitude, item.Longitude, setSelectedLocation, setShowPolyLine)}
        centerOffset={{x: -18, y: -60}}
        anchor={{x: 0.69, y: 1}}
        image={taxiStandMarker}/>
      )
    })
  )
}

function selectTaxiStand(taxiCode, name, latitude,longitude, setSelectedLocation, setShowPolyLine){
  Alert.alert('Taxi Stand: ' + taxiCode,
  'Address: '+ name, [
    { text: 'Navigate', onPress: () => {
        setSelectedLocation({
        latitude: latitude,
        longitude: longitude
        });
        setShowPolyLine(true);
    } },
    {
      text: 'Cancel',
      onPress: () => console.log('No Pressed'),
      style: 'cancel',
    },
  ],
  { cancelable: false });
}



export default function MapScreen() {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
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
        followsUserLocation={true}
        zoomTapEnabled={true}>
            
            <TaxiStand setSelectedLocation={setSelectedLocation} setShowPolyLine={setShowPolyLine}/>

        </MapView>
        {/* {showPolyLine && <Text style={{fontSize:6}}>Hello</Text>} */}
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
    height: '92%',
    marginBottom: '2.5%'
  },
  footer:{
    alignItems: 'stretch',
    color: '#2E4053',
    backgroundColor: '#D5D8DC',
    textAlign:'center',
    fontSize: 12,
    padding: 5,
    height:'10%',
  }
});
