import { useWriteLocationInfo } from "@/data/useWriteLocationInfo";
import { useWriteReviews } from "@/data/useWriteReviews";
import { Button, StyleSheet, Text, View } from "react-native";

export default function DylanTest() {
  const writeReviews = useWriteReviews();
  const writeLocationInfo = useWriteLocationInfo();
  return (
    <View style={styles.test}>
      <Text> Hi </Text>
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
      <Button
        title="Update Location Info Test"
        onPress={() =>
          writeLocationInfo.mutate({
            locationID: 5,
            openTime: "09:30:00",
            closingTime: "21:30:00",
            paymentType: "Monthly",
            priceHourly: 100,
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
