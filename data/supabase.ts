import { createClient } from "@supabase/supabase-js";

let supabaseURL: string;
let supabaseKEY: string;

export const checkEnv = () => {};
// typechecking keys
if (process.env.EXPO_PUBLIC_SUPABASE_URL) {
  supabaseURL = process.env.EXPO_PUBLIC_SUPABASE_URL;
} else {
  throw new Error("No supabase URL");
}
if (process.env.EXPO_PUBLIC_SUPABASE_KEY) {
  supabaseKEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;
} else {
  throw new Error("No supabase Key");
}

// Debug output
// console.log("SUPABASE_URL:", supabaseURL);
// console.log("SUPABASE_KEY (first 10 chars):", supabaseKEY?.substring(0, 10));

// create client
export const supabase = createClient(supabaseURL, supabaseKEY);
