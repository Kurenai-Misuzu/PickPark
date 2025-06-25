import { useQueryReviews } from "@/data/queryReviews";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ReviewProps {
  id: string;
}

const ReviewComponent: React.FC<ReviewProps> = ({ id }) => {
  const colorScheme = useColorScheme();
  const { data: reviews } = useQueryReviews(id);
  //console.log(reviews);

  // red squiggly on first_name and last_name work here

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(misc)/all-reviews",
          params: { location_id: id },
        })
      }
    >
      <ThemedView style={[styles.Reviews, {backgroundColor: colorScheme === "light" ? "#cfcfcf" : "#333333"}]}>
        <ThemedText type="title" style={{ marginBottom: 20 }}>
          Reviews
        </ThemedText>
        {reviews?.length ? (
          reviews?.slice(0, 3).map((item, index) => (
            <ThemedView key={`${item}-${index}`} style={{backgroundColor: colorScheme === "light" ? "#cfcfcf" : "#333333"}}>
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
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ReviewComponent;
