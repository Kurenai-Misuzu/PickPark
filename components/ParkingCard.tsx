import { Icon } from "@ui-kitten/components";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFavorites } from "@/contexts/FaveContext";

interface CardProps {
  name: string;
  address: string;
  location: {
    longitude: number;
    latitude: number;
  };
  id: number;
}

const ParkingCard: React.FC<CardProps> = ({ name, address, id, location }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(id);

  return (
    <View style={styles.card}>
      <Text style={styles.placeName}>{name}</Text>
      <Text style={styles.placeAdd}>{address}</Text>
      <Pressable style={styles.favoriteIcon} onPress={() => {toggleFavorite({ name, address, id, location })}}>
        <Icon style={{ width: 60, height: 60 }} 
        name={favorited ? "heart" : "heart-outline"} 
        fill={favorited ? "pink" : "gray"} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 2,
    borderColor: "maroon",
    marginBottom: 15,
    width: 350,
    justifyContent: "center",
  },
  placeName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    width: 250,
  },
  placeAdd: {
    marginBottom: 10,
    width: 250,
  },
  favoriteIcon: {
    position: "absolute",
    right: 20
  }
});

export default ParkingCard;
