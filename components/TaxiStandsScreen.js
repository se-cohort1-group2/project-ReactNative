import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, Pressable, TextInput } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import TaxiStandsList from "./TaxiStands.json";

export default function TaxiStandsScreen({ navigation, setJumpToLatitude, setJumpToLongitude }) {

    const GoToMap = () => {
        navigation.navigate("Map")
    }

    const [SelectedItem, setSelectedItem] = useState(null);

    const Item = ({item, onPress, backgroundColor, textColor}) => (
        <View style={[styles.itemOuter, {backgroundColor}]}>

            {item.TaxiCode === SelectedItem ?
            <Pressable style={{ position: "absolute", top: 15, right: 15 }} onPress={GoToMap}>
                <Ionicons name="ios-location-outline" size={30} color="#fff"/>
            </Pressable>
            : <></>}

            <Pressable style={styles.itemInner} onPress={onPress}>
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

        </View>
    )

    const renderItem = ({item}) => {
        const backgroundColor = item.TaxiCode === SelectedItem ? "#3d9677" : "#D5D8DC";
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
                        setJumpToLatitude(item.Latitude)
                        setJumpToLongitude(item.Longitude)
                    }
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
        <View style={styles.mainContainer}>
            <View style={styles.SearchBar}>
                <Ionicons name="ios-search-outline" size={20} color="black" style={styles.SearchIcon}/>
                <TextInput
                    style={styles.SearchInput}
                    onChangeText={(text) => SearchAndFilter(text)}
                    value={SearchTaxiStands}
                    placeholder="Search by code or location"
                />
            </View>
            <View style={styles.listContainer}>
                <FlatList
                    data={FilteredTaxiStands}
                    renderItem={renderItem}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "white",
        flex: 1,
    },
    listContainer: {
        flexBasis: "50%",
        flexGrow: 1,
    },
    itemOuter: {
        paddingVertical: 15,
        paddingLeft: 10,
        paddingRight: 40,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 8,
    },
    itemInner: {
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: 5,
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
        margin: 15,
        flexDirection: "row",
        columnGap: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    SearchIcon: {
        marginVertical: 3,
    },
    SearchInput: {
        fontSize: 16,
    },
})