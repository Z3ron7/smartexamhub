import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BsArrowLeftCircle, BsCardList } from 'react-icons/bs'
import { AiFillPieChart } from 'react-icons/ai'
import { BsPeopleFill } from 'react-icons/bs'
import { RiQuestionnaireFill } from 'react-icons/ri'
import { SiGoogleclassroom } from 'react-icons/si'
import { RiAdminFill } from 'react-icons/ri'
import Logo from '../assets/images/logo.png'
import HamburgerButton from './HamburgerMenuButton/HamburgerButton'

const SidebarSuper = () => {
  const [open, setOpen] = useState(true)
  const [mobileMenu, setMobileMenu] = useState(false)
  const location = useLocation()

  const Menus = [
    { title: 'Dashboard', path: '/super-dashboard', src: <AiFillPieChart /> },
    { title: 'Users', path: '/users', src: <BsPeopleFill /> },
    { title: 'Questionnaire', path: '/questionnaire', src: <RiQuestionnaireFill /> },
    { title: 'Room', path: '/room', src: <SiGoogleclassroom /> },
    { title: 'Exam Result', path: '/exam-result', src: <BsCardList /> },
    { title: 'Admin', path: '/add-admin', src: <RiAdminFill /> },
    // { title: 'Signin', path: '/login', src: <SiFuturelearn />, gap: 'true' },
  ]

  return (
    <>
      <div
        className={`${
          open ? 'w-60' : 'w-fit'
        } hidden sm:block relative h-screen duration-300 bg-gray-100 border-r-2 border-gray-600 dark:border-gray-600 pt-4 dark:bg-slate-900 `}
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
          <div className={`flex ${open && 'gap-x-3'} items-center`}>
            <img src={Logo} alt='' className='pl-2 h-16 w-16' />
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
        flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer font-mono
        hover:text-white dark:text-white hover:bg-indigo-700 dark:hover:bg-indigo-700
        transition-transform ease-in-out ${menu.gap ? 'mt-9' : 'mt-2'}
        ${location.pathname === menu.path && 'bg-indigo-800 dark:bg-indigo-700 text-white transform scale-110'}
      `}
    >
      <span className='text-2xl mx-2 py-1'>{menu.src}</span>
      <span className={`${
        !open && 'hidden'
      } origin-left duration-300 hover:block`}>
        {menu.title}
      </span>
    </li>
  </Link>
))}

        </ul>
      </div>
      {/* Mobile Menu */}
      <div className="pt-3">
        <HamburgerButton
          setMobileMenu={setMobileMenu}
          mobileMenu={mobileMenu}
        />
      </div>
      <div className="sm:hidden">
        <div
          className={`${
            mobileMenu ? 'flex' : 'hidden'
          } absolute z-50 flex-col items-center self-end py-8 mt-16 space-y-6 font-bold sm:w-auto left-6 right-6 dark:text-white  bg-gray-50 dark:bg-slate-800 drop-shadow md rounded-xl`}
        >
          {Menus.map((menu, index) => (
            <Link
              to={menu.path}
              key={index}
              onClick={() => setMobileMenu(false)}
            >
              <span
                className={` ${
                  location.pathname === menu.path &&
                  'bg-gray-200 dark:bg-gray-700'
                } p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                {menu.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default SidebarSuper
