import React, { createContext, useState } from 'react';

// Create the context
export const POIContext = createContext();

// Provider component
export function POIProvider({ children }) {
  const [pois, setPois] = useState([]); // Shared POI list state

  const addPOI = (poi) => {
    setPois((prevPois) => [...prevPois, poi]); // Add new POI to the list
  };

  return (
    <POIContext.Provider value={{ pois, addPOI }}>
      {children}
    </POIContext.Provider>
  );
}
