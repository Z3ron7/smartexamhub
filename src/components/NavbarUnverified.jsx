import React, { useState, useEffect, Fragment } from "react";
import "./navbarstudents.scss";
import Toggle from "./ThemeToggle";
import { FaBell, FaCog } from "react-icons/fa";
import { HiOutlineBell } from "react-icons/hi";
import { Menu, Popover, Transition } from '@headlessui/react'
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import Cookies from 'js-cookie';

const NavbarUnverified = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  const showProfile = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    axios
      .get('http://localhost:3001/logout', { withCredentials: true })
      .then((res) => {
        localStorage.removeItem('token'); // Remove the token from local storage
        navigate('/');
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get('http://localhost:3001', { withCredentials: true })
      .then((res) => {
        if (res.data.Status === 'Success') {
          setAuth(true);
          setName(res.data.name);
          setImage(res.data.image);
        } else {
          setAuth(false);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  if (auth === null) {
    return <div>Loading...</div>;
  }
  return (
    <div className="navbar dark:bg-slate-900 border-b-2 dark:border-gray-700 dark:rounded-lg">
      <div className="flex items-center mx-auto">
      </div>

      <div className="icons">
        <div className="notification flex items-center gap-[25px] border-r-[1px] pr-[25px]">
        <Toggle />
        </div>

        <div className="flex items-center gap-[15px] relative" onClick={showProfile}>
          {auth ? ( // Check if user data is available
            <p className="dark:text-white text-black font-medium font-mono">
              {name}
            </p>
          ) : (
            <p className="dark:text-white text-black font-medium font-mono">Loading...</p>
          )}

          {auth ? ( // Check if user data is available
            <div className="user h-[50px] w-[50px] rounded-full cursor-pointer flex items-center justify-center relative z-40">
              <img src={image} alt="User Avatar" />
            </div>
          ) : (
            <div className="user h-[50px] w-[50px] rounded-full cursor-pointer flex items-center justify-center relative z-40">
              <p>Loading...</p>
            </div>
          )}

          {open && (
            <div className="bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]">
              <p className="cursor-pointer hover:text-[blue] font-semibold">
                Profile
              </p>
              <p
                className="cursor-pointer hover:text-[blue] font-semibold"
                onClick={handleLogout}
              >
                Log out
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarUnverified;
