import { QueryReviews } from "@/data/queryReviews";
import { FlatList, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface ReviewProps {
  id: number;
}

const ReviewComponent: React.FC<ReviewProps> = ({ id }) => {
  const reviews = QueryReviews(id);
  console.log(reviews);

  // red squiggly on first_name and last_name work here

  return (
    <ThemedView style={styles.Reviews}>
      <ThemedText type="title" style={{ marginBottom: 20 }}>
        Reviews
      </ThemedText>
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <ThemedView>
            <ThemedText type="subtitle">
              {item.User.first_name + " "} {item.User.last_name}
            </ThemedText>
            <ThemedText style={{ marginLeft: 10 }}>
              {"• " + item.review_text}
            </ThemedText>
          </ThemedView>
        )}
        nestedScrollEnabled
        ListEmptyComponent={
          <ThemedText type="subtitle">No Reviews!</ThemedText>
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  Reviews: {
    padding: 10,
    margin: 10,
  },
});

export default ReviewComponent;
