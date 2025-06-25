import { supabase } from "@/data/supabase";
import { useQuery } from "@tanstack/react-query";

async function supabaseReviewQuery(locationID: string) {
  const { data, error } = await supabase
    .from("Reviews")
    .select(
      "User( first_name, last_name ), review_score, review_text, created_at",
    )
    .eq("location_id", locationID);

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export const useQueryReviews = (locationID: string) => {
  return useQuery({
    queryKey: ["reviews", locationID],
    queryFn: () => supabaseReviewQuery(locationID),
    enabled: !!locationID,
    staleTime: 0,
  });
};
