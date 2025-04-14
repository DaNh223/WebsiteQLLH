// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Schedule from "./pages/Schedule";
// import QuanLyGioGiang from "./pages/StandardHours";
// import ProgramManagement from './pages/ProgramManagement';
// import CourseManagement from './pages/CourseManagement';
// import Login from './pages/Login';
// import SidebarLayout from './components/Sidebar';

// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function App() {
//   return (
//     <Router>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//       <Routes>
//         {/* Login không có sidebar */}
//         <Route path="/login" element={<Login />} />

//         {/* Các route khác có sidebar */}
//         <Route element={<SidebarLayout />}>
//           <Route path="/" element={<ProgramManagement />} />
//           <Route path="/schedule" element={<Schedule />} />
//           <Route path="/time" element={<QuanLyGioGiang />} />
//           <Route path="/course" element={<CourseManagement />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Schedule from "./pages/Schedule";
import QuanLyGioGiang from "./pages/StandardHours";
import ProgramManagement from './pages/ProgramManagement';
import CourseManagement from './pages/CourseManagement';
import Login from './pages/Login';
import SidebarLayout from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrganizationManagement from './pages/DepartmentManagement';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        {/* Login không có sidebar */}
        <Route path="/login" element={<Login />} />

        {/* Các route khác có sidebar, sử dụng ProtectedRoute để bảo vệ */}
        <Route element={<ProtectedRoute> <SidebarLayout /> </ProtectedRoute>}>
          <Route path="/" element={<ProgramManagement />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/time" element={<QuanLyGioGiang />} />
          <Route path="/course" element={<CourseManagement />} />
          <Route path="/org" element={<OrganizationManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
