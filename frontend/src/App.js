import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { Toaster } from "react-hot-toast";

import HrDashboard from './Pages/HrDashboard';
import DeliveryDashboard from './Pages/DeliveryDashboard';
import LoginPage from './Pages/Login';
import AttendencePage from './Pages/AttendencePage';
import DriverPortal from './Pages/DriverPortal';
import UserProfile from './Pages/UserProfile';
import HomePage from './Pages/HomePage';
import OrderDashboard from './Pages/OrderDashboard';
import CartPreview from './Components/CartPreview';
import ProductPage from './Pages/customer/productsPage';
import ProductOverViewPage from './Pages/customer/productOverview';
import CartPage from './Pages/customer/cart';
import PaymentPage from './Pages/PaymentPage';
import AdminPage from './Pages/adminPage';
import SearchProductPage from './Pages/customer/searchProduct';

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

function Appwrapper() {
  return (
    <div>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <Routes>
        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
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
        <Route path="/cart/preview" element={<CartPreview />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/search" element={<SearchProductPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Appwrapper />
    </Router>
  );
}

export default App;
