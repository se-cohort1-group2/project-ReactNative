import { Alert } from "react-native";

export default function funcSelectTaxiStand({ item, selectedLocations, setSelectedLocations, navigation }) {

    

    function removeSelectedLocation() {
        let newLocations = new Set();
        selectedLocations.forEach(element => {
            if (element.TaxiCode === item.TaxiCode) {
                return false;
            }
            newLocations.add(element);
        })
        setSelectedLocations(newLocations);
    }

    Alert.alert(
        "Taxi Stand: " + item.TaxiCode,
        "Address: " + item.Name,
        [
            { text: "Add", onPress: () => {
                setSelectedLocations(selectedLocations => new Set(selectedLocations).add(item));
                navigation.navigate("Selected")
            }},
            { text: "Remove", onPress: () => {
                removeSelectedLocation({item});
            }},
            { text: "Cancel", onPress: () => {}, style: "cancel" }
        ],
        { cancelable: true }
    )
}