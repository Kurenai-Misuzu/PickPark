import { Text, Pressable, StyleSheet, View, FlatList } from "react-native";
import { router } from "expo-router";
import { useFavorites } from "@/contexts/FaveContext";
import ParkingCard from "@/components/ParkingCard";
import { useColorScheme } from "@/hooks/useColorScheme";

type ParkingPlace = {
    name: string;
    address: string;
    location: {
      longitude: number;
      latitude: number;
    };
    id: number;
  };

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const colorScheme = useColorScheme();

  const locationClick = (location: ParkingPlace["location"], id: number) => {
    router.push({
      pathname: "/(tabs)",
      params: {
        lat: location.latitude.toString(),
        lng: location.longitude.toString(),
        key: `${id}-${Date.now()}`,
      },
    });
  };

  return (
    <View style={[styles.container, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}>
      <FlatList 
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => {locationClick(item.location, item.id)}}>
            <ParkingCard name={item.name} address={item.address} id={item.id} location={item.location} />
          </Pressable>
        )}
        ListEmptyComponent={<Text style={{color: colorScheme === "light" ? "black" : "white"}}>No Favorites Found</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  }
})
