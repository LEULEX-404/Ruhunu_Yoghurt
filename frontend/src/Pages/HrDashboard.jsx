import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from "sonner";
import { confirmAlert } from 'react-confirm-alert';
import "react-toastify/dist/ReactToastify.css";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FiUserX, FiHome, FiLogOut, FiMoon,FiSun ,FiBarChart2, FiCheckSquare, FiUserCheck, FiUserPlus, FiClock, FiRefreshCw } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../Css/HrDashboard.css';
import HrReport from '../Pages/HrReport.jsx';

export default function HrDashboard() {
    const [employee, setEmployee] = useState("");

    const [employees, setEmployees] = useState([]);
    const [employeeSearch,setEmployeeSearch] = useState("");

    const [todaysAttendance, setTodaysAttendance] = useState([]);
    const [attendanceByDate, setAttendanceByDate] = useState([]);
    const [showEarlyLeave, setShowEarlyLeave] = useState(false);

    const [view, setView] = useState('dashboard');
    const [darkMode, setDarkMode] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);
    
    const [confirmPassword, setConfirmPassword] = useState("");

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [attendanceSummary, setAttendanceSummary] = useState({
      present: 0,
    });

    const fetchEmployee = async () =>{
        const storedEmployee = localStorage.getItem("user");
        if(storedEmployee){
            const parsedEmployee = JSON.parse(storedEmployee);
            const res = await axios.get(`http://localhost:8070/api/employees/${parsedEmployee.id}`)
            setEmployee(res.data);
        };
    };

    const fetchEmployees = async () => {
        try{
            const response = await axios.get(`http://localhost:8070/api/employees`);
            setEmployees(response.data);
        }catch(error){
            console.error('Error fetching employees:', error);
        }
    };

    const searchEmployees = async (searchText) =>{
        if (!searchText) return fetchEmployees();
        try{
            const res = await axios.get(
                `http://localhost:8070/api/employees/search?search=${searchText}`
            );
            setEmployees(res.data);
        }catch(err){
            console.error(err);
            toast.error("Failed to search Employees.");
        }
    };

    const fetchAttendance = async () => {
        try {
          const res = await axios.get("http://localhost:8070/api/attendance/today/attendence", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          setTodaysAttendance(res.data || []);
        } catch (error) {
          console.error("Error fetching attendance:", error);
          toast.error("Failed to load attendance");
          setTodaysAttendance([]);
        }
    };

    const fetchAttendanceByDate = async (date) => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const res = await axios.get(`http://localhost:8070/api/attendance/bydate?date=${formattedDate}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setAttendanceByDate(res.data || []);
        } catch (error) {
            console.error("Error fetching attendance for selected date:", error);
            toast.error("Failed to load attendance");
            setAttendanceByDate([]);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchEmployee();
    }, []);

    useEffect(() => {
        if (view === "attendence") {
          fetchAttendance();
          fetchAttendanceByDate(selectedDate);
        }
    }, [view]);

    useEffect(() =>{
        const delay = setTimeout(() =>{
            searchEmployees(employeeSearch);
        },400);
        return() => clearTimeout(delay);
    }, [employeeSearch]);

    useEffect(() => {
      if (Array.isArray(todaysAttendance) && todaysAttendance.length > 0) {
        let presentCount = 0;
        let lateCount = 0;
        todaysAttendance.forEach((record) => {
          if (record.checkInTime) {
            const checkInTime = new Date(record.checkInTime);
            const lateTime = new Date(checkInTime);
            lateTime.setHours(9, 30, 0, 0);
            if (checkInTime <= lateTime) {
              presentCount++;
            } else {
              lateCount++;
            }
          }
        });
        setAttendanceSummary((prev) => ({
          ...prev,
          totalEmployees: employees.length,
          present: presentCount,
          late: lateCount,
          absent: employees.length - (presentCount + lateCount),
        }));
      }
    }, [todaysAttendance, employees]);

    const openAssignModal = (employee) =>{
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const closeAssignModal = () =>{
        setSelectedEmployee(null);
        setIsModalOpen(false);
    };

    const openEditModal = (employee) =>{
        setEditEmployee(employee);
        setEditModalOpen(true);
    };

    const closeEditModal = () =>{
        setEditEmployee(null);
        setEditModalOpen(false);
    };

    const toggleDarkMode = () =>{
        setDarkMode(!darkMode);
    };

    const [newEmployee, setNewEmployee] = useState({
        name: '',
        email: '',
        position: 'Unassigned',
        phone: '',
        password: ''
    });

    const handleAddEmployee = async (e) =>{
        e.preventDefault();
        if(validateForm()){
            try{
                await axios.post(`http://localhost:8070/api/employees/add`, newEmployee);
                toast.success("Employee Added Successfully");
                setNewEmployee({ name:'', email:'', position:'Unassigned', phone:'', password:'' });
                setConfirmPassword('');
                fetchEmployees();
            }catch(error){
                console.error('Error adding employee:', error);
                toast.error("Failed to add employee");
            }
        }
    }

    const validateForm = () =>{
        if(newEmployee.name.trim() === '' || newEmployee.email.trim() === '' || newEmployee.phone.trim() === '' || newEmployee.password.trim() === '' || confirmPassword.trim() === ''){
            toast.error("All fields are required");
            return false;
        }
        if(!/^[A-Za-z\s]+$/.test(newEmployee.name)){
            toast.error("Name should contain only letters and spaces");
            return false;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(newEmployee.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if(!/^0+[0-9]{9}$/.test(newEmployee.phone)){
            toast.error("Phone must be valid 10 digits");
            return false;
        }
        if(newEmployee.password.length < 6){
            toast.error("Password must be atleast 6 characters");
            return false;
        }
        if (confirmPassword !== newEmployee.password) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    }

    const handleUpdateEmployee = async (e) =>{
        e.preventDefault();
        if (!editEmployee) {
            toast.warning("No employee selected to update!");
            return;
        }
        if(validateUpdateForm()){
            try{
                await axios.put(`http://localhost:8070/api/employees/update/${editEmployee._id}`, 
                    {employeeID: editEmployee.employeeID, name: editEmployee.name, email: editEmployee.email, position: editEmployee.position, phone: editEmployee.phone });
                toast.success("Employee Updated Successfully");
                fetchEmployees();
                closeEditModal();
            }catch(error){
                console.error('Error updating employee:', error);
                toast.error("Failed to update employee");
            }
        }
    }

    const validateUpdateForm = () =>{
        if(editEmployee.name.trim() === '' || editEmployee.email.trim() === '' || editEmployee.phone.trim() === '' ){
            toast.error("All fields are required");
            return false;
        }
        if(!/^[A-Za-z\s]+$/.test(editEmployee.name)){
            toast.error("Name should contain only letters and spaces");
            return false;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(editEmployee.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if(!/^0+[0-9]{9}$/.test(editEmployee.phone)){
            toast.error("Phone must be valid 10 digits");
            return false;
        }
        return true;
    };

    const handleDeleteEmployee = (id) => {
        confirmAlert({
          title: 'Confirm Deletion',
          message: `Are you sure you want to delete ?`,
          buttons: [
            {
              label: 'Yes',
              onClick: async () => {
                try {
                    await axios.delete(`http://localhost:8070/api/employees/delete/${id}`);
                  toast.success("Employee Deleted Successfully");
                  fetchEmployees();
                } catch (err) {
                  toast.error("Failed to delete employee");
                }
              }
            },
            { label: 'No', onClick: () => {} }
          ]
        });
    };

    const handleAssignRole = async (e) =>{
        e.preventDefault();
        if(!await validateAssignRole()) return;
        try{
            await axios.put(`http://localhost:8070/api/employees/update/${selectedEmployee._id}`, 
              { position: selectedEmployee.position, 
                employeeID: selectedEmployee.employeeID, 
                vehicleCapacity: selectedEmployee.vehicleCapacity || 0 
              });
            toast.success("Role Assigned Successfully");
            fetchEmployees();
            closeAssignModal();
        }catch(error){
            console.error('Error assigning role:', error);
            toast.error("Failed to Assign Role");
        }
    };

    const validateAssignRole = async () =>{
        if(selectedEmployee.position === 'Driver'){
          if(!selectedEmployee.employeeID || selectedEmployee.employeeID.trim() === ''){
              toast.error("Driver ID is required");
              return false;
          }
          if(!/^(EM|D)[0-9][0-9]+$/.test(selectedEmployee.employeeID)){
                toast.error("Enter a valid Employee ID");
                return false;
          }
          if(!selectedEmployee.vehicleCapacity || selectedEmployee.vehicleCapacity <= 0){
              toast.error("Enter a valid Vehicle Capacity");
              return false;
          }
          return true;
        }
        return true;
    }

    useEffect(() => {
      if (view === "attendence") {
          fetchAttendanceByDate(selectedDate);
      }
  }, [selectedDate]);
  

    useEffect(() => {
      if (Array.isArray(attendanceByDate) && attendanceByDate.length > 0) {
        let presentCount = 0;
        let lateCount = 0;
        attendanceByDate.forEach((record) => {
          if (record.checkInTime) {
            const checkInTime = new Date(record.checkInTime);
            const lateTime = new Date(checkInTime);
            lateTime.setHours(9, 30, 0, 0);
            if (checkInTime <= lateTime) {
              presentCount++;
            } else {
              lateCount++;
            }
          }
        });
        setAttendanceSummary((prev) => ({
          ...prev,
          present: presentCount,
          late: lateCount,
          absent: employees.length - (presentCount + lateCount),
        }));
      } else {
        setAttendanceSummary((prev) => ({
          ...prev,
          present: 0,
          late: 0,
          absent: employees.length,
        }));
      }
    }, [attendanceByDate, employees]);
    

    const handleSignOut = () =>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Signed out successfully!");
        setTimeout(() => { window.location.href = "/login"; }, 1500);
    };

  return(

<div className = {`HR-dashboard-container ${darkMode ? 'dark':''}`}>
  <Toaster position="bottom-center" richColors />
    <div className="HR-wrapper">
        <aside className="HR-sidebar">
            <div className="HR-sidebar-header">
                <h2>Human & Resource Management</h2>
                <div className='HR-manager-card'>
                    <img
                        src = 'https://cdn-icons-png.flaticon.com/512/3237/3237472.png' 
                        alt='Profile' 
                        className='profile-avatar'
                    />
                    <div>
                        <h4 className="HR-manager-name"><p>{employee?.position}</p></h4>
                        
                        <p className="HR-manager-role">{employee?.employeeID}</p>
                        <p className="HR-manager-role">{employee?.name}</p>
                        <p className="HR-manager-role">{employee?.email}</p>
                    </div>

                </div>
            </div>
                <ul className="HR-sidebar-menu">
                  <li 
                    className={view === 'dashboard' ? 'active' : ''} 
                    onClick={() => setView('dashboard')}
                  >
                    <FiHome /> Dashboard
                  </li>
                  <li 
                    className={view === 'add' ? 'active' : ''} 
                    onClick={() => setView('add')}
                  >
                   <FiUserPlus /> Add Employee
                  </li>
                  <li 
                    className={view === 'unassigned' ? 'active' : ''} 
                    onClick={() => setView('unassigned')}
                  >
                    <FiUserX /> Unassigned
                  </li>
                  <li 
                    className={view === 'assigned' ? 'active' : ''} 
                    onClick={() => setView('assigned')}
                  >
                    <FiUserCheck /> Assigned
                  </li>
                  <li 
                    className={view === 'attendence' ? 'active' : ''} 
                    onClick={() => setView('attendence')}
                  >
                    <FiCheckSquare /> Attendence
                  </li>
                  <li 
                    className={view === 'reports' ? 'active' : ''} 
                    onClick={() => setView('reports')}
                  >
                    <FiBarChart2 /> Reports
                  </li>
                </ul>


                <div className="HR-sidebar-footer">
                    <button className = 'dark-mode-btn' onClick={toggleDarkMode}>
                        {darkMode ? <FiSun/> : <FiMoon/>} {darkMode ? 'Light' : 'Dark'} Mode
                    </button>
                    <button className="signout-btn" onClick = {handleSignOut}>
                        <FiLogOut /> Sign Out
                    </button>
                    
                </div>
        </aside>

        <main className="HR-main-content">
            <div className = 'topbar'>
                <h1>Human & Resource Management</h1>
                <p className="subtitle">Monitor and manage all employee & user operations</p>
            </div>
            

            {view === 'dashboard' && (
                <div className='HR-dashboard-view'>
                  <h2>Welcome to the HR Dashboard</h2>
                                    
                  <div className="HR-stats-container">
                  <div className="stats-row">
                      <div className="stat-card blue" data-tooltip="Total number of employees">
                        <h3>Employees</h3>
                        <span>{employees.length}</span>
                      </div>
                      <div className="stat-card green" data-tooltip="Drivers available for delivery">
                        <h3>Available Drivers</h3>
                        <span>{employees.filter(emp => emp.position === "Driver").length}</span>
                      </div>
                      <div className="stat-card orange" data-tooltip="Staff available for Work">
                        <h3>Available Staff</h3>
                        <span>{employees.filter(emp => emp.position === "Staff").length}</span>
                      </div>
                      <div className="stat-card purple" data-tooltip="All Manager Roles">
                        <h3>Manager</h3>
                        <span>{employees.filter(emp => emp.position === "HR Manager" ||emp.position === "Delivery Manager"  ||emp.position === "Product Manager"  ||emp.position === "Order Manager"  ||emp.position === "Stock Manager" ).length}</span>
                      </div>
                    </div>

                  </div>
                  <div className="recent-activities">
                     <h3>Recent Activities</h3>
                     <ul>
                       <li>🚚 Delivery #123 assigned to Driver John</li>
                       <li>👤 New Employee: Sarah added to HR system</li>
                       <li>✅ Delivery #122 completed</li>
                     </ul>
                  </div>
                </div>
            )}



            {view === 'add' && (
                <div className = 'contend-card'>
                    <div className = 'add-employee-form'>
                        <h2>ADD NEW EMPLOYEE</h2>

                        <form onSubmit = { handleAddEmployee } className = 'HR-add-form'>
                            <div className = 'HR-form-group'>

                                <input type = 'text' placeholder='Name' value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}/>

                                <input type = 'text' placeholder='Email' value={newEmployee.email} onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}/>

                                <input type = 'text' placeholder='Phone' value={newEmployee.phone} onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})} />

                                <input type = 'password' placeholder='Password' value={newEmployee.password} onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}/>

                                <input type = 'password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword( e.target.value)}/>
                            </div>

                            <button type = 'submit' className='submit-btn'>Add Employee</button>
                        </form>
                    </div>
                </div>
            )}


            {(view === 'unassigned' ) && (
                <div className = 'content-card'>
                    <div className='unassingn-employee'>
                    <h2>UNASSIGNED EMPLOYEE</h2>
                    </div>
                    <div className='search-container'>
                        <input className = 'search-bar'
                          type="text"
                          placeholder="Search Employee..."
                          value={employeeSearch}
                          onChange={(e) => setEmployeeSearch(e.target.value)}
                        />
                    </div>
                    <table className>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Position</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.filter(emp => view === 'unassigned' ? emp.position === 'Unassigned' : emp.position !== 'Unassigned')
                            .sort((a, b) => {
                              const numA = parseInt(a.employeeID.replace(/\D/g, ""), 10);
                              const numB = parseInt(b.employeeID.replace(/\D/g, ""), 10);
                              return numA - numB;
                            })
                            .map((emp) => (
                                <tr key = {emp._id}>
                                    <td>{emp.employeeID}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.position}</td>
                                    <td>{emp.phone}</td>
                                    <td>
                                        <button onClick = {() => openAssignModal(emp)} className='submit-btn'>Assign Role</button>
                                        <button onClick = {() => handleDeleteEmployee(emp._id)} className='delete-btn'>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {(view === 'assigned' ) && (
                <div className = 'content-card'>
                    <div className='assign-employee'>
                    <h2>ASSIGNED EMPLOYEES</h2>
                    </div>
                    <div className='search-container'>
                        <input className = 'search-bar'
                          type="text"
                          placeholder="Search Employee..."
                          value={employeeSearch}
                          onChange={(e) => setEmployeeSearch(e.target.value)}
                        />
                    </div>
                    <div className='employee-table'>
                    <h3>EMPLOYEES</h3>
                    </div>
                    <table className>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Position</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.filter(emp => 
                            view === 'unassigned' 
                                ? emp.position === 'Unassigned' 
                                : emp.position !== 'Unassigned' && emp.position !=='Driver')
                            .sort((a,b) =>{

                                const numA = parseInt(a.employeeID.replace(/\D/g, ""), 10);
                                const numB = parseInt(b.employeeID.replace(/\D/g, ""), 10);

                                return numA -numB;
                            }).map((emp) => (
                                <tr key = {emp._id}>
                                    <td>{emp.employeeID}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.position}</td>
                                    <td>{emp.phone}</td>
                                    <td>
                                        <button onClick = {() => openEditModal(emp)} className='update'>Update</button>
                                        <button onClick = {() => handleDeleteEmployee(emp._id)} className='delete-btn'>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='driver-table'>
                    <h3>DRIVER</h3>
                    </div>
                    <table className>
                        <thead>
                            <tr>
                                <th>Driver ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Position</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.filter(emp => 
                            view === 'unassigned' 
                                ? emp.position === 'Unassigned' 
                                : emp.position !== 'Unassigned' && emp.position ==='Driver')
                            .sort((a,b) =>{

                                const numA = parseInt(a.employeeID.replace(/\D/g, ""), 10);
                                const numB = parseInt(b.employeeID.replace(/\D/g, ""), 10);

                                return numA -numB;
                            }).map((emp) => (
                                <tr key = {emp._id}>
                                    <td>{emp.employeeID}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.position}</td>
                                    <td>{emp.phone}</td>
                                    <td>
                                        <button onClick = {() => openEditModal(emp)} className='update'>Update</button>
                                        <button onClick = {() => handleDeleteEmployee(emp._id)} className='delete-btn'>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                
            )}


                {view === "attendence" && (
                      <div className="content-card">
                        <div className='attendence-header'>
                            <h2>ATTENDENCE TRACKING SECTION</h2>
                            <ul className="attendance-summary">
                              <li>Present: {attendanceSummary.present}</li>
                              <li>Late: {attendanceSummary.late}</li>
                              <li>Absent: {attendanceSummary.absent}</li>
                            </ul>
                              <div className="date-picker-container">
                                  <label>Select Date: </label>
                                  <DatePicker
                                      selected={selectedDate}
                                      onChange={(date) => setSelectedDate(date)}
                                      dateFormat="yyyy-MM-dd"
                                      maxDate={new Date()}
                                  />
                              </div>
                        </div>
                        <button onClick={() => fetchAttendanceByDate(selectedDate)} className="refresh-btn">
                            <FiRefreshCw/> Refresh
                        </button>

                        <button className="early-leave-btn" onClick={() => setShowEarlyLeave(true)}>
                          <FiClock /> View Early Leave Requests
                        </button>

                        {/* Attendance Tables */}
                        {["Assigned Employees","Driver"].map((category, idx) => (
                          <div key={idx}>
                            <div className="driver-table">
                              <h3>{category}</h3>
                            </div>
                            <table className="attendance-table">
                              <thead>
                                <tr>
                                  <th>Employee ID</th>
                                  <th>Name</th>
                                  <th>Position</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {employees
                                  .filter(emp => category === "Driver" ? emp.position === "Driver" : emp.position !== "Driver" && emp.position !== "Unassigned")
                                  .sort((a,b)=>parseInt(a.employeeID.replace(/\D/g,"")) - parseInt(b.employeeID.replace(/\D/g,"")))
                                  .map(emp => {
                                      const record = Array.isArray(attendanceByDate) ? attendanceByDate.find(r => r.employeeID === emp.employeeID) : null;
                                      let status = "Absent", color="red";
                                      if(record){
                                        const checkInTime = new Date(record.checkInTime);
                                        const lateTime = new Date(checkInTime);
                                        lateTime.setHours(9,30,0,0);
                                        if(checkInTime <= lateTime){ status="Present"; color="green"; }
                                        else{ status="Late"; color="orange"; }
                                      }
                                      return <tr key={emp._id}><td>{emp.employeeID}</td><td>{emp.name}</td><td>{emp.position}</td><td style={{color,fontWeight:"bold"}}>{status}</td></tr>
                                  })}
                              </tbody>
                            </table>
                          </div>
                        ))}

                        {showEarlyLeave && (
                          <div className="leave-modal-overlay">
                            <div className="leave-modal-content">
                              <h3>Early Leave Requests</h3>
                              <button className="leave-close-btn" onClick={() => setShowEarlyLeave(false)}>✖</button>
                              {Array.isArray(attendanceByDate) && attendanceByDate.filter(r=>r.earlyLeave).length===0 ? (
                                <p>No early leave requests</p>
                              ) : (
                                <ul>
                                  {Array.isArray(attendanceByDate) && attendanceByDate.filter(r=>r.earlyLeave).map(r=>(
                                    <li key={r._id}><b>{r.employeeID}</b> ({r.earlyLeave.reason}) at {new Date(r.earlyLeave.submittedAt).toLocaleTimeString()}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

            {view === "reports" && (
                <div className="content-card">
                    <HrReport employees={employees} attendanceByDate={attendanceByDate} />
                </div>
            )}
        </main>
    </div>

            {isModalOpen && (
                <div className = 'modal-overlay'>
                    <div className = 'modal-content'>
                        <h2>Assign Role to {selectedEmployee.name}</h2>
                            <form onSubmit = {handleAssignRole}>
                                <div className = 'HR-form-group'>
                                    <label>Select Role</label>
                                    <select value={selectedEmployee?.position || 'Unassigned'} onChange={(e) => setSelectedEmployee({...selectedEmployee, position: e.target.value})} required>
                                        <option value = 'Unassigned'>Unassigned</option>
                                        <option value = 'Product Manager'>Product Manager</option>
                                        <option value = 'Stock Manager'>Stock Manager</option>
                                        <option value = 'Delivery Manager'>Delivery Manager</option>
                                        <option value = 'Order Manager'>Order Manager</option>
                                        <option value = 'HR Manager'>HR Manager</option>
                                        <option value = 'Driver'>Driver</option>
                                        <option value = 'Staff'>Staff</option>
                                    </select>
                                    {selectedEmployee?.position === "Driver" && (
                                        <div>
                                    <input
                                        type="text"
                                        placeholder="Driver ID"
                                        value={selectedEmployee?.employeeID || ''}
                                        onChange={(e) => setSelectedEmployee({...selectedEmployee, employeeID: e.target.value})}

                                     />
                                    <input
                                        type="number"
                                        placeholder="Vehicle Capacity"
                                        value={selectedEmployee?.vehicleCapacity || ''}
                                        onChange={(e) => setSelectedEmployee({...selectedEmployee, vehicleCapacity: e.target.value})}
                                    />
                                    </div>
                                )}
                                </div>

                                <div className = 'modal-buttons'>
                                    <button type = 'submit' className='submit-btn'>Assign Role</button>
                                    <button type = 'button' className='cancel-btn' onClick={closeAssignModal}>Cancel</button>
                                </div>
                            </form>
                    </div>
                </div>
            )}

            {editModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Profile: {editEmployee?.name}</h2>
                        <form onSubmit={handleUpdateEmployee}>
                            <div className="HR-form-group">
                                <input 
                                    type="text" 
                                    placeholder="Name" 
                                    value={editEmployee?.name || ''} 
                                    onChange={(e) => setEditEmployee({...editEmployee, name: e.target.value})} 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Email" 
                                    value={editEmployee?.email || ''} 
                                    onChange={(e) => setEditEmployee({...editEmployee, email: e.target.value})} 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Phone" 
                                    value={editEmployee?.phone || ''} 
                                    onChange={(e) => setEditEmployee({...editEmployee, phone: e.target.value})} 
                                />
                                <select 
                                    value={editEmployee?.position || 'Unassigned'}
                                    onChange={(e) => setEditEmployee({...editEmployee, position: e.target.value})}
                                    required
                                >
                                    <option value="Unassigned">Unassigned</option>
                                    <option value="Product Manager">Product Manager</option>
                                    <option value="Stock Manager">Stock Manager</option>
                                    <option value="Delivery Manager">Delivery Manager</option>
                                    <option value="Order Manager">Order Manager</option>
                                    <option value="HR Manager">HR Manager</option>
                                    <option value="Staff">Staff</option>
                                </select>

                            </div>
                            <div className="modal-buttons">
                                <button type="submit" className="submit-btn">Update</button>
                                <button type="button" className="cancel-btn" onClick={closeEditModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

    </div>

);

};
