import { useQueryLocationInfo } from "@/data/queryLocationInfo";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import ReviewComponent from "./ReviewComponent";
interface LocationProps {
  name: string;
  address: string;
  id: number;
}

const LocationInfoCard: React.FC<LocationProps> = ({ name, address, id }) => {
  const colorScheme = useColorScheme();
  const { data, isLoading, error } = useQueryLocationInfo(id.toString());
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!data || data.length === 0) return <Text>No data found</Text>;

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
          <Button
            title={"Add Review"}
            onPress={() =>
              router.push({
                pathname: "/(misc)/review",
                params: { locationID: id },
              })
            }
            color="maroon"
          />
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
    marginLeft: 60,
  },
});

export default LocationInfoCard;
