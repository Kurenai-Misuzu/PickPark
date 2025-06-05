import testParkingData from "@/data/testParkingData.json";
import React, { createContext, useContext } from "react";

type Parking = {
  name: string;
  address: string;
};

const ParkingDataContext = createContext<Parking[]>([]);

export const useParkingData = () => useContext(ParkingDataContext);

export const ParkingDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <ParkingDataContext.Provider value={testParkingData}>
    {children}
  </ParkingDataContext.Provider>
);
