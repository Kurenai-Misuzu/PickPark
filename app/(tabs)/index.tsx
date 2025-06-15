import BottomSheet, { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Geocoder from 'react-native-geocoding';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, {Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Input, Icon, IconElement, IconProps } from "@ui-kitten/components";
import { useLocalSearchParams } from "expo-router";

import ParkingCard from "@/components/ParkingCard";
import LocationInfoCard from "@/components/LocationInfoCard";
import { findParkingNearLocation } from "@/data/findParkingNearLocation";

export default function HomeScreen() {
  if (process.env.EXPO_PUBLIC_GOOGLE_API_KEY) {
    Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_API_KEY);
  }
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<Record<string, any>>({});

  const snapPoints = useMemo(() => ["35%", "60%", "85%"], []);
  const [parkingData, setParkingData] = useState<ParkingPlace[]>([])
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ParkingPlace | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get faveCard info and set it locally
  const { lat, lng, key } = useLocalSearchParams();
  const latitude = lat ? parseFloat(lat as string) : null;
  const longitude = lat ? parseFloat(lng as string) : null;
  const locID = key;

  type ParkingPlace = {
    name: string;
    address: string;
    location: {
      longitude: number;
      latitude: number;
    };
    id: number;
  };

  const [newRegion, setNewRegion] = useState({
    latitude: 47.61871908877952,
    longitude: -122.34557096646287,
    latitudeDelta: 1,
    longitudeDelta: 1,
  })

  const searchIcon = (props: IconProps): IconElement => (
    <Pressable onPress={() => {fetchParking(searchQuery)}}>
      <Icon {...props} name="search" fill="maroon" />
    </Pressable>
  );

  // Fetch locations on start up
  useEffect(() => {
    handleRegionChange(newRegion)
  }, [])

  // Find faveCard location and zoom in
  useEffect(() => {
    if (longitude && latitude && locID) {
      const region = {
        latitude,
        longitude, 
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current?.animateToRegion(region);

      const closestMatch = parkingData.find(
        (p) => Math.abs(p.location.latitude - latitude) < 0.0001 && Math.abs(p.location.longitude - longitude) < 0.0001
      );

      if (closestMatch) {
        const key = `${closestMatch.name}-${closestMatch.id}`;
        setSelectedMarker(key);
        setSelectedLocation(closestMatch);
        setTimeout(() => {
          markerRef.current[key]?.showCallout();
        }, 300);
      }
    }
  }, [locID])

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

  const fetchParking = async (searchQuery: string) => {
    findParkingNearLocation(searchQuery).then(async (data) => {
      if (data?.places) {
        const transformed = await Promise.all(
          data.places.map(async (place: any) => {
            const coords = await getCoordinates(place.formattedAddress)
            return {
              name: place.displayName?.text ?? "Unknown",
              address: place.formattedAddress ?? "Unknown",
              id: place.id,
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

  const handleRegionChange = async (region: Region) => {
    setNewRegion(region);
    fetchParking("Seattle");
  }

  const handleLocationClick = (place: ParkingPlace, key: string) => {
    setSelectedMarker(key);
    setSelectedLocation(place);

    mapRef.current?.animateToRegion({
      ...place.location,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    setTimeout(() => {
      markerRef.current[key]?.showCallout();
    }, 300);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={newRegion}
        onRegionChangeComplete={handleRegionChange}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        showsUserLocation
        onPress={() => {setSelectedLocation(null), setSelectedMarker(null)}}
      >
        {parkingData.map((place, index) =>
          place.location ? (
            <Marker
              ref={(ref) => {
                markerRef.current[`${place.name}-${place.id}`] = ref;
              }}
              key={`${place.name}-${place.id}`}
              identifier={`${place.name}-${place.id}`}
              coordinate={place.location} 
              title={place.name}
              anchor={{ x: 0.5, y: 1}}
              pinColor={selectedMarker === `${place.name}-${place.id}` ? "blue" : "red"}
              onPress={() => handleLocationClick(place, `${place.name}-${place.id}`)}
            />
          ) : null
        )}
      </MapView>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          status="danger"
          placeholder="Search"
          accessoryLeft={searchIcon}
          onSubmitEditing={() => {fetchParking(searchQuery)}}
          style={styles.searchBar}
        />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        index={0}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        topInset={0}
      >
        <BottomSheetView style={styles.sheetContent}>
          {selectedLocation ? (
            <LocationInfoCard name={selectedLocation.name} address={selectedLocation.address} id={selectedLocation.id} />
          ) : (
            <BottomSheetFlatList
            data={parkingData}
            keyExtractor={(item, index) => `${item.name}-${item.id}`}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => handleLocationClick(item, `${item.name}-${item.id}`)}>
                <ParkingCard name={item.name} address={item.address} id={item.id} location={item.location} />
              </Pressable>
            )}
            ListEmptyComponent={<Text>No Parking Found</Text>}
            contentContainerStyle={{ paddingBottom: 80 }}
            />
          )}
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
    width: 300,
    borderRadius: 15,
    borderColor: "maroon",
    borderWidth: 1,
  },
  marker: {
    width: 25,
    height: 39
  },
});
