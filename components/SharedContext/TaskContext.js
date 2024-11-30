import React, { createContext, useState } from 'react';

// Create the context
export const POIContext = createContext();

// Provider component
export function POIProvider({ children }) {
  const [pois, setPois] = useState([]); // Shared POI list state

    // Function to add a new POI
    const addPOI = (poi) => {
        setPois((prevPois) => [...prevPois, poi]); // Add new POI to the list
    };

  // Function to edit an existing POI
  const editPOI = (updatedPOI) => {
    setPois((prevPois) =>
      prevPois.map((poi) => (poi.id === updatedPOI.id ? updatedPOI : poi))
    );
  }

  return (
    <POIContext.Provider value={{ pois, addPOI, editPOI }}>
      {children}
    </POIContext.Provider>
  );
}
