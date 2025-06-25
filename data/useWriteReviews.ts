import { useMutation } from "@tanstack/react-query";
import { supabase } from "./supabase";

async function supabaseInsertReview(
  userID: string,
  reviewScore: number,
  reviewText: string,
  locationID: string,
) {
  const date = new Date();

  const { data: insertedData, error } = await supabase.from("Reviews").upsert([
    {
      user_id: userID,
      review_score: reviewScore,
      review_text: reviewText,
      location_id: locationID,
      review_id: date.getTime(),
    },
  ]);

  if (error) {
    throw error;
  }

  return insertedData;
}

export const useWriteReviews = () => {
  return useMutation({
    mutationFn: ({
      userID,
      reviewScore,
      reviewText,
      locationID,
    }: {
      userID: string;
      reviewScore: number;
      reviewText: string;
      locationID: string;
    }) => supabaseInsertReview(userID, reviewScore, reviewText, locationID),
  });
};
