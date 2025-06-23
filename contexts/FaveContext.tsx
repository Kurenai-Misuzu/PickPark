import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ParkingPlace = {
  name: string;
  address: string;
  location: {
    longitude: number;
    latitude: number;
  };
  id: number;
};

type FavoritesContext = {
  favorites: ParkingPlace[];
  toggleFavorite: (place: ParkingPlace) => void;
  isFavorite: (id: number) => boolean;
};

const FaveContext = createContext<FavoritesContext | undefined>(undefined);

export const useFavorites = (): FavoritesContext => {
  const context = useContext(FaveContext);
  if (!context)
    throw new Error("useFavorites must be used within FaveProvider");
  return context;
};

const FAVORITES_KEY = "favorites";

export const FaveProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<ParkingPlace[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY).then((data) => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  // Save favorites to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (place: ParkingPlace) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.id === place.id)
        ? prev.filter((fav) => fav.id !== place.id)
        : [...prev, place]
    );
  };

  const isFavorite = (id: number) => favorites.some((fav) => fav.id === id);

  return (
    <FaveContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FaveContext.Provider>
  );
};
