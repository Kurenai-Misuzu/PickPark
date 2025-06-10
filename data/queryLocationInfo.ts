import { supabase } from "@/data/supabase";
import { useQuery } from "@tanstack/react-query";

async function supabaseLocationsQuery(locationID: number) {
  const { data } = await supabase
    .from("Locations")
    .select(
      "formattedAddress, displayName_text, open_time, closing_time, payment_type, price_hourly, id",
    )
    .eq("id", locationID);
  return data;
}

export const useQueryLocationInfo = (locationID: number) => {
  return useQuery({
    queryKey: ["queryLocations", locationID],
    queryFn: () => supabaseLocationsQuery(locationID),
  });
};
