import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Schedule from "./pages/Schedule";
import QuanLyGioGiang from "./pages/StandardHours";
import ProgramManagement from './pages/ProgramManagement';
import Sidebar from './components/Sidebar';
import CourseManagement from './pages/CourseManagement';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      <Sidebar>
        <Routes>
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/time" element={<QuanLyGioGiang />} />
          <Route path="/" element={<ProgramManagement />} />
          <Route path="/course" element={<CourseManagement />} />
        </Routes>
      </Sidebar>

    </Router>
  );
}

export default App;
