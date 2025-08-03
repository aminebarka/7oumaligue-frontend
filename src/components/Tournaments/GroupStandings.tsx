import React from 'react';
import { Group, Team, GroupTeam } from '../../types';

interface GroupStandingsProps {
  group: Group;
  teams: Team[];
}

const GroupStandings: React.FC<GroupStandingsProps> = ({ group, teams }) => {
  // Vérifier si le groupe a des équipes
  if (!group.groupTeams || group.groupTeams.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">{group.name}</h3>
        <p className="text-gray-500 text-center py-4">Aucune équipe dans ce groupe</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">{group.name}</h3>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-2 px-4 border-b">Équipe</th>
            <th className="py-2 px-4 border-b">Pts</th>
            <th className="py-2 px-4 border-b">MJ</th>
            <th className="py-2 px-4 border-b">G</th>
            <th className="py-2 px-4 border-b">N</th>
            <th className="py-2 px-4 border-b">P</th>
            <th className="py-2 px-4 border-b">BP</th>
            <th className="py-2 px-4 border-b">BC</th>
            <th className="py-2 px-4 border-b">Diff</th>
          </tr>
        </thead>
        <tbody>
          {group.groupTeams?.map(groupTeam => {
            const team = teams.find(t => t.id === groupTeam.teamId);
            return (
              <tr key={groupTeam.id} className="border-t">
                <td className="py-2 px-4">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{team?.logo}</span>
                    <span>{team?.name}</span>
                  </div>
                </td>
                <td className="py-2 px-4 text-center font-bold">{groupTeam.points}</td>
                <td className="py-2 px-4 text-center">{groupTeam.played}</td>
                <td className="py-2 px-4 text-center">{groupTeam.wins}</td>
                <td className="py-2 px-4 text-center">{groupTeam.draws}</td>
                <td className="py-2 px-4 text-center">{groupTeam.losses}</td>
                <td className="py-2 px-4 text-center">{groupTeam.goalsFor}</td>
                <td className="py-2 px-4 text-center">{groupTeam.goalsAgainst}</td>
                <td className="py-2 px-4 text-center">{groupTeam.goalsFor - groupTeam.goalsAgainst}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GroupStandings;