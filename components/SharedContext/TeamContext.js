import React, { createContext, useState } from 'react';
import apiClient from '../apiClient/api'; // Your API client to interact with backend

// Create the context
export const TeamContext = createContext();

// Provider component
export function TeamProvider({ children }) {

  const [teams, setTeams] = useState([]); // Shared team list state

  const fetchTeams = async () => {
    try {
        const response = await apiClient.get('/teams');
        console.log('API Response:', response.data);
        setTeams(response.data.teams);  // Set teams state
        console.log('Updated teams:', response.data.teams); // Log the updated teams state
    } catch (error) {
        console.error('Error fetching teams:', error);
    }
};


  // Add a new team
  const addTeam = async (team) => {
    try {
        
      const response = await apiClient.post('/teams', team);
      if (response.data) {
        // Assuming your response includes the new team object
        setTeams((prevTeams) => [...prevTeams, response.data]); // Append the new team to the existing teams
    }    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  // Edit an existing team
  const editTeam = async (updatedTeam) => {
    try {
      const response = await apiClient.put(`/teams/${updatedTeam._id}`, updatedTeam);
      if (response.status === 200) {
        setTeams((prevTeams) =>
          prevTeams.map((team) => (team.id === updatedTeam._id ? updatedTeam : team))
        );
      }
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  // Delete a team
  const deleteTeam = async (id) => {
    try {
      const response = await apiClient.delete(`/teams/${id}`);
      if (response.status === 200) {
        setTeams((prevTeams) => prevTeams.filter((team) => team._id !== id));
      }
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  // Add a member to a team
  const addMember = async (teamId, member) => {

    try {
      const response = await apiClient.post(`/${teamId}/members`, member);
      if (response.status === 200) {
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team._id === teamId ? { ...team, members: [...team.members, member] } : team
          )
        );
      }
    } catch (error) {
      console.error('Error adding member to team:', error);
    }
  };

  // Remove a member from a team
  const removeMember = async (teamId, memberId) => {
    try {
      const response = await apiClient.delete(`/${teamId}/members/${memberId}`, { memberId });
      if (response.status === 200) {
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team._id === teamId
              ? { ...team, members: team.members.filter((member) => member._id !== memberId) }
              : team
          )
        );
      }
    } catch (error) {
      console.error('Error removing member from team:', error);
    }
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        addTeam,
        editTeam,
        deleteTeam,
        fetchTeams,
        addMember,
        removeMember,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}
