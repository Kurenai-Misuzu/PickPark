import { useQueryReviews } from "@/data/queryReviews";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { router } from "expo-router";
import { useState } from "react";

interface ReviewProps {
  id: number;
}

const ReviewComponent: React.FC<ReviewProps> = ({ id }) => {
  const { data: reviews } = useQueryReviews(id);
  //console.log(reviews);

  // red squiggly on first_name and last_name work here

  return (
    <Pressable 
      onPress={() =>
        router.push({
          pathname: "/(misc)/all-reviews",
          params: { id: id.toString() },
        })
      }
    >
      <ThemedView style={styles.Reviews}>
        <ThemedText type="title" style={{ marginBottom: 20 }}>
          Reviews
        </ThemedText>
        {reviews?.length ? (
          reviews?.slice(0, 3).map((item, index) => (
            <ThemedView key={`${item}-${index}`}>
                <ThemedText type="subtitle">
                  {item.User.first_name + " "} {item.User.last_name}
                </ThemedText>
                <ThemedText style={{ marginLeft: 10 }}>
                  {"• " + item.review_text}
                </ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedText>No Reviews Found</ThemedText>
        )}
      </ThemedView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  Reviews: {
    padding: 10,
    margin: 10,
  },
});

export default ReviewComponent;
