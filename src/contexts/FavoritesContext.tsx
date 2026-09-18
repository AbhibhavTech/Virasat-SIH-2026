import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import {
  addFavoriteToFirestore,
  removeFavoriteFromFirestore,
  getFavoritesFromFirestore,
} from '../services/firebase';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (placeId: string) => boolean;
  toggleFavorite: (placeId: string) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavs = async () => {
      setLoading(true);
      try {
        if (user?.id) {
          // Fetch from Firestore
          const fsFavs = await getFavoritesFromFirestore(user.id);
          if (fsFavs && fsFavs.length > 0) {
            setFavorites(fsFavs);
            setLoading(false);
            return;
          }
        }
        // Fallback or guest favorites from API
        const items = await api.getFavorites();
        if (Array.isArray(items)) {
          setFavorites(items.map((i) => i?.place_id).filter(Boolean));
        } else {
          setFavorites([]);
        }
      } catch (err) {
        console.error('Failed to load favorites:', err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, [user?.id]);

  const isFavorite = (placeId: string) => favorites.includes(placeId);

  const toggleFavorite = async (placeId: string) => {
    if (isFavorite(placeId)) {
      setFavorites((prev) => prev.filter((id) => id !== placeId));
      if (user?.id) {
        removeFavoriteFromFirestore(user.id, placeId).catch((err) => {
          console.warn('Firestore removeFavorite err:', err);
        });
      }
      try {
        await api.removeFavorite(placeId);
      } catch (err) {
        console.error('Failed to remove favorite:', err);
      }
    } else {
      setFavorites((prev) => [...prev, placeId]);
      if (user?.id) {
        addFavoriteToFirestore(user.id, placeId).catch((err) => {
          console.warn('Firestore addFavorite err:', err);
        });
      }
      try {
        await api.addFavorite(placeId);
      } catch (err) {
        console.error('Failed to add favorite:', err);
      }
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
};

