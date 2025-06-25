import BottomSheet, { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, Keyboard, View } from "react-native";
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, {Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Input, Icon, IconElement, IconProps, Spinner } from "@ui-kitten/components";
import { useLocalSearchParams } from "expo-router";
import { Appearance } from "react-native";

import ParkingCard from "@/components/ParkingCard";
import LocationInfoCard from "@/components/LocationInfoCard";
import { findParkingNearLocation } from "@/data/findParkingNearLocation";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function HomeScreen() {
  if (process.env.EXPO_PUBLIC_GOOGLE_API_KEY) {
    Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_API_KEY);
  }
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<Record<string, any>>({});
  const markerTapRef = useRef(false);
  const userInteracting = useRef(false);

  const snapPoints = useMemo(() => ["35%", "60%", "85%"], []);
  const [parkingData, setParkingData] = useState<ParkingPlace[]>([])
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ParkingPlace | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [markersLoaded, setMarkersLoaded] = useState(false);

  const colorScheme = useColorScheme();

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
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  })

  const darkThemeMap = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "administrative.country",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#2c2c2c" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#2c2c2c" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#383838" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212121" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#3c3c3c" }],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [{ color: "#4e4e4e" }],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#000923" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#3d3d3d" }],
    },
    {
      featureType: "landscape.natural.terrain",
      elementType: "geometry",
      stylers: [{ visibility: "on" }, { color: "#1a1a1a" }],
    },
  ];

  const searchIcon = (props: IconProps): IconElement => (
    <Pressable onPress={() => {fetchParking(searchQuery)}}>
      <Icon {...props} name="search" fill="maroon" />
    </Pressable>
  );

  // Fetch locations on start up
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error("Location permissions denied");
          return;
        }

        const {
          coords: { latitude, longitude }
        } = await Location.getCurrentPositionAsync({});

        const userRegion = ({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });

        setNewRegion(userRegion);
        mapRef.current?.animateToRegion(userRegion);
        handleRegionChange(userRegion);
      }
      catch (error) {
        console.error("Error getting location", error);
      }
    })();
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

  useEffect(() => {
    if (markersLoaded && parkingData.length > 0) {
      panToRegion(parkingData);
    }
  }, [markersLoaded])

  async function getCoordinates(address: string) {
    try {
      const response = await Geocoder.from(address);
      const location = response.results[0].geometry.location;
      if (location) {
        return { latitude: location.lat, longitude: location.lng};
      }
    }
    catch (error) {
      console.log("Error while geocoding:", error);
      return null;
    }
  }

  async function getAddress(lat: number, lng: number) {
    try {
      const response = await Geocoder.from(lat, lng);
      const address = response.results[0].formatted_address;
      if (address) {
        return address;
      }
    }
    catch (error) {
      console.log("Error while reverse-geocoding:", error);
      return null;
    }
  }

  const fetchParking = async (query: string) => {
    Keyboard.dismiss();
    setMarkersLoaded(false);

    findParkingNearLocation(query).then(async (data) => {
      if (data?.places) {
        const transformed = await Promise.all(
          data.places.map(async (place: any) => {
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
        setTimeout(() => setMarkersLoaded(true), 300);
      }
      else {
        console.log("No data found");
        setParkingData([]);
      }
    })
  }

  const panToRegion = (location: ParkingPlace[]) => {
    if (!mapRef.current || location.length === 0) return;

    const coords = location
    .filter((loc) => loc.location?.latitude && loc.location?.longitude)
    .map((loc) => ({
      latitude: loc.location.latitude,
      longitude: loc.location.longitude,
    }));

    mapRef.current.fitToCoordinates(coords, {
      edgePadding: {
        top: 80,
        right: 80,
        left: 80,
        bottom: 80,
      },
      animated: true,
    });
  };

  const handleRegionChange = async (region: Region) => {
    setNewRegion(region);
    const mapCenterAdd = await getAddress(region.latitude, region.longitude);
    if (mapCenterAdd) {
      fetchParking(mapCenterAdd);
    }
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
        onPanDrag={() => {userInteracting.current = true}}
        onRegionChangeComplete={(region => {
          if (userInteracting.current) {
            handleRegionChange(region);
            userInteracting.current = false;
          }
        })}
        provider={PROVIDER_GOOGLE}
        customMapStyle={Appearance.getColorScheme() === "dark" ? darkThemeMap : []}
        ref={mapRef}
        showsUserLocation
        onPress={() => {
          if (markerTapRef.current) {
            markerTapRef.current = false;
            return;
          }
          setSelectedLocation(null);
          setSelectedMarker(null);
          Keyboard.dismiss();
        }}
      >
        {parkingData.map((place) =>
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
              pinColor={selectedMarker === `${place.name}-${place.id}` ? "pink" : "red"}
              onPress={() => {
                markerTapRef.current = true;
                handleLocationClick(place, `${place.name}-${place.id}`);
              }}
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
          onSubmitEditing={() => {fetchParking(searchQuery);}}
          style={[styles.searchBar, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}
          textStyle={{color: colorScheme === "light" ? "black" : "white"}}
        />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        topInset={0}
        backgroundStyle={{backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}}
      >
        <BottomSheetView style={[styles.sheetContent]}>
          {selectedLocation ? (
            <LocationInfoCard name={selectedLocation.name} address={selectedLocation.address} id={selectedLocation.id} />
          ) : (
            markersLoaded ?
            (<BottomSheetFlatList
            data={parkingData}
            keyExtractor={(item) => `${item.name}-${item.id}`}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleLocationClick(item, `${item.name}-${item.id}`)}>
                <ParkingCard name={item.name} address={item.address} id={item.id} location={item.location} />
              </Pressable>
            )}
            ListEmptyComponent={<Text style={{color: colorScheme === "light" ? "black" : "white"}}>No Parking Found</Text>}
            contentContainerStyle={{ paddingBottom: 80 }}
            />) :
            (<View>
              <Spinner size="giant"/>
            </View>)
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
    height: "75%",
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
    //backgroundColor: colorScheme === "light" ? "white" : "gray",
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
