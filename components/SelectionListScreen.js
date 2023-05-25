import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, Pressable} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

export default function SelectionListScreen({selectedLocations, setSelectedLocations}) {

    const funcConvertToArray = (set) => {
        const list = Array.from(set);
        list.sort((a,b) => a.Distance - b.Distance);

        return list;
        
    }

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

    const Item = ({item}) => (
        <View>
            
            <Pressable style={styles.card}>
                <Pressable style={{ position: "absolute", top: 15, right: 15 }} onPress={()=> removeSelectedLocation({item})}>
                    <Ionicons name="md-trash" size={30} color="#566573"/>
                </Pressable>
                <Text style={styles.distance}>{item.Distance}m away</Text>
                <Text style={{fontSize: 20}}>Taxi {item.Type} {item.TaxiCode}</Text>
                <Text style={{fontSize: 12}}>{item.Name}</Text>

            </Pressable>

        </View>
    )

    const renderItem = ({item}) => {
        return (
            <Item
                item={item}
            />
        )
    }


    return (
        <View style={styles.mainContainer}>
                {selectedLocations.size === 0 && <Text style={{padding: 20}}>Please select a taxi stand or stop from the Map.</Text>}
                <FlatList
                    data={funcConvertToArray(selectedLocations)}
                    renderItem={renderItem}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    distance:{
        fontSize: 14, 
        backgroundColor:"#3d9677", 
        color: "white",
        maxWidth:'40%', 
        marginBottom: 10,
        borderRadius: 16, 
        textAlign:'center'
    },
    card: {
        height: 140,
        backgroundColor:'#A2D9CE',
        // alignItems: 'stretch',
        // justifyContent: 'center',
        marginTop:10,
        marginHorizontal:20,
        padding: 15,
        borderRadius: 20,
    },
})
// import { StyleSheet, View, Text, ScrollView, Pressable, FlatList } from 'react-native';


// const funcConvertToArray = (set) => {
//     return [...set]
// }

// export default function SelectionListScreen({selectedLocations}){

//     let list = funcConvertToArray(selectedLocations);
    
//     const ListItem =({item}) => {
//         <View>
//             <Text>Hello</Text>
//             {/* <Pressable style={styles.card}>
//                 <Text>Hello</Text>
//                 <Text style={{fontSize: 28}}>{item.TaxiCode}</Text>
//                 <Text style={{fontSize:12}}>{item.Name}</Text>
//             </Pressable> */}
//         </View>
//     }
    
//     const renderItem = ({item}) => {
//         return (
//             <ListItem item={item}/>
//         )
//     }
    
//     return(
//         <View style={styles.container}>
//             <FlatList data={list} renderItem={renderItem}/>
//             {selectedLocations.size === 0 && <Text>Please select a taxi stand in the Map.</Text>}
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     card: {
//         height: 200,
//         backgroundColor:'#AED6F1',
//         // alignItems: 'stretch',
//         // justifyContent: 'center',
//         marginTop:20,
//         marginHorizontal:20,
//         padding: 20,
//         borderRadius: 20,
//     }
// });