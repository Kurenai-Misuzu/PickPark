import { findParkingNearLocation } from "@/data/findParkingNearLocation";
import { useWriteLocationInfo } from "@/data/useWriteLocationInfo";
import { useWriteReviews } from "@/data/useWriteReviews";
import { Button, StyleSheet, Text, View } from "react-native";

export default function DylanTest() {
  const writeReviews = useWriteReviews();
  const writeLocationInfo = useWriteLocationInfo();
  return (
    <View style={styles.test}>
      <Text> Hi </Text>
      {/* EXAMPLE USAGE OF WRITE REVIEWS FUNCTION */}
      <Button
        title="Write Reviews Test"
        onPress={() =>
          writeReviews.mutate({
            userID: 5,
            reviewScore: 10,
            reviewText: "This place rocks",
            locationID: 5,
          })
        }
      />
      {/* EXAMPLE USAGE OF UPDATING LOCATION INFO */}
      <Button
        title="Update Location Info Test"
        onPress={() =>
          writeLocationInfo.mutate({
            locationID: "5",
            openTime: "09:30:00",
            closingTime: "21:30:00",
            paymentType: "Monthly",
            priceHourly: 100,
          })
        }
      />
      {/* EXAMPLE USAGE OF FIND PARKING NEAR LOCATION (WILL AUTOMATICALLY PUSH DATA TO SUPABASE) */}
      <Button
        title="Get Parking"
        onPress={() =>
          findParkingNearLocation("bellevue college").then((data) => {
            for (const x in data.places) {
              console.log("-------------------------");
              console.log(data.places[x].id);
              console.log(data.places[x].formattedAddress);
              console.log(data.places[x].displayName.text);
            }
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  test: {
    margin: 50,
  },
});
