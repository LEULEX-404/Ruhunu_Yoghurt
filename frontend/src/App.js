import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';

import HrDashboard from './Pages/HrDashboard';
import DeliveryDashboard from './Pages/DeliveryDashboard';
import LoginPage from './Pages/Login';
import AttendencePage from './Pages/AttendencePage';

axios.defaults.baseURL = 'http://localhost:8070'; 
axios.defaults.withCredentials = true;

function Appwrapper() {

  return(
    <div>
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/hrDashboard" element={<HrDashboard />} />
      <Route path="/deliveryDashboard" element ={<DeliveryDashboard/>} />
      <Route path="/attendence" element ={<AttendencePage/>} />
    </Routes>
    </div>
  )
}

function App(){
  return(
    <Router>
      <Appwrapper />
    </Router>
  )
}

export default App;

