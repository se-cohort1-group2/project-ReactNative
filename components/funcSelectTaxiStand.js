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
            { text: "Cancel", onPress: () => {}, style: "cancel" },
            { text: "Remove from Selected", onPress: () => {
                removeSelectedLocation({item});
            }},
            { text: "Add to Selected", onPress: () => {
                setSelectedLocations(selectedLocations => new Set(selectedLocations).add(item));
                navigation.navigate("Selected");
            }},
        ],
        { cancelable: true }
    )
}