import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import error from '../../assets/images/error.png';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF8002'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
const StudentPie = () => {
    const [examScores, setExamScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');
      
        const fetchExamScores = async () => {
          try {
            const response = await axios.get(`https://smartexam.cyclic.app/dashboard/fetch-latest?userId=${user_id}&limit=1`);
            setExamScores(response.data.latestActivity)
      console.log('latest:', response.data.latestActivity)
      setLoading(false);
          } catch (error) {
            console.error('Error fetching exam scores:', error);
            setLoading(false);
          }
        };
      
        fetchExamScores();
      }, []);
      if (loading) {
        return (
          <div className="text-center">
            <p className="mt-[15px] text-center text-semibold text-gray-500">Loading...</p>
          </div>
        );
      }
      return examScores.map((exam, index) => {
        const { score, end_time} = exam;
        const endDate = new Date(end_time);
        const endDateFormatted = endDate.toISOString().split('T')[0];
              const competencyMap = {
                '1': 'SWPPS',
                '2': 'Casework',
                '3': 'HBSE',
                '4': 'CO',
                '5': 'Groupwork',
              };
      
              const mappedScores = [];
              const competencyCounts = {};
      
              if (score) {
                const scoreString = score;
        const scores = JSON.parse(scoreString);
      
                // Calculate the total score for all competencies
        let totalScore = 0;
        let totalPossibleScore = 0;

                for (const competencyId in scores) {
          if (competencyMap[competencyId]) {
            const competencyScore = scores[competencyId];
            totalScore += competencyScore;
            totalPossibleScore += 100; // Assuming the maximum score for each competency is 100
            mappedScores.push({
              competency: competencyMap[competencyId],
              score: competencyScore,
              totalPossibleScore: 100, // Each competency has a total possible score of 100
            });

            // Update competency counts
            if (!competencyCounts[competencyMap[competencyId]]) {
              competencyCounts[competencyMap[competencyId]] = {
                score: 0,
                totalPossibleScore: 0,
              };
            }
            competencyCounts[competencyMap[competencyId]].score += competencyScore;
            competencyCounts[competencyMap[competencyId]].totalPossibleScore += 100;
          }
        }
        // Calculate and add the "All Competency" entry
        const allCompetencyScore = totalScore;
        const allCompetencyPossibleScore = totalPossibleScore;
        mappedScores.push({
          competency: 'All Competency',
          score: allCompetencyScore,
          totalPossibleScore: allCompetencyPossibleScore,
        });

        // Sort the mappedScores array so that "All Competency" comes before other competencies
        mappedScores.sort((a, b) => {
            if (a.competency === 'All Competency') return -1;
            if (b.competency === 'All Competency') return 1;
            return a.competency.localeCompare(b.competency);
          });
  
          // Filter out "All Competency" from mappedScores
  
          // Define competency level criteria
          const competencyLevels = [
            { level: 'Excellent', minPercent: 90 },
            { level: 'Average', minPercent: 80 },
            { level: 'Good', minPercent: 75 },
            { level: 'Poor', minPercent: 60 },
            { level: 'Very Poor', minPercent: 0 },
          ];
  
          // Calculate and update competency levels
          mappedScores.forEach((item) => {
            const percentage = ((item.score / item.totalPossibleScore) * 100).toFixed(2); // Round to two decimal places
            for (const levelData of competencyLevels) {
              if (percentage >= levelData.minPercent) {
                item.level = levelData.level;
                break;
              }
              // Add the competency level message
              item.levelMessage = `(You've got ${item.level} result in ${item.competency})`;
            }
        });
      }
        const competenciesForChart = mappedScores.filter((item) => item.competency !== 'All Competency');
        console.log('score:', examScores)

        return (
          <div>
            {examScores.length === 0 ? (
              <div className="text-center">
                <img src={error} alt="" className="scale-[135%]" />
                <p className="mt-[15px] text-center text-semibold text-gray-500">
                  Searching...
                </p>
              </div>
            ) : (
              <div>
                <div>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={competenciesForChart}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={130}
                        fill="#8884d8"
                        dataKey="score"
                      >
                        {mappedScores.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className='grid gap-2 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-5 justify-center mx-auto items-center'>
                  {mappedScores
                    .filter((item) => item.competency !== 'All Competency')
                    .map((item, index) => (
                      <p
                        key={`competency-${index}`}
                        className='flex cursor-pointer font-bold justify-center items-center mx-auto'
                        style={{ color: COLORS[index % COLORS.length] }}
                      >
                        {item.competency}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        );
        })
}

export default StudentPie