import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import logo from './images/mainLogo.png';

import HrDashboard from './Pages/HrDashboard';
import DeliveryDashboard from './Pages/DeliveryDashboard';
import LoginPage from './Pages/Login';
import AttendencePage from './Pages/AttendencePage';
import DriverPortal from './Pages/DriverPortal';
import UserProfile from './Pages/UserProfile';
import HomePage from './Pages/HomePage';
import OrderDashboard from './Pages/OrderDashboard';
import ProductPage from './Pages/customer/productsPage';
import ProductOverViewPage from './Pages/customer/productOverview';
import CartPage from './Pages/customer/cart';
import PaymentPage from './Pages/customer/payment';
import AdminPage from './Pages/adminPage';

import AddSupplierPage from './Pages/admin/addSupplier';
import AddRawMaterialPage from './Pages/admin/addRawmaterial';
import UpdateSupplierPage from './Pages/admin/Supplierupdate';
import UpdateRawMaterialPage from './Pages/admin/Rawmaterialupdate';
import SupplierTable from './Pages/Supplierdetails';
import RawMaterialTable from './Pages/Rawmaterialdetails';
import Stockpage from './Pages/StockDashboard';
import AddRawMaterialForm from './Pages/admin/addrawstockform';
import RawMaterialWithHistory from './Pages/admin/Rawhistory';
import AddRemoveProductForm from './Pages/admin/add productstock';
import Smdashboardpage from './Pages/admin/smdashboard';
import ProductTable from './Pages/StockDashboard';
import RequestRawMaterialEmail from './Pages/admin/reqrawmaterial';
import RawMaterialRequestTable from './Pages/RawMaterialRequestTable';

// Axios global config    

axios.defaults.baseURL = 'http://localhost:8070'; 
axios.defaults.withCredentials = true;

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  return null;
}

function Appwrapper() {
  return (

      <Routes>
        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* User */}
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/attendence" element={<AttendencePage />} />

        {/* Manager/Dashboard */}
        <Route path="/hrDashboard" element={<HrDashboard />} />
        <Route path="/deliveryDashboard" element={<DeliveryDashboard />} />
        <Route path="/orderDashboard" element={<OrderDashboard />} />
        <Route path="/driverPortal" element={<DriverPortal />} />
        <Route path="/smdashboard" element={<Smdashboardpage />} />
        <Route path="/stockpage" element={<Stockpage />} />
        <Route path="/productStock" element={<ProductTable />} />
        <Route path="/Reqrawmaterial" element={<RequestRawMaterialEmail />} />
        <Route path="/rawMaterialRequests" element={<RawMaterialRequestTable />} /> 


        {/* Admin */}
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/addSupplier" element={<AddSupplierPage />} />
        <Route path="/addRawmaterial" element={<AddRawMaterialPage />} />
        <Route path="/updateSupplier/:id" element={<UpdateSupplierPage />} />
        <Route path="/updateRawmaterial/:id" element={<UpdateRawMaterialPage />} />
        <Route path="/suplierTable" element={<SupplierTable />} />
        <Route path="/addrawmaterialform" element={<AddRawMaterialForm />} />
        <Route path="/rawmaterialhistory" element={<RawMaterialWithHistory />} />
        <Route path="/addproductform" element={<AddRemoveProductForm />} />
        <Route path="/rawmaterialTable" element={<RawMaterialTable />} />


        {/* Customer */}
        <Route path="/products" element={<ProductPage />} />
        <Route path="/overview/:id" element={<ProductOverViewPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/cart/preview" element={<Navigate to="/payment" replace />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/search" element={<Navigate to="/products?search=1" replace />} />
      </Routes>
  );
}

function App() {
  const [isPreloading, setIsPreloading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsPreloading(false), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      {isPreloading && (
        <div className="app-preloader" role="status" aria-live="polite" aria-label="Loading Ruhunu Yoghurt">
          <div className="preloader-card">
            <div className="preloader-logo-ring">
              <img src={logo} alt="Ruhunu Yoghurt" className="preloader-logo" />
            </div>
            <div className="preloader-copy">
              <span>Fresh dairy loading</span>
              <h1>Ruhunu Yoghurt</h1>
            </div>
            <div className="preloader-bar" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
      )}
      <Appwrapper />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            border: '1px solid rgba(23, 43, 31, 0.12)',
            borderRadius: '8px',
            background: '#fff',
            color: '#172b1f',
            fontWeight: 800,
            boxShadow: '0 18px 42px rgba(23, 43, 31, 0.14)',
          },
          success: {
            iconTheme: {
              primary: '#216f49',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#9a2525',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
