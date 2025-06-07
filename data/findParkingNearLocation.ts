import { supabase } from "./supabase";

// check for google api
let googleAPI: string;

if (process.env.EXPO_PUBLIC_GOOGLE_API_KEY) {
  googleAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
} else {
  throw new Error("Google API key missing!");
}

// function that finds parking near the given location
// example: findParkingNearLocation("bellevuecollege");
// returns promise (json with place array)
export async function findParkingNearLocation(location: string): Promise<any> {
  const url = "https://places.googleapis.com/v1/places:searchText";
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": googleAPI,
    "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
  };
  const body = {
    textQuery: "Parking near ".concat(location),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 400, 401, 403, 404, 500)
      const errorData = await response.json(); // Attempt to read error details if available
      throw new Error(
        `HTTP error! Status: ${response.status}, Details: ${JSON.stringify(errorData)}`,
      );
    }

    // get data from google
    const data = await response.json();

    // THIS IS HOW TO GET THE DATA FROM THE PROMISE OF DATA
    // add to supabase
    for (const x in data.places) {
      const { error } = await supabase.from("Locations").upsert({
        id: data.places[x].id,
        formattedAddress: data.places[x].formattedAddress,
        displayName_text: data.places[x].displayName.text,
      });

      if (error) throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Error searching places:", error.message);
    throw error; // Re-throw the error for the caller to handle
  }
}
