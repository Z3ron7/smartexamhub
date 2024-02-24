import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function PageNotFound() {
  const [userRole, setUserRole] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  const goBack = () => {
    // Check the user's role and navigate accordingly
    if (userRole === 'Super Admin') {
      navigate('/admin-dashboard'); // Redirect admin to /dashboard
    } else if (userRole === 'Admin') {
      navigate('/admin-dashboard'); // Redirect admin to /dashboard
    } else if (userRole === 'Exam-taker') {
      navigate('/student-dashboard'); // Redirect student to /student-dashboard
    } else {
      navigate('/'); // Redirect to the default page
    }
  };

  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={goBack}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default PageNotFound;
