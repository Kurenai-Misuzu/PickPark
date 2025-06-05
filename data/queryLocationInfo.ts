import { supabase } from "@/data/supabase";
import { useQuery } from "@tanstack/react-query";


// TODO: HAVE THIS TAKE A PARAM OF LOCATION ID
// SHOULD RETURN ONE LOCATION ONLY
export async function supabaseLocationsQuery( locationID: number) {
    const { data } = await supabase.from('Locations').select().eq('id', locationID);
    return data;
}

export const queryLocationInfo = () => {
    const { data } = useQuery({
        queryKey: ['queryLocations'],
        //queryFn: supabaseLocationsQuery
    });
}

