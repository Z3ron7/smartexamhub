import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./single.scss";
import { useParams } from "react-router-dom";
import AccordionLayout from '../../components/accordion/AccordionLayout'


function formatDate(date) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function getTimeAgo(time) {
  const currentTime = new Date();
  const activityTime = new Date(time);

  // Calculate the time difference in milliseconds
  const timeDiffInMilliseconds = currentTime.getTime() - activityTime.getTime();

  // Define time units
  const hour = 60 * 60 * 1000; // 1 hour in milliseconds
  const day = 24 * hour; // 1 day in milliseconds
  const month = 30 * day; // 1 month in milliseconds

  if (timeDiffInMilliseconds < hour) {
    const minutes = Math.floor(timeDiffInMilliseconds / 60000); // Convert milliseconds to minutes
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (timeDiffInMilliseconds < day) {
    const hours = Math.floor(timeDiffInMilliseconds / hour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (timeDiffInMilliseconds < month) {
    const days = Math.floor(timeDiffInMilliseconds / day);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    const months = Math.floor(timeDiffInMilliseconds / month);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
}

const competencyMap = {
  '1': 'SWWPS',
  '2': 'Casework',
  '3': 'HBSE',
  '4': 'CO',
  '5': 'Groupwork',
  '6': 'All Competency'
  // Add more mappings as needed
}

const Single = () => {
  const { user_id } = useParams(); // Retrieve the user ID from the route

  const [userData, setUserData] = useState(null);
  const [latestActivities, setLatestActivities] = useState([]);

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
        console.log("latest", response.data.latestActivities)
      } catch (error) {
        console.error('Error fetching latest activities:', error);
      }
    }
    fetchLatestActivities();
  }, [user_id]);
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
  return (
    <div className="single">
      <div className="view">
        <div className="info">
          <div className="topInfo">
            {userData && <img src={userData.image} alt="" />}
          </div>
          <div className="details">
        {userData && (
          <div className="item">
            <span className="itemTitle dark:text-white">Name:</span>
            <span className="itemValue dark:text-white">{userData.name}</span>
          </div>
        )}
        {userData && (
          <div className="item">
            <span className="itemTitle dark:text-white">Email:</span>
            <span className="itemValue dark:text-white">{userData.username}</span>
          </div>
        )}
        {userData && (
          <div className="item">
            <span className="itemTitle dark:text-white">School ID:</span>
            <span className="itemValue dark:text-white">{userData.school_id}</span>
          </div>
        )}
        {userData && (
          <div className="item">
            <span className="itemTitle dark:text-white">Status:</span>
            <span className="itemValue dark:text-white">{userData.status}</span>
          </div>
        )}
        {userData && (
          <div className="item">
            <span className="itemTitle dark:text-white">Verified:</span>
            <span className="itemValue dark:text-white">{userData.isVerified ? 'Yes' : 'No'}</span>
          </div>
        )}
      </div>
        </div>
        <hr />
          {/* <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
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
            </ResponsiveContainer>
          </div> */}
      </div>
      <div className="activities">
  <h2 className="dark:text-white">Latest Activities</h2>
  <ul className="activity-list">
  {latestActivities.map((exam, index) => {
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
    </ul>
</div>

    </div>
  );
  
};


export default Single;