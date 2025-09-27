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
import ProductPage from './Pages/customer/productsPage';
import ProductOverViewPage from './Pages/customer/productOverview'
import CartPage from './Pages/customer/cart';
import { Toaster } from 'react-hot-toast';
import PaymentPage from './Pages/customer/payment';
import AdminPage from './Pages/adminPage';
import SearchProductPage from './Pages/customer/searchProduct';

axios.defaults.baseURL = 'http://localhost:8070'; 
axios.defaults.withCredentials = true;

function Appwrapper() {

  return(
    <div>
       <Toaster position='top-right'/>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/userProfile" element={<UserProfile/>}/>
      <Route path="/hrDashboard" element={<HrDashboard />} />
      <Route path="/deliveryDashboard" element ={<DeliveryDashboard/>} />
      <Route path="/attendence" element ={<AttendencePage/>} />
      <Route path="/driverPortal" element ={<DriverPortal/>} />
      <Route path="/orderDashboard" element ={<OrderDashboard/>} />
      <Route path='/products' element = {<ProductPage/>}/>
      <Route path='/overview/:id' element={<ProductOverViewPage/>}/>
      <Route path='/cart' element={<CartPage/>}/>
      <Route path='/payment' element={<PaymentPage/>}/>
      <Route path='/search' element={<SearchProductPage/>}/>
      <Route path='/admin/*' element={<AdminPage/>}/>
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

