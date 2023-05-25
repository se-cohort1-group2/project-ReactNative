import { StyleSheet, View, Text, ScrollView, Pressable, FlatList } from 'react-native';


const funcConvertToArray = (set) => {
    return [...set]
}

export default function SelectionListScreen({selectedLocations}){

    let list = funcConvertToArray(selectedLocations);
    
    const ListItem =({item}) => {
        <View>
            <Text>Hello</Text>
            {/* <Pressable style={styles.card}>
                <Text>Hello</Text>
                <Text style={{fontSize: 28}}>{item.TaxiCode}</Text>
                <Text style={{fontSize:12}}>{item.Name}</Text>
            </Pressable> */}
        </View>
    }
    
    const renderItem = ({item}) => {
        return (
            <ListItem item={item}/>
        )
    }
    
    return(
        <View>
            <FlatList data={list} renderItem={renderItem}/>
            {selectedLocations.size === 0 && <Text>Please select a taxi stand in the Map.</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        height: 200,
        backgroundColor:'#AED6F1',
        // alignItems: 'stretch',
        // justifyContent: 'center',
        marginTop:20,
        marginHorizontal:20,
        padding: 20,
        borderRadius: 20,
    }
});