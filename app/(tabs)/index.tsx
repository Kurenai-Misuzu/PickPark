import BottomSheet, { BottomSheetView, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, TextInput, View, Text, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { PROVIDER_GOOGLE, Region, Marker } from "react-native-maps";
import Geocoder from 'react-native-geocoding';

import ParkingCard from "@/components/ParkingCard";
import { useParkingData } from "@/contexts/ParkingDataContext";
import { findParkingNearLocation } from "@/data/findParkingNearLocation";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function HomeScreen() {
  if (process.env.EXPO_PUBLIC_GOOGLE_API_KEY) {
    Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_API_KEY);
  }
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<any>(null);
  const snapPoints = useMemo(() => ["35%", "60%", "90%"], []);

  type ParkingPlace = {
    name: string;
    address: string;
    location: {
      longitude: number;
      latitude: number;
    };
  };
  const [parkingData, setParkingData] = useState<ParkingPlace[]>([])

  const [newRegion, setNewRegion] = useState({
    latitude: 47.61871908877952,
    longitude: -122.34557096646287,
    latitudeDelta: 1,
    longitudeDelta: 1,
  })

  async function getCoordinates(address: string) {
    try {
      const response = await Geocoder.from(address);
      const location = response.results[0].geometry.location;
      if (location) {
        return { latitude: location.lat, longitude: location.lng}
      }
    }
    catch (error) {
      console.log("Error while geocoding:", error)
      return null;
    }
  }

  const handleSheetChanges = useCallback((index: number) => {
    console.log("Sheet index", index);
  }, []);

  const handleRegionChange = async (region: Region) => {
    setNewRegion(region);

    findParkingNearLocation("Seattle").then(async (data) => {
      if (data?.places) {
        const transformed = await Promise.all(
          data.places.map(async (place: any) => {
            const coords = await getCoordinates(place.formattedAddress)
            return {
              name: place.displayName?.text ?? "Unknown",
              address: place.formattedAddress ?? "Unknown",
              location: await getCoordinates(place.formattedAddress)
            }
          })
        )
        const filteredData = transformed.filter((p) => p.name && p.address && p.location?.latitude && p.location?.longitude);
        setParkingData(filteredData);
      }
      else {
        console.log("No data found");
        setParkingData([]);
      }
    })
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={newRegion}
        onRegionChangeComplete={handleRegionChange}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        showsUserLocation
      >
        {parkingData.map((place, index) =>
          place.location ? (
            <Marker 
              key={`${place.name}-${index}`} 
              coordinate={place.location} 
              title={place.name}
              tracksViewChanges={false}
            />
          ) : null
        )}
      </MapView>
      <View style={styles.searchBar}>
        <TextInput placeholder="Search"></TextInput>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        index={0}
        enableContentPanningGesture={false}
      >
        <BottomSheetView style={styles.sheetContent}>
          <BottomSheetFlatList
            data={parkingData}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({ item }) => <ParkingCard name={item.name} address={item.address} />}
            ListEmptyComponent={<Text>No parking found</Text>}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  sheetContent: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  searchBar: {
    position: "absolute",
    flexDirection: "row",
    top: 70,
    left: 40,
    paddingLeft: "5%",
    zIndex: 10,
    backgroundColor: "white",
    width: "80%",
    borderRadius: 15,
    borderColor: "maroon",
    borderWidth: 1,
  },
  marker: {
    width: 25,
    height: 39
  },
});
