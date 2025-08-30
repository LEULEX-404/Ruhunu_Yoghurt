import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';

import HrDashboard from './Pages/HrDashboard';

axios.defaults.baseURL = 'http://localhost:8070'; 
axios.defaults.withCredentials = true;

function Appwrapper() {

  return(
    <div>
    <Routes>
      <Route path="/hrDashboard" element={<HrDashboard />} />
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

