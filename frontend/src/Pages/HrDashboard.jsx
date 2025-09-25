import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from "sonner";
import { confirmAlert } from 'react-confirm-alert';
import "react-toastify/dist/ReactToastify.css";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FiUserX, FiHome, FiLogOut, FiMoon,FiSun ,FiBarChart2, FiCheckSquare, FiUserCheck, FiUserPlus, FiClock, FiRefreshCw } from 'react-icons/fi';
import '../Css/HrDashboard.css';

export default function HrDashboard() {
    const [employee, setEmployee] = useState("");

    const [employees, setEmployees] = useState([]);
    const [employeeSearch,setEmployeeSearch] = useState("");

    const [todaysAttendance, setTodaysAttendance] = useState([]);
    const [showEarlyLeave, setShowEarlyLeave] = useState(false);


    const [view, setView] = useState('dashboard');
    const [darkMode, setDarkMode] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);

    const [errors, setErrors] = useState({});
    const [confirmPassword, setConfirmPassword] = useState("");


    const fetchEmployee = async () =>{

        const storedEmployee = localStorage.getItem("user");
        console.log('HR Manager:', storedEmployee);

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

    useEffect(() => {
        fetchEmployees();
        fetchEmployee();
    }, []);

    useEffect(() => {
        if (view === "attendence") {
          fetchAttendance();
        }
      }, [view]);
      

    useEffect(() =>{
        const delay = setTimeout(() =>{
            searchEmployees(employeeSearch);
        },400);

        return() => clearTimeout(delay);
    }, [employeeSearch,])

    const [newEmployee, setNewEmployee] = useState({
        employeeID: '',
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
            
            const response = await axios.post(`http://localhost:8070/api/employees/add`, newEmployee);
            console.log('Employee added:', response.data);
            toast.success("Employee Added Successfully");
            setNewEmployee({
                employeeID: '',
                name: '',
                email: '',
                position: 'Unassigned',
                phone: '',
                password: ''
            });
            fetchEmployees();
        
        }catch(error){
            console.error('Error adding employee:', error);
            toast.error("Failed to add employee");
        }
    };
}

    const validateForm = () =>{
        let newErrors = {};

        if(!/^(EM|D)[0-9][0-9]+$/.test(newEmployee.employeeID)){
            newErrors.employeeID = "Employee ID is required";
        }

        if(!/^[A-Za-z\s]+$/.test(newEmployee.name)){
            newErrors.name = "Name should contain only letters and spaces";
        }

        if(!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newEmployee.email)){
            newErrors.email = "Invalid email format";
        }

        if(!/^[0-9]{10}$/.test(newEmployee.phone)){
            newErrors.phone = "Phone must be 10 digits";
        }

        if(newEmployee.password.length < 6){
            newErrors.password = "Password must be atleast 6 characters";
        }

        if (confirmPassword !== newEmployee.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleUpdateEmployee = async (e) =>{
        e.preventDefault();

        if (!editEmployee) {
            alert("No employee selected to update!");
            return;
        }

        try{
            const response = await axios.put(`http://localhost:8070/api/employees/update/${editEmployee._id}`, 
                {employeeID: editEmployee.employeeID, name: editEmployee.name, email: editEmployee.email, position: editEmployee.position, phone: editEmployee.phone, vehicleCapacity: editEmployee.vehicleCapacity || 0 });

            console.log('Employee updated:', response.data);
            toast.success("Employee Updated Successfully");
            fetchEmployees();
            closeEditModal();

        }catch(error){
            console.error('Error updating employee:', error);
            toast.error("Failed to update employee");
        }
    }

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
            {
              label: 'No',
              onClick: () => {}
            }
          ]
        });
      };
    
      

    const handleAssignRole = async (e) =>{
        e.preventDefault();

        try{
            const response = await axios.put(`http://localhost:8070/api/employees/update/${selectedEmployee._id}`, { position: selectedEmployee.position, EmployeeID: selectedEmployee.employeeID, vehicleCapacity: selectedEmployee.vehicleCapacity || 0 });
            console.log('Role assigned:', response.data);
            toast.success("Role Assigned Successfully");
            fetchEmployees();
            closeAssignModal();

        }catch(error){
            console.error('Error assigning role:', error);
            toast.error("Failed to Assign Role");
        }
    };

    const handleSignOut = () =>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.warning("Signed out successfully!");
        setTimeout(() => {
        window.location.href = "/login";
  }, 1500);
    };

    return(

        <div className = {`dashboard-container ${darkMode ? 'dark':''}`}>
            <Toaster position="bottom-center" richColors />
            <div className="wrapper">
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
                        <div className='dashboard-view'>
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

                                <form onSubmit = { handleAddEmployee } className = 'add-form'>
                                    <div className = 'form-group'>
                                        <input type = 'text' placeholder='Employee ID' value={newEmployee.employeeID} onChange={(e) => setNewEmployee({...newEmployee, employeeID: e.target.value})} required/>
                                            {errors.employeeID && <span className="error">{errors.employeeID}</span>}

                                        <input type = 'text' placeholder='Name' value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} required/>
                                            {errors.name && <span className="error">{errors.name}</span>}

                                        <input type = 'email' placeholder='Email' value={newEmployee.email} onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} required/>
                                            {errors.email && <span className="error">{errors.email}</span>}

                                        <input type = 'text' placeholder='Phone' value={newEmployee.phone} onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})} required/>
                                            {errors.phone && <span className="error">{errors.phone}</span>}

                                        <input type = 'password' placeholder='Password' value={newEmployee.password} onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})} required/>
                                            {errors.password && <span className="error">{errors.password}</span>}

                                        <input type = 'password' placeholder='Confirm Password' value={newEmployee.confirmPassword} onChange={(e) => setConfirmPassword( e.target.value)} required/>
                                            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
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
                                    {employees.filter(emp => view === 'unassigned' ? emp.position === 'Unassigned' : emp.position !== 'Unassigned').map((emp) => (
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
                        </div>
                    
                        <button onClick={() => fetchAttendance()} className="refresh-btn">
                        <FiRefreshCw/> Refresh
                        </button>


                        <button
                          className="early-leave-btn"
                          onClick={() => setShowEarlyLeave(true)}
                        >
                          <FiClock /> View Early Leave Requests
                        </button>
                    
{/* ================= EMPLOYEE TABLE ================= */}
<div className="driver-table">
  <h3>ASSIGNED EMPLOYEE</h3>
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
      .filter((emp) =>
        view === "unassigned"
          ? emp.position === "Unassigned"
          : emp.position !== "Unassigned" && emp.position !== "Driver"
      )
      .sort((a, b) => {
        const numA = parseInt(a.employeeID.replace(/\D/g, ""), 10);
        const numB = parseInt(b.employeeID.replace(/\D/g, ""), 10);
        return numA - numB;
      })
      .map((emp) => {
        const record = Array.isArray(todaysAttendance)
          ? todaysAttendance.find((r) => r.employeeID === emp.employeeID)
          : null;

        let status = record ? "Present" : "Absent";
        let color = record ? "green" : "red";

        return (
          <tr key={emp._id}>
            <td>{emp.employeeID}</td>
            <td>{emp.name}</td>
            <td>{emp.position}</td>
            <td style={{ color, fontWeight: "bold" }}>{status}</td>
          </tr>
        );
      })}
  </tbody>
</table>

<div className="driver-table">
  <h3>DRIVER</h3>
</div>

{/* ================= DRIVER TABLE ================= */}
<table className="attendance-table">
  <thead>
    <tr>
      <th>Driver ID</th>
      <th>Name</th>
      <th>Position</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {employees
      .filter((emp) =>
        view === "unassigned"
          ? emp.position === "Unassigned"
          : emp.position !== "Unassigned" && emp.position === "Driver"
      )
      .sort((a, b) => {
        const numA = parseInt(a.employeeID.replace(/\D/g, ""), 10);
        const numB = parseInt(b.employeeID.replace(/\D/g, ""), 10);
        return numA - numB;
      })
      .map((emp) => {
        const record = Array.isArray(todaysAttendance)
          ? todaysAttendance.find((r) => r.employeeID === emp.employeeID)
          : null;

        let status = record ? "Present" : "Absent";
        let color = record ? "green" : "red";

        return (
          <tr key={emp._id}>
            <td>{emp.employeeID}</td>
            <td>{emp.name}</td>
            <td>{emp.position}</td>
            <td style={{ color, fontWeight: "bold" }}>{status}</td>
          </tr>
        );
      })}
  </tbody>
</table>
                        
 
                        
                        {showEarlyLeave && (
                          <div className="leave-modal-overlay">
                            <div className="leave-modal-content">
                              <h3>Early Leave Requests</h3>
                              <button className="leave-close-btn" onClick={() => setShowEarlyLeave(false)}>
                                ✖
                              </button>
                        
                              {Array.isArray(todaysAttendance) &&
                              todaysAttendance.filter((r) => r.earlyLeave).length === 0 ? (
                                <p>No early leave requests today</p>
                              ) : (
                                <ul>
                                  {Array.isArray(todaysAttendance) &&
                                    todaysAttendance
                                      .filter((r) => r.earlyLeave)
                                      .map((r) => (
                                        <li key={r._id}>
                                          <b>{r.employeeID}</b> ({r.earlyLeave.reason})
                                          <span>
                                            {" "}
                                            at{" "}
                                            {new Date(r.earlyLeave.submittedAt).toLocaleTimeString()}
                                          </span>
                                        </li>
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
                            <h2>Reports Section (To Implement)</h2>
                        </div>
                    )}
                </main>
            </div>

                    {isModalOpen && (
                        <div className = 'modal-overlay'>
                            <div className = 'modal-content'>
                                <h2>Assign Role to {selectedEmployee.name}</h2>
                                    <form onSubmit = {handleAssignRole}>
                                        <div className = 'form-group'>
                                            <lable>Select Role</lable>
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
                                                required
                                             />
                                            <input
                                                type="number"
                                                placeholder="Vehicle Capacity"
                                                value={selectedEmployee?.vehicleCapacity || ''}
                                                onChange={(e) => setSelectedEmployee({...selectedEmployee, vehicleCapacity: e.target.value})}
                                                required
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
                                    <div className="form-group">
                                        <input 
                                            type="text" 
                                            placeholder="Name" 
                                            value={editEmployee?.name || ''} 
                                            onChange={(e) => setEditEmployee({...editEmployee, name: e.target.value})} 
                                            required
                                        />
                                        <input 
                                            type="email" 
                                            placeholder="Email" 
                                            value={editEmployee?.email || ''} 
                                            onChange={(e) => setEditEmployee({...editEmployee, email: e.target.value})} 
                                            required
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Phone" 
                                            value={editEmployee?.phone || ''} 
                                            onChange={(e) => setEditEmployee({...editEmployee, phone: e.target.value})} 
                                            required
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
                                            <option value="Driver">Driver</option>
                                            <option value="Staff">Staff</option>
                                        </select>

                                        {editEmployee?.position === "Driver" && (
                                            <input
                                                type="number"
                                                placeholder="Vehicle Capacity"
                                                value={editEmployee?.vehicleCapacity || ''}
                                                onChange={(e) => setEditEmployee({...editEmployee, vehicleCapacity: e.target.value})}
                                                required
                                            />
                                        )}
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