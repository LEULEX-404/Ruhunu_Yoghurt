import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';

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
import ProductOverViewPage from './Pages/customer/productOverview'
import CartPage from './Pages/customer/cart';
import { Toaster } from 'react-hot-toast';

//import PaymentPage from './Pages/customer/payment';
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


axios.defaults.baseURL = 'http://localhost:8070'; 
axios.defaults.withCredentials = true;

function Appwrapper() {

  return(
    <div>

       <Toaster position='top-right'/>
    <Routes>


      <Route path="/" element={<Navigate to="/home" replace/>} />


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
      <Route path="/cart/preview" element ={<CartPreview/>} />

      <Route path='/products' element = {<ProductPage/>}/>
      <Route path='/overview/:id' element={<ProductOverViewPage/>}/>
      <Route path='/cart' element={<CartPage/>}/>
      <Route path='/cart/preview' element={<CartPage/>}/>
      <Route path='/payment' element={<PaymentPage/>}/>

      <Route path='/search' element={<SearchProductPage/>}/>
      <Route path='/admin/*' element={<AdminPage/>}/>
    </Routes>
      <Route path="/orderDashboard" element={<OrderDashboard />} />
      <Route path="/addSupplier" element={<AddSupplierPage/>} />
      <Route path="/addRawmaterial" element={<AddRawMaterialPage/>}/>
      <Route path="/updateSupplier/:id" element={<UpdateSupplierPage />} />
      <Route path="/updateRawmaterial/:id" element={<UpdateRawMaterialPage/>}/>
      <Route path="/suplierTable" element={<SupplierTable/>}/>
      <Route path="/rawmaterialTable" element={<RawMaterialTable/>}/>
      <Route path="/stockpage" element={<Stockpage/>}/>
      <Route path="/addrawmaterialform" element={<AddRawMaterialForm/>}/>
      <Route path="/rawmaterialhistory" element={<RawMaterialWithHistory/>}/>
      <Route path="/addproductform" element={<AddRemoveProductForm/>}/>
      <Route path="/smdashboard" element={<Smdashboardpage/>}/>
      <Route path="/productStock" element={<ProductTable/>}/>
    
      


    </Routes>
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

