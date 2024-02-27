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
  const timeDiffInMilliseconds = currentTime - activityTime;

  // Define time units
  const minute = 60 * 1000; // 1 minute in milliseconds
  const hour = 60 * minute; // 1 hour in milliseconds
  const day = 24 * hour; // 1 day in milliseconds
  const month = 30 * day; // 1 month in milliseconds

  if (timeDiffInMilliseconds < minute) {
    const seconds = Math.floor(timeDiffInMilliseconds / 1000);
    return `Less than a minute ago`;
  } else if (timeDiffInMilliseconds < hour) {
    const minutes = Math.floor(timeDiffInMilliseconds / minute);
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
      {latestActivities.map((activity, index) => (
        <li key={index}>
          <div>
          <p className="dark:text-white">{`Took the exam with a category of ${competencyMap[activity.competency_id]}`}</p>
          <time className="dark:text-white">{getTimeAgo(new Date(activity.end_time))}</time>
          </div>
        </li>
      ))}
    </ul>
</div>
    </div>
  );
};


export default Single;