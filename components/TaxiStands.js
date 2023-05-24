import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, FlatList, Pressable, TextInput } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import TaxiStandsList from "./TaxiStands.json";

export default function TaxiStands() {

    const [SelectedItem, setSelectedItem] = useState(null);

    const Item = ({item, onPress, backgroundColor, textColor}) => (
        <Pressable style={[styles.item, {backgroundColor}]} onPress={onPress}>

            <View style={styles.itemLeft}>
                <Text style={[styles.itemText, {color: textColor}]}>Code:&nbsp;</Text>
            </View>
            <View style={styles.itemRight}>
                <Text style={[styles.itemText, {color: textColor}, {fontWeight: "bold"}]}>{item.TaxiCode}</Text>
            </View>

            <View style={styles.itemLeft}>
                <Text style={[styles.itemText, {color: textColor}]}>Type:&nbsp;</Text>
            </View>
            <View style={styles.itemRight}>
                <Text style={[styles.itemText, {color: textColor}]}>{item.Type}</Text>
            </View>

            <View style={styles.itemLeft}>
                <Text style={[styles.itemText, {color: textColor}]}>Location:&nbsp;</Text>
            </View>
            <View style={styles.itemRight}>
                <Text style={[styles.itemText, {color: textColor}]}>{item.Name}</Text>
            </View>

        </Pressable>
    )

    const renderItem = ({item}) => {
        const backgroundColor = item.TaxiCode === SelectedItem ? "#3d9677" : "#a6deca";
        const color = item.TaxiCode === SelectedItem ? "white" : "black";
        return (
            <Item
                item={item}
                backgroundColor={backgroundColor}
                textColor={color}
                onPress={() => {
                    if (item.TaxiCode === SelectedItem) {
                        setSelectedItem(null)
                    } else {
                        setSelectedItem(item.TaxiCode)
                    }
                    //console.log(`Taxi Stand/Stop ${item.TaxiCode} selected`)
                }}
            />
        )
    }

    const [SearchTaxiStands, setSearchTaxiStands] = useState("");
    const [FilteredTaxiStands, setFilteredTaxiStands] = useState(TaxiStandsList.value);

    const SearchAndFilter = (text) => {
        setSearchTaxiStands(text)
        const SearchResult = TaxiStandsList.value.filter((item) => {
            return item.Name.toLowerCase().includes(text.toLowerCase()) || item.TaxiCode.toLowerCase().includes(text.toLowerCase())
        })
        if (SearchTaxiStands == "") {
            setFilteredTaxiStands(TaxiStandsList.value)
        } else {
            setFilteredTaxiStands(SearchResult)
        }
    }

    return (
        <>
        <View style={styles.SearchBar}>
            <Ionicons name="ios-search" size={24} color="#aaa"/>
            <TextInput
                style={styles.SearchInput}
                onChangeText={(text) => SearchAndFilter(text)}
                value={SearchTaxiStands}
                placeholder="Search by Code or Location"
            />
        </View>
        <FlatList
            data={FilteredTaxiStands}
            renderItem={renderItem}
        />
        </>
    )
}

const styles = StyleSheet.create({
    item: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: 5,
        borderRadius: 20,
    },
    itemLeft: {
        alignItems: "flex-end",
        width: "25%",
    },
    itemRight: {
        width: "75%",
    },
    itemText: {
        fontSize: 16,
    },
    SearchBar: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        margin: 16,
        flexDirection: "row",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#aaa",
        backgroundColor: "#fff",
    },
    SearchInput: {
        fontSize: 16,
        marginLeft: 10,
    },
})