import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BsArrowLeftCircle, BsCardList } from 'react-icons/bs';
import { AiFillPieChart } from 'react-icons/ai';
import { PiExamFill } from 'react-icons/pi';
import { RiFolderHistoryFill } from 'react-icons/ri';
import { SiGoogleclassroom } from 'react-icons/si';
import { MdViewComfy } from 'react-icons/md';
import Logo from '../assets/images/logo.png';
import HamburgerButton from './HamburgerMenuButton/HamburgerButton';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'

const SidebarStudents = () => {
  const [open, setOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [viewResultOpen, setViewResultOpen] = useState(false); // To control the visibility of the sub-menu
  const location = useLocation();

  const Menus = [
    { title: 'Dashboard', path: '/student-dashboard', src: <AiFillPieChart /> },
    { title: 'Exam', path: '/exam', src: <PiExamFill /> },
    {
      title: 'View Result',
      path: false,
      src: <RiFolderHistoryFill />,
      subMenus: [ // Add sub-menus here
        { title: 'Exam', path: '/exam-results', src: <BsCardList /> },
        { title: 'Personalize Exam', path: '/result', src: <MdViewComfy /> },
      ],
    },
    { title: 'Room', path: '/student-room', src: <SiGoogleclassroom /> },
  ];

  const toggleViewResult = () => {
    setViewResultOpen(!viewResultOpen);
  };
  return (
    <>
      <div onClick={() => setMobileMenu(false)}
        className={`${
          open ? 'w-60' : 'w-fit'
        } hidden sm:block relative h-screen duration-300 bg-gray-300 border-r border-gray-200 dark:border-gray-600 pt-4 dark:bg-slate-900 `}
        style={{
          position: 'sticky',
          top: 0,
        }}
      >
        <BsArrowLeftCircle
          className={`${
            !open && 'rotate-180'
          } absolute text-3xl bg-white fill-slate-800  rounded-full cursor-pointer top-9 -right-4 dark:fill-gray-400 dark:bg-gray-800`}
          onClick={() => setOpen(!open)}
        />
        <Link to='/'>
          <div className={`flex ${open && 'gap-x-4'} items-center`}>
            <img src={Logo} alt='' className='pl-2 w-16 h-16' />
            {open && (
              <span className='text-xl font-medium font-mono whitespace-nowrap dark:text-white'>
                Smart Exam
              </span>
            )}
          </div>
        </Link>
        <ul className='pt-6'>
          {Menus.map((menu, index) => (
            <Link to={menu.path} key={index}>
              <li
                className={`
                  flex items-center gap-x-3 p-3 text-base font-semibold rounded-lg cursor-pointer font-mono
                  hover:text-white dark:text-white hover:bg-indigo-700 dark:hover-bg-indigo-700
                  transition-transform ease-in-out ${menu.gap ? 'mt-9' : 'mt-2'}
                  ${location.pathname === menu.path && 'bg-indigo-700 dark:bg-indigo-700 text-white transform scale-110'}
                `}
                onClick={() => {
                  if (menu.title === 'View Result') {
                    setViewResultOpen(!viewResultOpen);
                  } else {
                    setMobileMenu(false);
                  }
                }}
              >
              {menu.title === 'View Result' && (
                <>
                  <span className='text-xl mx-2 py-1'>{menu.src}</span>
                  <span>{menu.title}</span>
                  {viewResultOpen === true ? (
                    <FaChevronUp className="w-4 h-4 font-bold" />
                    ) : (
                    <FaChevronDown className="w-4 h-4 font-bold" />
                    )}
                </>
              )}
              {menu.title !== 'View Result' && (
                <>
                  <span className='text-xl mx-2 py-1'>{menu.src}</span>
                  <span>{menu.title}</span>
                </>
              )}
                {/* Render sub-menus for 'View Result' when clicked */}
              </li>
              {menu.title === 'View Result' && viewResultOpen && (
                  <ul className="mt-2 ">
                  {menu.subMenus.map((subMenu, subIndex) => (
                    <Link to={subMenu.path} key={subIndex}>
                      <li
                        className={`
                          flex items-center gap-x-4 p-3 pl-7 text-base rounded-lg cursor-pointer mt-2
                          hover:text-white dark:text-white hover:bg-indigo-700 dark:hover-bg-indigo-700
                          transition-transform ease-in-out font-semibold ${menu.gap ? 'mt-9' : 'mt-2'}
                          ${location.pathname === subMenu.path && 'bg-indigo-700 dark:bg-indigo-700 text-white transform scale-110'}
                        `}
                      >
                        <span className='text-xl mx-2 py-1'>{subMenu.src}</span>
                        {subMenu.title}
                      </li>
                    </Link>
                  ))}
                </ul>
                )}
            </Link>
          ))}
        </ul>
      </div>
      {/* Mobile Menu */}
      <div className="pt-3">
        <HamburgerButton setMobileMenu={setMobileMenu} mobileMenu={mobileMenu} />
      </div>
      <div className="sm:hidden">
        <div
        onClick={() => setMobileMenu(false)}
          className={`${
            mobileMenu ? 'flex' : 'hidden'
          } absolute z-50 flex-col items-start self-end py-8 mt-16 space-y-2 font-bold sm:w-auto left-6 right-6 dark:text-white  bg-gray-50 dark:bg-slate-800 drop-shadow md rounded-xl`}
        >
          {Menus.map((menu, index) => (
            <Link to={menu.path} key={index} onClick={() => setMobileMenu(!viewResultOpen)}>
              <li
                className={` ${
                  location.pathname === menu.path &&
                  'bg-gray-200 dark:bg-gray-700'
                } p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center`}
                
                onClick={() => {
                  if (menu.title === 'View Result') {
                    setViewResultOpen(!viewResultOpen); // Toggle the state
                  } else {
                    setMobileMenu(false);
                  }
                }}
              >
                <span className='text-2xl mx-2 py-1'>{menu.src}</span>
                {menu.title}
              </li>
              {menu.title === 'View Result' && viewResultOpen && (
                  <ul className="mt-2 ">
                  {menu.subMenus.map((subMenu, subIndex) => (
                    <Link to={subMenu.path} key={subIndex}>
                      <li
                        className={`
                          flex items-center gap-x-4 p-3 pl-7 text-base rounded-lg cursor-pointer mt-2
                          hover:text-white dark:text-white hover:bg-indigo-700 dark:hover-bg-indigo-700
                          transition-transform ease-in-out font-semibold ${menu.gap ? 'mt-9' : 'mt-2'}
                          ${location.pathname === subMenu.path && 'bg-indigo-700 dark:bg-indigo-700 text-white transform scale-110'}
                        `}
                      >
                        <span className='text-xl mx-2 py-1'>{subMenu.src}</span>
                        {subMenu.title}
                      </li>
                    </Link>
                  ))}
                </ul>
                )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SidebarStudents;
