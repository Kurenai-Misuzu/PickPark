import { useQueryLocationInfo } from "@/data/queryLocationInfo";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Button as KittenButton } from '@ui-kitten/components'
import ReviewComponent from "./ReviewComponent";

interface LocationProps {
  name: string;
  address: string;
  id: number;
}

const LocationInfoCard: React.FC<LocationProps> = ({ name, address, id }) => {
  const colorScheme = useColorScheme();
  const { data, isLoading, error } = useQueryLocationInfo(id.toString());
  if (isLoading) return <Text style={{color: colorScheme === "light" ? "black" : "white"}}>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!data || data.length === 0) return <Text style={{color: colorScheme === "light" ? "black" : "white"}}>No data found</Text>;

  const locationData = data[0];

  return (
    <BottomSheetView>
      <View style={styles.titleBar}>
        <Text
          style={[
            styles.placeName,
            { color: colorScheme === "light" ? "black" : "white" },
          ]}
        >
          {name}
        </Text>
      </View>
      <BottomSheetScrollView>
        <Text
          style={[
            styles.infoText,
            { color: colorScheme === "light" ? "black" : "white" },
          ]}
        >
          Address: {address}
        </Text>
        <Text
          style={[
            styles.infoText,
            { color: colorScheme === "light" ? "black" : "white" },
          ]}
        >
          Hours: {locationData.open_time} AM - {locationData.closing_time}{" "}
          PM{" "}
        </Text>
        <Text
          style={[
            styles.infoText,
            { color: colorScheme === "light" ? "black" : "white" },
          ]}
        >
          Payment Type: {locationData.payment_type}{" "}
        </Text>
        <Text
          style={[
            styles.infoText,
            { color: colorScheme === "light" ? "black" : "white" },
          ]}
        >
          Pay: ${locationData.price_hourly}
        </Text>
        <ReviewComponent id={id} />
        <View style={styles.reviewButton}>
          <KittenButton
            style={styles.revButton}
            onPress={() =>
              router.push({
                pathname: "/(misc)/review",
                params: { locationID: id },
              })
            }
          >
            Add Review
          </KittenButton>
        </View>
      </BottomSheetScrollView>
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  placeName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    paddingBottom: 10,
  },
  titleBar: {
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "maroon",
    width: 375,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 15,
  },
  reviewButton: {
    width: "70%",
    marginLeft: 50,
  },
  revButton: {
    width: 275,
    backgroundColor: "maroon",
    borderColor: "maroon",
    borderRadius: 10,
    marginTop: 20,
  },
});

export default LocationInfoCard;
