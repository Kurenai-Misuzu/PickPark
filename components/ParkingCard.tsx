import { IconProps, IconElement, Icon } from "@ui-kitten/components";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CardProps {
  name: string;
  address: string;
}

const ParkingCard: React.FC<CardProps> = ({ name, address }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.placeName}>{name}</Text>
      <Text style={styles.placeAdd}>{address}</Text>
      <Pressable style={styles.favoriteIcon}>
        <Icon style={{ width: 60, height: 60 }} name="heart-outline" fill="gray" />
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
