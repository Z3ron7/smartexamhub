import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

//Super Admin---------------------------
import ProfileS from './pages/SuperAdmin/Profile'
import LayoutSuper from './components/LayoutSuper';
import RoomSuper from './pages/SuperAdmin/Room';
import DashboardSuper from './pages/SuperAdmin/Dashboard'
import QuestionnaireSuper from './pages/SuperAdmin/Questionnaire'
import RegisterAdmin from './pages/SuperAdmin/RegisterAdmin';
import ViewRoom from './pages/SuperAdmin/ViewRoom';
import ExamResult from './pages/SuperAdmin/ExamResult';
import Users from './pages/users/Users';
import User from './pages/user/User';
//Admin----------------------------------
import ProfileA from './pages/Admin/Profile'
import Layout from './components/Layout';
import Dashboardss from './pages/Admin/Dashboard';
import Questionnairess from './pages/Admin/Questionnaire';
import Roomss from './pages/Admin/Rooms';
import Userss from './pages/users/Users';
import ExamResultss from './pages/Admin/ExamResults';
import ViewRooms from './pages/Admin/ViewRoom';
//Exam-takers----------------------------
import ProfileSt from './pages/Students/Profile'
import LayoutStudents from './components/LayoutStudents';
import RoomStudent from './pages/Students/Room';
import ExamRoom from './pages/Students/ExamRoom';
import ExamStart from './pages/Students/ExamStart';
import StudentDashboard from './pages/Students/StudentDashboard';
import Exam from './pages/Students/Exam'
import Analytics from './pages/Students/Analytics'
import ExamHistory from './pages/Students/ExamHistory'
import ExamHistorySet from './pages/Students/ExamHistorySet'
//Other components------------------------
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import Verification from './pages/Login/Verification';
import Register from './pages/Login/Register';
import PageNotFound from './pages/PageNotFound';
import ProtectedRoute from './pages/ProtectedRoute';
import LayoutUnverified from './components/LayoutUnverified';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  setIsLoggedIn(token !== undefined && token !== null);
  setUserRole(role);

  const updateVerificationStatus = (status) => {
    setIsVerified(status);
    localStorage.setItem('isVerified', status ? '1' : '0');
  };
  
  // Example usage after successful verification
  updateVerificationStatus(true);
}, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<PageNotFound />} />

        <Route path="/register" element={<Register />} />
        <Route path="/Log-in" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        {/* <Route path="/verification" element={<LayoutUnverified><Verification /></LayoutUnverified>} /> */}


        {/* Routes for super admin */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={<LayoutSuper><ProfileS /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/super-dashboard"
          element={
            <ProtectedRoute
              element={<LayoutSuper><DashboardSuper /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute
              element={<LayoutSuper><Users /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/users/:user_id"
          element={
            <ProtectedRoute
              element={<LayoutSuper><User /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/questionnaire"
          element={
            <ProtectedRoute
              element={<LayoutSuper><QuestionnaireSuper /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/room"
          element={
            <ProtectedRoute
              element={<LayoutSuper><RoomSuper /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/add-admin"
          element={
            <ProtectedRoute
              element={<LayoutSuper><RegisterAdmin /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/room/view-room/:room_id"
          element={
            <ProtectedRoute
              element={<LayoutSuper><ViewRoom /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/exam-result"
          element={
            <ProtectedRoute
              element={<LayoutSuper><ExamResult /></LayoutSuper>}
              allowedRoles={['Super Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />

        {/*------------------------------------ Routes for admin-------------------------------------- */}
        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute
              element={<LayoutSuper><ProfileA /></LayoutSuper>}
              allowedRoles={['Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute
              element={<Layout><Dashboardss /></Layout>}
              allowedRoles={['Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/admin-users"
          element={
            <ProtectedRoute
              element={<Layout><Userss /></Layout>}
              allowedRoles={['Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/admin-room"
          element={
            <ProtectedRoute
              element={<Layout><Roomss /></Layout>}
              allowedRoles={['Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/admin-questionnaire"
          element={
            <ProtectedRoute
              element={<Layout><Questionnairess /></Layout>}
              allowedRoles={['Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/admin-exam-result"
          element={
            <ProtectedRoute
              element={<Layout><ExamResultss /></Layout>}
              allowedRoles={['Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/room/view-rooms/:room_id"
          element={
            <ProtectedRoute
              element={<Layout><ViewRoom /></Layout>}
              allowedRoles={['Admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        {/* --------------------------------------Routes for student----------------------------------- */}
        <Route
          path="/profileS"
          element={
            <ProtectedRoute
              element={<LayoutStudents><ProfileSt /></LayoutStudents>}
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute
              element={
                isLoggedIn && isVerified ? (
                  <LayoutStudents>
                    <StudentDashboard />
                  </LayoutStudents>
                ) : (
                <LayoutUnverified>
                  <Verification />
                </LayoutUnverified>
                )
              }
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/exam"
          element={
            <ProtectedRoute
              element={<LayoutStudents><Exam /></LayoutStudents>}
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/exam/analytics"
          element={
            <ProtectedRoute
              element={<LayoutStudents><Analytics /></LayoutStudents>}
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute
              element={<LayoutStudents><ExamHistory /></LayoutStudents>}
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
         <Route
          path="/exam-results"
          element={
            <ProtectedRoute
              element={<LayoutStudents><ExamHistorySet /></LayoutStudents>}
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/student-room"
          element={
            <ProtectedRoute
              element={<LayoutStudents><RoomStudent /></LayoutStudents>}
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/student-room/exam-room/:room_id"
          element={
            <ProtectedRoute
              element={<LayoutStudents><ExamRoom /></LayoutStudents>}
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/student-room/exam-room/start-exam"
          element={
            <ProtectedRoute
              element={<LayoutStudents><ExamStart /></LayoutStudents>}
              allowedRoles={['Exam-taker']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route path="/" element={<LandingPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
