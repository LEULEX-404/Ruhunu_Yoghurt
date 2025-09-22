import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiHome, FiLogOut, FiMoon,FiSun } from 'react-icons/fi';
import '../Css/HrDashboard.css';

export default function HrDashboard() {
    const [employees, setEmployees] = useState([]);
    const [employeeSearch,setEmployeeSearch] = useState("");

    const [view, setView] = useState('dashboard');
    const [darkMode, setDarkMode] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);

    const fetchEmployees = async () => {
        try{
            const response = await axios.get(`http://localhost:8070/api/employees`);
            setEmployees(response.data);
        }catch(error){
            console.error('Error fetching employees:', error);
        }
    };

    const searchEmployees = async (searchText) =>{
        try{
            if(!searchText){
                return fetchEmployees();
            }

            const res = await axios.get(
                `http://localhost:8070/api/employees/search?search=${searchText}`
            );
            setEmployees(res.data);
        }catch(err){
            console.error(err);
            alert("Failed to search Employees.");
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
    }, []);

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

        try{
            const response = await axios.post(`http://localhost:8070/api/employees/add`, newEmployee);
            console.log('Employee added:', response.data);
            alert('Employee added successfully',response.data.message);
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
            alert('Failed to add employee');
        }
    };

    const handleUpdateEmployee = async (e) =>{
        e.preventDefault();

        if (!editEmployee) {
            alert("No employee selected to update!");
            return;
        }

        try{
            const response = await axios.put(`http://localhost:8070/api/employees/update/${editEmployee._id}`, 
                { name: editEmployee.name, email: editEmployee.email, position: editEmployee.position, phone: editEmployee.phone, vehicleCapacity: editEmployee.vehicleCapacity || 0 });

            console.log('Employee updated:', response.data);
            alert('Employee updated successfully',response.data.message);
            fetchEmployees();
            closeEditModal();

        }catch(error){
            console.error('Error updating employee:', error);
            alert('Failed to update employee');
        }
    }

    const handleDeleteEmployee = async (id) => {
        if(window.confirm('Are you sure you want to delete this employee?')){

            try{
                await axios.delete(`http://localhost:8070/api/employees/delete/${id}`);
                alert('Employee deleted successfully');
                fetchEmployees();

            }catch(error){
                console.error('Error deleting employee:', error);
                alert('Failed to delete employee');
            }
        }
    };
    
    const handleAssignRole = async (e) =>{
        e.preventDefault();

        try{
            const response = await axios.put(`http://localhost:8070/api/employees/update/${selectedEmployee._id}`, { position: selectedEmployee.position, vehicleCapacity: selectedEmployee.vehicleCapacity || 0 });
            console.log('Role assigned:', response.data);
            alert('Role assigned successfully',response.data.message);
            fetchEmployees();
            closeAssignModal();

        }catch(error){
            console.error('Error assigning role:', error);
            alert('Failed to assign role');
        }
    };

    const handleSignOut = () =>{
        alert('Signed out successfully');
    };

    return(

        <div className = {`dashboard-container ${darkMode ? 'dark':''}`}>
            <div className="wrapper">
                <aside className="HR-sidebar">
                    <div className="HR-sidebar-header">
                        <h2>HR Dashboard</h2>
                    </div>
                        <ul className="HR-sidebar-menu">
                            <li onClick ={() => setView('dashboard')}>
                                <FiHome /> Dashboard
                            </li>
                            <li onClick ={() => setView('add')}>
                                <FiUsers /> Add Employee
                            </li>
                            <li onClick ={() => setView('unassigned')}>
                                <FiUsers /> Unassigned
                            </li>
                            <li onClick ={() => setView('assigned')}>
                                <FiUsers /> Assigned
                            </li>
                            <li onClick ={() => setView('attendence')}>
                                <FiUsers /> Attendence
                            </li>
                            <li onClick ={() => setView('reports')}>
                                <FiUsers /> Reports
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

                <main className="main-content">
                    <div className = 'topbar'>
                        

                        <div className = 'profile-section'>
                            <img src = 'https://via.placeholder.com/40' alt = 'Profile' className='profile-pic'/>
                            <span className = 'profile-name'>HR Manager</span>
                        </div>
                    </div>

                    {view === 'dashboard' && (
                        <div className = 'dashboard-view'>
                            <h2>Welcome to the HR Dashboard</h2>
                        </div>
                    )}


                    {view === 'add' && (
                        <div className = 'contend-card'>
                            <div className = 'add-employee-form'>
                                <h2>ADD NEW EMPLOYEE</h2>

                                <form onSubmit = { handleAddEmployee } className = 'add-form'>
                                    <div className = 'form-group'>
                                        <input type = 'text' placeholder='Employee ID' value={newEmployee.employeeID} onChange={(e) => setNewEmployee({...newEmployee, employeeID: e.target.value})} required/>
                                        <input type = 'text' placeholder='Name' value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} required/>
                                        <input type = 'email' placeholder='Email' value={newEmployee.email} onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} required/>
                                        <input type = 'text' placeholder='Phone' value={newEmployee.phone} onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})} required/>
                                        <input type = 'password' placeholder='Password' value={newEmployee.password} onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})} required/>
                                    </div>

                                    <button type = 'submit' className='submit-btn'>Add Employee</button>
                                </form>
                            </div>
                        </div>
                    )}


                    {(view === 'unassigned' ) && (
                        <div className = 'content-card'>
                            <h2>UNASSIGNED EMPLOYEE</h2>
                            <input className = 'search-bar'
                              type="text"
                              placeholder="Search Employee..."
                              value={employeeSearch}
                              onChange={(e) => setEmployeeSearch(e.target.value)}
                            />
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
                            <h2>ASSIGNED EMPLOYEE</h2>
                            <input className = 'search-bar'
                              type="text"
                              placeholder="Search Employee..."
                              value={employeeSearch}
                              onChange={(e) => setEmployeeSearch(e.target.value)}
                            />
                            
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
                                                <button onClick = {() => openEditModal(emp)} className='update'>Update</button>
                                                <button onClick = {() => handleDeleteEmployee(emp._id)} className='delete-btn'>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}


                    {view === "attendance" && (
                        <div className="content-card">
                            <h2>Attendance Tracking Section (To Implement)</h2>
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
                                            <input
                                                type="number"
                                                placeholder="Vehicle Capacity"
                                                value={selectedEmployee?.vehicleCapacity || ''}
                                                onChange={(e) => setSelectedEmployee({...selectedEmployee, vehicleCapacity: e.target.value})}
                                                required
                                            />
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