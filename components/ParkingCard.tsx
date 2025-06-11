import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CardProps {
  name: string;
  address: string;
}

const ParkingCard: React.FC<CardProps> = ({ name, address }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.placeName}>{name}</Text>
      <Text style={styles.placeAdd}>{address}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 2,
    borderColor: "maroon",
    marginBottom: 15,
    width: 350,
  },
  placeName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  placeAdd: {
    marginBottom: 10,
  },
});

export default ParkingCard;
