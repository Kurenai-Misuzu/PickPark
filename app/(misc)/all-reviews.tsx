import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useQueryReviews } from "@/data/queryReviews";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Button, Spinner } from "@ui-kitten/components";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

export default function ReviewsScreen() {
  const colorScheme = useColorScheme();
  const { location_id } = useLocalSearchParams();

  const {
    data: reviews,
    isLoading,
    error,
  } = useQueryReviews(location_id.toString());

  if (isLoading) return <Spinner />;
  if (error) return <ThemedText>Error: {error.message}</ThemedText>;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e" },
      ]}
    >
      <View style={styles.header}>
        <Button
          appearance="filled"
          onPress={() => router.back()}
          style={{ borderColor: "maroon", backgroundColor: "maroon" }}
        >
          Back
        </Button>
        <ThemedText
          type="title"
          style={{ textAlign: "center", paddingLeft: 30, paddingTop: 15 }}
        >
          All Reviews
        </ThemedText>
      </View>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.created_at}
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
        ListEmptyComponent={<ThemedText>No Reviews Found</ThemedText>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    padding: "1%",
    marginTop: "15%",
    marginBottom: "10%",
    flexDirection: "row",
    verticalAlign: "middle",
    height: "7.5%",
    width: "100%",
    borderBottomColor: "maroon",
    borderBottomWidth: 2,
  },
});
