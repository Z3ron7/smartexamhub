import React, { useEffect, useState } from "react";
import { FaEllipsisV } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import AccordionLayout from '../../components/accordion/AccordionLayout'

// Define a function to get text color based on competency level
function getColorForLevel(level) {
  switch (level) {
    case 'Excellent':
      return 'text-green-500';
    case 'Average':
      return 'text-blue-500';
    case 'Good':
      return 'text-yellow-500';
    case 'Poor':
      return 'text-orange-500';
    case 'Very Poor':
      return 'text-red-500';
    default:
      return 'text-black';
  }
}

export default function ExamResult() {
  const [examScores, setExamScores] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpen = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close the accordion if it's already open
    } else {
      setActiveIndex(index); // Open the clicked accordion
    }
  };

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');

    const fetchExamScores = async () => {
      try {
        const response = await axios.get('https://smartexam.cyclic.app/dashboard/fetch-exam-room');
        setExamScores(response.data);
        console.log("ExamScores",response.data)
      } catch (error) {
        console.error('Error fetching exam scores:', error);
      }
    };

    fetchExamScores();
  }, []);
// Define a mapping of competency IDs to competency names
const competencyMap = {
  '1': 'SWWPS',
  '2': 'Casework',
  '3': 'HBSE',
  '4': 'CO',
  '5': 'Groupwork',
  '6': 'All Competency',
  // Add more mappings as needed
};

  const processExamScores = (exam, index, activeIndex) => {
    const { room_name, description, score, duration_minutes, end_time, total_duration_minutes } = exam;
    const endDate = new Date(end_time);
    const endDateFormatted = endDate.toISOString().split('T')[0];

    // Initialize an array to store the mapped competency names and scores
    const mappedScores = [];

    // Initialize an object to store the counts and percentages
    const competencyCounts = {};

    // Check if score is available before parsing it
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

      const competenciesForChart = mappedScores.filter((item) => item.competency !== 'All Competency');
      const filteredExamScores = examScores.filter((exam) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          (exam.room_name && exam.room_name.toLowerCase().includes(searchTerm)) ||
          (exam.competency_id && competencyName[exam.competency_id].toLowerCase().includes(searchTerm)) ||
          (exam.name && exam.name.toLowerCase().includes(searchTerm)) ||
          (exam.score && exam.score.toLowerCase().includes(searchTerm))
        );
      });
      return (
        <div className="flex flex-col sm:flex-row justify-center">
          <div className=' w-[350px] sm:w-1/2 lg:w-1/2 md:w-1/2 border mx-2 bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-900 mb-4 h-4/6 lg:mb-3'>
            <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-slate-900 border-[#EDEDED]'>
              <h2 className='text-[16px] leading-[19px] font-bold text-[#4e73df]'> Result</h2>
              <FaEllipsisV color='gray' className='cursor-pointer' />
            </div>
            <div className='lineChart'>
              <ResponsiveContainer height={300}>
                <LineChart
                  data={competenciesForChart}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='competency' />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type='monotone' dataKey='score' stroke='#8884d8' activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='bg-gray-200 dark:bg-slate-900 p-2 rounded-lg w-[360px] h-[350px] w- shadow-md'>
            <h2 className='text-xl font-semibold'>Exam Details</h2>
            <p>Exam Name: {room_name}</p>
            <p>Description: {description}</p>
            <p>Duration (Minutes): {duration_minutes}</p>
            <p>Date: {endDateFormatted}</p>
          <p>Exam taken (Minutes): {total_duration_minutes}</p>
            <ul>
              {mappedScores.map((item, index) => (
                <li key={index}>
                  {item.competency}: {item.score} out of {item.totalPossibleScore}{' '}
                  {parseFloat((item.score / item.totalPossibleScore * 100).toFixed(2))}%
                  {item.level && (
                    <span className={`${getColorForLevel(item.level)}`}>
                      {' '}
                      (You've got {item.level} result in {item.competency})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  };
  
  const competencyName = {
    6: 'All Competency',
    1: 'SWWPS',
    2: 'Casework',
    3: 'HBSE',
    4: 'CO',
    5: 'Groupwork',
  };
  const filteredExamScores = examScores.filter((exam) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      (exam.room_name && exam.room_name.toLowerCase().includes(searchTerm)) ||
      (exam.competency_id && competencyName[exam.competency_id].toLowerCase().includes(searchTerm)) ||
      (exam.name && exam.name.toLowerCase().includes(searchTerm)) ||
      (exam.score && exam.score.toLowerCase().includes(searchTerm))
    );
  });
  return (
    <div className="flex dark:text-white overflow-x-visible">
      
      <div className="flex items-center justify-between">
      </div>
      <div className="mt-[10px] w-full justify-center">
      <div className="flex m-5 w-96 h-12 border-2 border-slate-600 ">
      <input
        className="p-2 w-96"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by Room Name, Competency, or Name"
      />
      </div>
        {/* <div className="flex bg-gray-200 dark:bg-slate-900 gap-2 p-2 mb-4 border-b-2 rounded-lg shadow-md">
          <div className="sm:w-14 lg:w-28 lg:font-semibold md:text-sm text-sm">Name</div>
          <div className="sm:w-20 lg:w-28 lg:pl-14 lg:font-semibold md:text-sm text-sm">Avatar</div>
          <div className="w-1/4 text-sm md:text-sm lg:pl-16 lg:font-semibold">Room Name</div>
          <div className="pl-1 w-1/5 text-sm md:text-sm lg:font-semibold">Competency ID</div>
          <div className="pl-1 w-1/5 text-sm md:text-sm lg:font-semibold">Score</div>
          <div className="pl-1 w-1/5 text-sm md:text-sm lg:font-semibold">Total Duration</div>
          <div className="w-1/6 text-sm md:text-sm lg:font-semibold">Action</div>
        </div> */}
        <table className="dark:text-white w-full rounded-lg">
              <thead className='w-80'>
                <tr className="bg-slate-600 text-white text-[10px] sm:text-sm md:text-sm lg:text-base font-mono font-semibold">
                  <th className='flex items-start justify-start p-2 lg:p-3 md:p-2 sm:p-2 w-24 sm:w-24 md:w-28 lg:w-28'>Name</th>
                  <th className='p-2 lg:p-3 md:p-2 sm:p-2'>Avatar</th>
                  <th className="p-2 lg:p-3 md:p-2 sm:p-2">Room Name</th>
                  <th className="p-2 lg:p-3 text-left md:p-2 sm:p-2">Competency ID</th>
                  <th className="p-2 lg:p-3 md:p-2 sm:p-2">Score</th>
                  <th className="p-2 lg:p-3 md:p-2 sm:p-2">Total Duration</th>
                  <th className="p-2 lg:p-3 md:p-2 sm:p-2">Action</th>
                </tr>
              </thead>
        </table>
        {filteredExamScores.map((exam, index) => {
  // Initialize an array to store the mapped scores for each competency
  const mappedScores = [];
  
  // Initialize an object to store the counts and percentages
  const competencyCounts = {};

  // Check if the exam has a score
  if (exam.score) {
    const scoreString = exam.score;
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
    
    return (
      <AccordionLayout 
        title={(
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-2 md:gap-3 lg:gap-2 dark:text-white mx-3 ">
            <div className="w-24 text-xs lg:text-base sm:w-16 md:w-12 lg:w-44 ">{exam.name}</div>
            <div className="w-14 sm:w-14 md:w-16 lg:w-16 text-xs sm:text-sm md:text-sm lg:text-base "><img
          src={exam.image}
          alt=""
          className="rounded-full w-8 sm:w-8 md:w-9 lg:w-10 h-8 sm:h-8 md:h-9 lg:h-10"
        /></div>
            <div className=" w-16 sm:w-14 md:w-24 lg:w-44 text-xs lg:text-base lg:pl-12 ">{exam.room_name}</div>
            <div className="w-24 sm:w-14 md:w-24 lg:w-44 text-xs lg:text-base">{competencyName[exam.competency_id]}</div>
            <div className=" text-xs sm:text-sm md:text-base lg:text-base w-12 sm:w-14 md:w-24 lg:w-20 text-center">
              <ul>
                  <li>
                    {mappedScores[0].score}
                  </li>
              </ul>
            </div>
            <div className="w-28 sm:w-14 md:w-24 lg:w-52 text-xs lg:text-base lg:text-center">{exam.total_duration_minutes}</div>
          </div>
        )}
        index={index}
        activeIndex={activeIndex}
        setActiveIndex={handleOpen}
        key={index}
      >
        {processExamScores(exam)}
      </AccordionLayout>
    );
  }
  // Return null or handle the case where there's no score
  return null;
})}
      </div>
    </div>
  );
}
