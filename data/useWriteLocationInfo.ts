import { useMutation } from "@tanstack/react-query";
import { supabase } from "./supabase";

async function supabaseUpdateLocationInfo(
  locationID: string,
  openTime?: string,
  closingTime?: string,
  paymentType?: string,
  priceHourly?: number,
) {
  const { data: insertedData, error } = await supabase
    .from("Locations")
    .update({
      open_time: openTime,
      closing_time: closingTime,
      payment_type: paymentType,
      price_hourly: priceHourly,
    })
    .eq("id", locationID);

  if (error) {
    throw error;
  }

  return insertedData;
}

export const useWriteLocationInfo = () => {
  return useMutation({
    mutationFn: ({
      locationID,
      openTime,
      closingTime,
      paymentType,
      priceHourly,
    }: {
      locationID: string;
      openTime?: string;
      closingTime?: string;
      paymentType?: string;
      priceHourly?: number;
    }) =>
      supabaseUpdateLocationInfo(
        locationID,
        openTime,
        closingTime,
        paymentType,
        priceHourly,
      ),
  });
};
