import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AccordionLayout from '../../components/accordion/AccordionLayout'
import { FaEllipsisV } from "react-icons/fa";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const competencyMap = {
  '1': 'SWWPS',
  '2': 'Casework',
  '3': 'HBSE',
  '4': 'CO',
  '5': 'Groupwork',
  '6': 'All Competency'
  // Add more mappings as needed
}

const getColorForLevel = (level) => {
  switch (level) {
    case 'Excellent':
      return 'text-green-500';
    case 'Average':
      return 'text-yellow-500';
    case 'Good':
      return 'text-blue-500';
    case 'Poor':
      return 'text-red-500';
    case 'Very Poor':
      return 'text-gray-500';
    default:
      return '';
  }
};

const processExamScores = (exam) => {
  const { score, duration_minutes, end_time, total_duration_minutes } = exam;
  const endDate = new Date(end_time);
  const endDateFormatted = endDate.toISOString().split('T')[0];

  // Initialize an array to store the mapped competency names and scores
  const mappedScores = [];

  // Initialize an object to store the counts and percentages
  const competencyCounts = {};

  // Check if score is available before parsing it
  if (score) {
    // Parse the score string into a JSON object
    const scoresObject = JSON.parse(score);

    // Extract the scores and calculate the total score
    let totalScore = 0;
    for (const competencyId in scoresObject) {
      const competencyScore = scoresObject[competencyId];
      totalScore += competencyScore;
      mappedScores.push({
        competency: competencyMap[competencyId],
        score: competencyScore,
        totalPossibleScore: 100, // Assuming the maximum score for each competency is 100
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

    // Calculate and add the "All Competency" entry
    const allCompetencyScore = totalScore;
    const allCompetencyPossibleScore = Object.values(scoresObject).length * 100; // Total possible score is 100 * number of competencies
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

    return (
      <div className="flex justify-center">
        <div className='w-1/2 border bg-white shadow-md cursor-pointer rounded-[4px] dark:bg-slate-900 mb-4 h-4/6 lg:mb-3'>
          <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] dark:bg-slate-900 border-[#EDEDED]'>
            <h2 className='text-[16px] leading-[19px] font-bold text-[#4e73df]'> Result</h2>
            <FaEllipsisV color='gray' className='cursor-pointer' />
          </div>
          <div className='lineChart '>
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
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='score' stroke='#8884d8' activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className='bg-gray-200 dark:bg-slate-900 ml-3 p-2 rounded-lg h-[350px] shadow-md'>
          <h2 className='text-xl font-semibold'>Exam Details</h2>
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


const Single = () => {
  const { user_id } = useParams(); // Retrieve the user ID from the route

  const [userData, setUserData] = useState(null);
  const [latestActivities, setLatestActivities] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleOpen = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close the accordion if it's already open
    } else {
      setActiveIndex(index); // Open the clicked accordion
    }
  };

  useEffect(() => {
    // Fetch user data based on the user ID
    async function fetchUserData() {
      try {
        const response = await axios.get(`https://smartexam.cyclic.app/users/users/${user_id}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, [user_id]);

  useEffect(() => {
    // Fetch latest activities based on the user ID
    async function fetchLatestActivities() {
      try {
        const response = await axios.get(`https://smartexam.cyclic.app/users/fetch-latest/${user_id}`);
        setLatestActivities(response.data.latestActivities);
      } catch (error) {
        console.error('Error fetching latest activities:', error);
      }
    }

    fetchLatestActivities();
  }, [user_id]);

  const imageUrl = userData ? userData.image || "/noavatar.png" : "/noavatar.png";

  return (
    <div className="single">
      <div className="view">
        <div className="info">
          <div className="topInfo">
            <img src={imageUrl} alt="" />
          </div>
          <div className="details">
            {userData && (
              <div className="item">
                <span className="itemTitle">Name:</span>
                <span className="itemValue">{userData.name}</span>
              </div>
            )}
            {userData && (
              <div className="item">
                <span className="itemTitle">Email:</span>
                <span className="itemValue">{userData.username}</span>
              </div>
            )}
            {userData && (
              <div className="item">
                <span className="itemTitle">School ID:</span>
                <span className="itemValue">{userData.school_id}</span>
              </div>
            )}
            {userData && (
              <div className="item">
                <span className="itemTitle">Status:</span>
                <span className="itemValue">{userData.status}</span>
              </div>
            )}
            {userData && (
              <div className="item">
                <span className="itemTitle">Verified:</span>
                <span className="itemValue">{userData.isVerified ? 'Yes' : 'No'}</span>
              </div>
            )}
          </div>
        </div>
        <hr />
        <div className="chart">
          {/* <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={props.chart.data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {props.chart.dataKeys.map((dataKey) => (
                <Line
                  type="monotone"
                  dataKey={dataKey.name}
                  stroke={dataKey.color}
                />
              ))}
            </LineChart>
          </ResponsiveContainer> */}
        </div>
      </div>
      <div className="activities">
        <h2>Latest Activities</h2>
        <AccordionLayout
          title={(
            <ul className="activity-list">
              {latestActivities.map((activity, index) => (
                <li key={index}>
                  <div>
                    <p>{`Took the exam with a category of ${competencyMap[activity.competency_id]}.`}</p>
                    <time>{activity.end_time}</time>
                  </div>
                  <div>{processExamScores(activity)}</div>
                </li>
              ))}
            </ul>
          )}
          index={activeIndex}
          activeIndex={activeIndex}
          setActiveIndex={handleOpen}
        />
      </div>
    </div>
  );
};

export default Single;
