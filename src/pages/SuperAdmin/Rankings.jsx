import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Medal1 from '../../assets/images/prize-icon.png'
import Medal2 from '../../assets/images/2nd-prize-icon.png'
import Medal3 from '../../assets/images/3rd-prize-icon.png'
const goldMedalIcon = (
  <img
  className="w-12 h-10 "
  src={Medal1}
  alt=""
/>
  );
  
  const silverMedalIcon = (
    <img
  className="w-12 h-10 "
  src={Medal2}
  alt=""
/>
  );
  
  const bronzeMedalIcon = (
    <img
  className="w-12 h-10 "
  src={Medal3}
  alt=""
/>
  );
  
const Rankings = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get('https://smartexam.cyclic.app/dashboard/fetch-rankings');
        setRankings(response.data);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      }
    };

    fetchRankings();
  }, []);

  const competencyName = {
    6: 'All Competency',
    1: 'SWWPS',
    2: 'Casework',
    3: 'HBSE',
    4: 'CO',
    5: 'Groupwork',
  };

  const getMedalIcon = (index) => {
    if (index === 0) {
      return goldMedalIcon;
    } else if (index === 1) {
      return silverMedalIcon;
    } else if (index === 2) {
      return bronzeMedalIcon;
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <table className="table-auto w-full overflow-y-scroll h-80">
        <thead className="bg-slate-600 p-2 font-semibold border-b-2 text-white">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Avatar</th>
            <th className="px-4 py-2">User</th>
            <th className="px-3 py-2">Categories</th>
            <th className="px-3 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((item, index) => {
            const mappedScores = [];

            if (item.score) {
              const scores = JSON.parse(item.score);

              for (const competencyId in scores) {
                const competencyScore = scores[competencyId];
                mappedScores.push({
                  competency: competencyName[competencyId],
                  score: competencyScore,
                });
              }

              const allCompetencyScore = Object.values(scores).reduce(
                (acc, curr) => acc + curr,
                0
              );
              mappedScores.push({
                competency: 'All Competency',
                score: allCompetencyScore,
              });
            }

            const maxScore = mappedScores.reduce(
              (max, score) => Math.max(max, score.score),
              0
            );

            return {
              ...item,
              maxScore,
            };
          })
          .sort((a, b) => b.maxScore - a.maxScore)
          .map((sortedItem, index) => (
            <tr key={index} className='border-b border-slate-400'>
              <td className="px-4 py-2 border-r border-slate-800">
                {getMedalIcon(index)}
              </td>
              <td className="px-4 py-2">
                <img src={sortedItem.image} alt="" className="rounded-full w-10 h-10" />
              </td>
              <td className="px-4 py-2">{sortedItem.name}</td>
              <td className="px-4 py-2">{competencyName[sortedItem.competency_id]}</td>
              <td className="px-4 py-2">
                {sortedItem.maxScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Rankings;
