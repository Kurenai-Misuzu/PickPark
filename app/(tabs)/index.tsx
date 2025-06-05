import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import ParkingCard from "@/components/ParkingCard";
import { useParkingData } from "@/contexts/ParkingDataContext";

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["35%", "60%"], []);

  const parkingData = useParkingData();

  const initialRegion = {
    latitude: 47.61871908877952,
    longitude: -122.34557096646287,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("Sheet index", index);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
      />
      <View style={styles.searchBar}>
        <TextInput placeholder="Search"></TextInput>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        index={0}
      >
        <BottomSheetView style={styles.sheetContent}>
          <FlatList
            data={parkingData}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => <ParkingCard {...item} />}
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
});
