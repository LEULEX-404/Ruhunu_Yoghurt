import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';

import HrDashboard from './Pages/HrDashboard';
import DeliveryDashboard from './Pages/DeliveryDashboard';
import LoginPage from './Pages/Login';
import AttendencePage from './Pages/AttendencePage';
import DriverPortal from './Pages/DriverPortal';
import UserProfile from './Pages/UserProfile';
import ProductPage from './Pages/customer/productsPage';
import ProductOverViewPage from './Pages/customer/productOverview'
import CartPage from './Pages/customer/cart';
import { Toaster } from 'react-hot-toast';

axios.defaults.baseURL = 'http://localhost:8070'; 
axios.defaults.withCredentials = true;

function Appwrapper() {

  return(
    <div>
       <Toaster position='top-right'/>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/userProfile" element={<UserProfile/>}/>
      <Route path="/hrDashboard" element={<HrDashboard />} />
      <Route path="/deliveryDashboard" element ={<DeliveryDashboard/>} />
      <Route path="/attendence" element ={<AttendencePage/>} />
      <Route path="/driverPortal" element ={<DriverPortal/>} />
      <Route path='/products' element = {<ProductPage/>}/>
      <Route path='/overview/:id' element={<ProductOverViewPage/>}/>
      <Route path='/cart' element={<CartPage/>}/>
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

