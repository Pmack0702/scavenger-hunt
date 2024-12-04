import React, { createContext, useState } from 'react';
import apiClient from '../apiClient/api'

// Create the context
export const POIContext = createContext();

// Provider component
export function POIProvider({ children }) {
  const [pois, setPois] = useState([]); // Shared POI list state

  // Function to add a new POI
  const addPOI = (poi) => {
      setPois((prevPois) => [...prevPois, poi]); // Add new POI to the list
  };

  const editPOI = async (updatedPOI) => {
    try {
      // Make the PUT request to update the POI
      const response = await apiClient.put(`/pois/${updatedPOI._id}`, updatedPOI);
  
      // If the update is successful, update the local state
      if (response.status === 200) {
        setPois((prevPois) =>
          prevPois.map((poi) => (poi.id === updatedPOI._id ? updatedPOI : poi))
        );
      }

      // Optionally, show a success message to the user
      alert('POI updated successfully');
      
    } catch (error) {
      console.error('Error Updating POI:', error);
      // You could also show some user-friendly error message to the UI here
    }
  };
    

  const deletePOI = async (id) => {
    try {
      const response = await apiClient.delete(`/pois/${id}`)
      console.log('Deletion response:', response.data); // Log the response
      setPois((prevPois) => prevPois.filter((poi) => poi._id !== id));

    } catch (error) {
      console.error('Error Deleting POIs:', error);
      
    }
  }

  const refreshPOIs = async () => {
    try {
      const response = await apiClient.get('/pois');
      setPois(response.data);
    } catch (error) {
      console.error('Error refreshing POIs:', error);
    }
  };

  return (
    <POIContext.Provider value={{ pois, addPOI, editPOI, deletePOI, refreshPOIs }}>
      {children}
    </POIContext.Provider>
  );
}
