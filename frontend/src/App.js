import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';

import HrDashboard from './Pages/HrDashboard';
import DeliveryDashboard from './Pages/DeliveryDashboard';
import LoginPage from './Pages/Login';
import AttendencePage from './Pages/AttendencePage';
import DriverPortal from './Pages/DriverPortal';
import UserProfile from './Pages/UserProfile';
import HomePage from './Pages/HomePage';
import OrderDashboard from './Pages/OrderDashboard';
import CartPage from './Pages/customer/cart';


axios.defaults.baseURL = 'http://localhost:8070'; 
axios.defaults.withCredentials = true;

function Appwrapper() {

  return(
    <div>
    <Routes>

      <Route path="/" element={<Navigate to="/home" replace/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/userProfile" element={<UserProfile/>}/>
      <Route path="/hrDashboard" element={<HrDashboard />} />
      <Route path="/deliveryDashboard" element ={<DeliveryDashboard/>} />
      <Route path="/attendence" element ={<AttendencePage/>} />
      <Route path="/driverPortal" element ={<DriverPortal/>} />
      <Route path="/orderDashboard" element ={<OrderDashboard/>} />
      <Route path="/cart" element ={<CartPage/>} />

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

