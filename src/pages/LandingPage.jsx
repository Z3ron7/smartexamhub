import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import SE from "../assets/images/SE.png"
import landing from "../assets/images/landing.png"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-blue-300 h-screen bg-gradient-to-r from-blue-400 to-indigo-700 " >
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center pt-0 mb-3 justify-between px-6" aria-label="Global">
          <div className='flex'>
            <img src={SE}
            className=' h-auto w-16 lg:w-20 object-cover'
      />
          </div>
        <div className=" lg:flex lg:flex-1 lg:justify-start">
            <Link to="/" className="text-xl font-bold font-mono text-white hover:text-blue-300">
              SmartExam
            </Link>
          </div>
          <div className=" lg:flex lg:flex-1 lg:justify-end">
            <Link to="/Log-in" className="text-md font-semibold font-mono leading-6 text-white hover:text-blue-300">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>
      <div className='flex flex-col md:flex-row items-center justify-between w-full'>
      <div className="relative isolate px-6 pt-5 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl pt-10">
          <div className="text-center">
            <h1 className="text-2xl font-semibold font-mono text-white sm:text-4xl">
            Discover the potential of our Smart Exam system, designed to empower social work students on their journey to success.
            </h1>
            {/* <p className="mt-6 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Dream big, work hard, and ignite social change. 
            Your commitment is the key to a better society. Our platform is here to help you prepare for the board exam, 
            allowing you to practice and refine your skills.
            </p> */}
            <div className="mt-3 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md hover:bg-indigo-600 border-2 shadow-md border-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:text-white bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='lg:mt-7 md:mt-4 sm:mt-2 lg:mr-10 '>
      <div className='bg-white flex mt-24 md:mt-36 lg:mt-40 h-64 justify-center mx-2 rounded-2xl skew-y-6'></div>
          <img src={landing}
        className=' h-auto w-[600px] relative mt-[-21rem] md:mt-[-20rem] lg:mt-[-25rem] object-cover'
      />
          </div>
    </div>
    </div>
  )
}
