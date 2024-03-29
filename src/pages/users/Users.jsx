import React, { useState, useEffect } from "react";
import Add from "../../components/add/Add";
import DataTable from "../../components/dataTable/DataTable";
import "./users.scss";
import axios from "axios";

const columns = [
  
  {
    field: "image",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => {
      const imageUrl = params.row.image || "/noavatar.png";
      return (
        <img
          src={imageUrl}
          alt=""
          style={{ width: 40, height: 40 }}
        />
      );
    },    
  },  
  {
    field: "name",
    type: "string",
    headerName: "Full name",
    width: 150,
  },
  {
    field: "gender",
    type: "string",
    headerName: "Gender",
    width: 130,
  },
  {
    field: "school_id",
    type: "string",
    headerName: "School ID",
    width: 130,
  },
  {
    field: "username",
    type: "string",
    headerName: "Email",
    width: 250,
  },
  {
    field: "status",
    type: "string",
    headerName: "Status",
    width: 120,
  },
];

const Users = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]); // State to store fetched data
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch data from the backend
  const fetchData = () => {
    axios.get("https://smartexam.cyclic.app/users/users")
      .then((response) => {
        console.log("Data received:", response.data); // Add this line to log the data
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  };
  

  const handleDelete = (user_id) => {
    axios.delete(`https://smartexam.cyclic.app/users/users/${user_id}`)
      .then((response) => {
        if (response.status === 200) {
          // User deleted successfully
          console.log("User deleted successfully");

          // Refresh the data after a successful delete
          fetchData();
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  useEffect(() => {
    fetchData(); // Fetch data initially
  }, []);

  return (
    <div className="users">
      <div className="flex justify-center info">
        <h1 className="dark:text-white flex justify-center font-bold text-3xl">USERS</h1>
        <div className="flex items-end marker:justify-end">
          
        </div>
      </div>

      {isLoading ? (
        <div class="flex  w-full h-24 border-2 rounded-md mx-auto mt-20">
        <div class="flex justify-center items-center p-4 animate-pulse flex-row h-full space-x-7">
        <div class="w-7 bg-gray-300 h-5 ">
          </div>
          <div class="w-7 bg-gray-300 h-5">
          </div>
          <div class="w-12 bg-gray-300 h-5 ">
          </div>
          <div class="w-14 bg-gray-300 h-5 ">
          </div>
          <div class="w-20 bg-gray-300 h-5 ">
          </div>
          <div class="w-20 bg-gray-300 h-5 ">
          </div>
              <div class="flex flex-col space-y-3">
              <div class="w-full bg-gray-300 h-6 rounded-md ">
              </div>
              <div class="w-full bg-gray-300 h-6 rounded-md ">
              </div>
          </div>
        </div>
      </div>
      
      ) : (
        <DataTable slug="users" columns={columns} rows={data} handleDelete={handleDelete} />
      )}

      {open && <Add slug="user" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Users;
