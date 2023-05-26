import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

export default function SelectionListScreen({ selectedLocations, setSelectedLocations }) {

    const funcConvertToArray = (set) => {
        const list = Array.from(set);
        list.sort((a, b) => a.Distance - b.Distance);
        return list;
    }

    function removeSelectedLocation({item}) {
        let newLocations = new Set();
        selectedLocations.forEach(element => {
            if (element.TaxiCode === item.TaxiCode) {
                return false;
            }
            newLocations.add(element);
        })
        setSelectedLocations(newLocations);
    }

    const Item = ({item}) => (
        <View>
            <Pressable style={styles.card}>
                <Pressable style={{ position: "absolute", top: 18, right: 18 }} onPress={() => removeSelectedLocation({item})}>
                    <Ionicons name="md-trash-outline" size={28} color="#566573"/>
                </Pressable>
                <View style={styles.distanceView}>
                    <Text style={styles.distanceText}>{item.Distance/1000}km away</Text>
                </View>
                <Text style={{ fontSize: 20, paddingLeft: 5 }}>Taxi {item.Type} {item.TaxiCode}</Text>
                <Text style={{ fontSize: 12, paddingLeft: 5, marginTop: 5 }}>{item.Name}</Text>
            </Pressable>
        </View>
    )

    const renderItem = ({item}) => {
        return (
            <Item item={item}/>
        )
    }

    return (
        <View style={styles.mainContainer}>
            {selectedLocations.size === 0 && <Text style={styles.noneSelected}>Please select a taxi stand/stop from the map.</Text>}
            <FlatList
                data={funcConvertToArray(selectedLocations)}
                renderItem={renderItem}
                ListHeaderComponent={<View style={{ height: 15 }}></View>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    distanceView: {
        backgroundColor: "#3d9677",
        maxWidth: "40%",
        borderRadius: 16,
        marginBottom: 10,
        padding: 1,
    },
    distanceText: {
        color: "white",
        textAlign: "center",
        fontSize: 14,
    },
    card: {
        height: 140,
        backgroundColor: "#A2D9CE",
        marginBottom: 15,
        marginHorizontal: 15,
        padding: 15,
        borderRadius: 20,
    },
    noneSelected: {
        fontSize: 16,
        paddingVertical: 20,
        paddingHorizontal: 25,
    },
})