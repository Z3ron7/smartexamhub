import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Spinner } from "@material-tailwind/react";
import LP from '../../assets/images/1.jpg'

function LoginPage() {
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post('https://smartexam.cyclic.app/users/login', values, { withCredentials: true })
      .then((res) => {
        if (res.data.Status === 'Login Successful') {
          localStorage.setItem('token', res.data.token);
          console.log('data user:', res.data)
          localStorage.setItem('role', res.data.role);
          localStorage.setItem('user_id', res.data.user_id);
          localStorage.setItem('isVerified', res.data.isVerified ? '1' : '0');
          const userRole = res.data.role;
  
          // Access the isVerified status from the response
          const isVerified = res.data.isVerified;
  
          

          if (userRole === 'Exam-taker') {
            if (isVerified) {
              // User is verified, redirect to the student dashboard
              navigate('/student-dashboard');
            } else {
              // User is not verified, redirect to the verification page
              navigate('/verification');
            }
          } else {
            // Handle different user roles as needed and redirect accordingly
            let dashboardURL = '/admin-dashboard'; // Default URL
            if (userRole === 'Admin') {
              dashboardURL = '/admin-dashboard';
            } else if (userRole === 'Super Admin') {
              dashboardURL = '/super-dashboard';
            }
            navigate(dashboardURL);
          }
          setTimeout(() => {
            // Reset the loading state to false after 2 seconds
            setLoading(false);
          }, 3000);
          alert('Login successfully.');
        } else {
          setError('Login failed. Please check your credentials.');
        }
      })
      .catch((err) => {
        console.error(err.response);
        setError('An error occurred during login.');
      });
  };
  
  return (
    <>
        <div className="bg-white" style={{ backgroundImage: `url(${LP})`, backgroundSize: "100% 100%", backgroundPosition: "center", display: "flex", flexDirection: "column", alignItems: "center", height: "100vh" }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-24">
         
          <h2 className="text-center text-2xl font-bold font-mono tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto px-5 sm:w-[320px] lg:w-[390px] h-64 pt-4 shadow-black shadow-lg">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <div className="mt-2">
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder='Email address'
                onChange={(e) => setValues({ ...values, username: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button" // Use a button for navigation
                  onClick={() => navigate('/forgot-password')} // Navigate to the forgot password page
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
            </div>
            <div className="mt-2">
              <input
                name="password"
                type="password"
                placeholder='Password'
                autoComplete="current-password"
                required
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600">{error}</div>
          )}

          <div className='flex justify-center items-center '>
            <button
              type="submit"
              className={`flex w-1/2 rounded-md justify-center bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white
              transition-colors duration-200 transform shadow-md hover:shadow-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                isLoading ? 'bg-indigo-500 font-semibold cursor-not-allowed' : 'bg-indigo-700 hover-translate-y-1'
              }duration-300`}
            >
              {isLoading ? <Spinner className="flex justify-center mr-2 font-medium"/> : null }
              {isLoading ? null : 'Sign in'}
            </button>
          </div>
        </form>
          <p className="mt-4 text-center text-sm text-white">
            Don't have an account yet? {' '}
            <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default LoginPage
