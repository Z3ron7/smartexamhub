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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    setLoading(true);
    axios.post('https://smartexam.cyclic.app/login', values, { withCredentials: true })
      .then((res) => {
        if (res.data.Status === 'Login Successful') {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('role', res.data.role);
          localStorage.setItem('user_id', res.data.user_id);
          localStorage.setItem('isVerified', res.data.isVerified ? '1' : '0');
          const userRole = res.data.role;
  
          // Access the isVerified status from the response
          const isVerified = res.data.isVerified;

          if (userRole === 'Exam-taker') {
            if (isVerified === 1) {
              // User is verified, redirect to the student dashboard
              navigate('/student-dashboard');
              alert('Login successfully.');
            } else {
              // User is not verified, display an error message
              setError('Your account is not yet verified. Please wait for the administrator to verify your account.');
            }
          } else {
            // Handle different user roles as needed and redirect accordingly
            let dashboardURL = '/admin-dashboard'; // Default URL
            if (userRole === 'Admin') {
              dashboardURL = '/admin-dashboard';
            }
            //  else if (userRole === 'Super Admin') {
            //   dashboardURL = '/admin-dashboard';
            // }
            navigate(dashboardURL);
            alert('Login successfully.');
          }
        } else {
          // Display an alert if the login was unsuccessful
          alert('Incorrect username or password. Please try again.');
        }
      })
      .catch((error) => {
        console.error(error.response);
        // Display an alert for other errors
        setError('An error occurred during login. Please try again.');
      })
      .finally(() => {
        setTimeout(() => {
          // Reset the loading state to false after 2 seconds
          setLoading(false);
        }, 2000);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <div className="bg-white" style={{ backgroundImage: `url(${LP})`, backgroundSize: "100% 100%", backgroundPosition: "center", display: "flex", flexDirection: "column", alignItems: "center", height: "100vh" }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-24">
          <h2 className="text-center text-2xl font-bold font-mono tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="text-red-600">{error}</div>
        )}
        <div className="mt-5 sm:mx-auto px-5 sm:w-[320px] lg:w-[390px] h-72 pt-4 shadow-black shadow-lg">
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
            <div className="mt-2 relative rounded-md shadow-sm">
              <inputs
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                required
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-500 focus:outline-none focus:shadow-outline-blue active:shadow-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className='flex justify-center items-center '>
              <button
                type="submit"
                className={`flex w-1/2 rounded-md justify-center bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white
                transition-colors duration-200 transform shadow-md hover:shadow-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  isLoading ? 'bg-indigo-500 font-semibold cursor-not-allowed' : 'bg-indigo-700 hover-translate-y-1'
                }duration-300`}
              >
                {isLoading ? (
                  <span className="mr-2">
                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  </span>
                ) : null}
                {isLoading ? 'Processing...' : 'Sign in'}
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-white">
            You don't have an account yet? {' '}
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
