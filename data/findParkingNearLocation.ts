import { supabase } from "./supabase";
// check for google api
//console.log("GOOGLE API KEY:", process.env.EXPO_PUBLIC_GOOGLE_API_KEY);
let googleAPI: string;

if (process.env.EXPO_PUBLIC_GOOGLE_API_KEY) {
  googleAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
} else {
  throw new Error("Google API key missing!");
}
//console.log("🔑 GOOGLE API KEY:", googleAPI);

// function that finds parking near the given location
// example: findParkingNearLocation("bellevuecollege");
// returns promise (json with place array)
export async function findParkingNearLocation(location: string): Promise<any> {
  const url = "https://places.googleapis.com/v1/places:searchText";
  const googleAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

  if (!googleAPI) throw new Error("Google API key missing!");

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": googleAPI,
    "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
  };

  const body = {
    textQuery: "Parking near " + location,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Response from Google Maps
    //console.log("Google API raw response:", data);

    // Only bail if no places exist
    if (!data.places || data.places.length === 0) {
      console.warn("No places returned from Google API.");
      return [];
    }

    // Save results to Supabase
    for (const place of data.places) {
      const { data: insertResult, error } = await supabase
        .from("Locations")
        .upsert({
          id: place.id,
          formattedAddress: place.formattedAddress,
          displayName_text: place.displayName?.text ?? "Unknown",
        });

      //console.log("Upsert result:", insertResult);
      if (error) {
        console.error("Supabase insert error message:", error.message);
        console.error(
          "Supabase insert full error:",
          JSON.stringify(error, null, 2),
        );
        throw error;
      }
    }

    return data;
  } catch (error: any) {
    console.error("Error searching places:", error);
    return [];
  }
}
