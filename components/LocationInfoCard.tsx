import { useQueryLocationInfo } from "@/data/queryLocationInfo";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

interface LocationProps {
  name: string;
  address: string;
  id: string;
}

const LocationInfoCard: React.FC<LocationProps> = ({ name, address, id }) => {
  const { data, isLoading, error } = useQueryLocationInfo(id);
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!data || data.length === 0) return <Text>No data found</Text>;

  const locationData = data[0];

  return (
    <BottomSheetView>
      <View style={styles.titleBar}>
        <Text style={styles.placeName}>{name}</Text>
      </View>
      <BottomSheetScrollView>
        <Text style={styles.infoText}>Address: {address}</Text>
        <Text style={styles.infoText}>
          Hours: {locationData.open_time} AM - {locationData.closing_time}{" "}
          PM{" "}
        </Text>
        <Text style={styles.infoText}>
          Payment Type: {locationData.payment_type}{" "}
        </Text>
        <Text style={styles.infoText}>Pay: ${locationData.price_hourly}</Text>
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
