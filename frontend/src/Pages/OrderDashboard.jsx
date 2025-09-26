import React, { useState, useEffect} from "react";
import axios from 'axios';
import { Toaster, toast} from "sonner";
import "react-toastify/dist/ReactToastify.css";
import { FiUserX, FiHome, FiLogOut, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import "../Css/OrderDashboard.css"


export default function OrderDashboard (){
    const [ view, setView] = useState ("dashboard") 
    
    return  (
        <div className = 'order-dashboard-container'> 
            <div className = 'order-wrapper'>
                <aside className="order-sidebar">
                    <div className="order-sidebar-header">
                        <h2>Order Management</h2>
                        <div className='order-manager-card'>
                            <img
                                src = 'https://cdn-icons-png.flaticon.com/512/3237/3237472.png' 
                                alt='Profile' 
                                className='profile-avatar'
                            />
                            <div>
                                <h4 className="order-manager-name"><p>Order Manager</p></h4>
                                
                                <p className="order-manager-role">OM-01</p>
                                <p className="order-manager-role">Lasiru Hasaranga</p>
                                <p className="order-manager-role">lasiru@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <ul className="order-sidebar-menu">
                          <li 
                            className={view === 'dashboard' ? 'active' : ''} 
                            onClick={() => setView('dashboard')}
                          >
                            <FiHome /> Dashboard
                          </li>
                          <li 
                            className={view === 'order' ? 'active' : ''} 
                            onClick={() => setView('order')}
                          >
                           <FiUserPlus /> Orders
                          </li>
                          <li 
                            className={view === 'promo' ? 'active' : ''} 
                            onClick={() => setView('promo')}
                          >
                            <FiUserX /> PromoCodes
                          </li>
                          <li 
                            className={view === 'payments' ? 'active' : ''} 
                            onClick={() => setView('payments')}
                          >
                            <FiUserCheck /> Payments
                          </li>
                        </ul>


                        <div className="order-sidebar-footer">
                            <button className="signout-btn" >
                                <FiLogOut /> Sign Out
                            </button>
                        </div>
                </aside>
            </div>
        </div>
    )
}