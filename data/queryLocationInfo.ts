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

export const QueryLocationInfo = (locationID: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ["queryLocations"],
    queryFn: () => supabaseLocationsQuery(locationID),
  });

  if (isLoading) {
    return "Loading...";
  }

  if (data?.length === 0) {
    return "Location not in database!";
  }

  return data;
};
