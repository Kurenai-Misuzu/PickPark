import { supabase } from "@/data/supabase";
import { useQuery } from "@tanstack/react-query";

async function supabaseReviewQuery(locationID: number) {
  const { data } = await supabase
    .from("Reviews")
    .select(
      "User( first_name, last_name ), review_score, review_text, created_at",
    )
    .eq("location_id", locationID);
  return data;
}

export const QueryReviews = (locationID: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ["QueryReviews"],
    queryFn: () => supabaseReviewQuery(locationID),
  });

  if (isLoading) {
    return "Loading...";
  }

  if (data?.length === 0) {
    return "No Reviews!";
  }

  return data;
};
