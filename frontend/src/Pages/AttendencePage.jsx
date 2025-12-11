import { useState, useEffect } from 'react';
import { Toaster, toast } from "sonner";
import axios from 'axios';
import '../Css/Attendence.css';

export default function AttendencePage() {
    const [status, setStatus] = useState(null);
    const [earlyLeaveReason, setEarlyLeaveReason] = useState(''); 
    const [showLeaveForm, setShowLeaveForm] = useState(false);


    useEffect(() => {

        const fetchAttendance = async () => {
            try {
            const token = localStorage.getItem('token');
            console.log('JWT token:', token);
            const res = await axios.get('https://ruhunu-yoghurt-1.onrender.com/api/attendance/today', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(res => console.log(res.data))
            .catch(err => console.error(err));

            if (res.data.checkedIn){}
            setStatus("checked-in");

            } catch (error) {
            console.error('Error fetching attendance status:', error);
            }
        };

        fetchAttendance();
    }, []);

    const handleCheckIn = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('https://ruhunu-yoghurt-1.onrender.com/api/attendance/checkin', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStatus("checked-in");
            toast.success(res.data.message);
        }
        catch (error) {
            console.error('Error during check-in:', error);
            if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error('Check-in failed. Please try again.');
        }
        }
    };

    const handleEarlyLeave = async () => {
        if (!earlyLeaveReason) {
            toast.warning('Please provide a reason for early leave.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://ruhunu-yoghurt-1.onrender.com/api/attendance/earlyleave', 
                { reason: earlyLeaveReason }, 
                { headers: { Authorization: `Bearer ${token}` },
            });
            setStatus("Early Leave");
            toast.success('Early leave recorded successfully!');
            setEarlyLeaveReason('');
        }
        catch (error) {
            console.error('Error during early leave:', error);
            toast.error('Early leave failed. Please try again.');
        }
    };

    const handleSignOut = () =>{
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.success("Signed out successfully!");
            setTimeout(() => {
            window.location.href = "/login";
      }, 1500);
    }

    return (
        <div className="attendance-container">
          <Toaster position="bottom-center" richColors />
        <div className="attendance-card">
          <h2>Attendance Portal</h2>
            
  
          {!status && <button onClick={handleCheckIn} >✅ Check In</button>}
  
          {!status && (
              <button 
                className="attendence-logout-button" 
                onClick={handleSignOut}
              >
                🚪 Logout
              </button>
            )}
          {status === "checked-in" && (
            <>
              <h3>You are checked in today</h3>
  
              {!showLeaveForm ? (
                <div className="leave-request-row">
                <button onClick={() => setShowLeaveForm(true)}>
                  ✍️ Request Early Leave
                </button>
                <button
                  className="back-button"
                  onClick={() => 
                    setStatus(null)
                  }
                >
                  Back
                </button>
              </div>
              ) : (
                <>
                  <h4>Request Early Leave</h4>
                  <textarea
                    rows="3"
                    placeholder="Enter reason..."
                    value={earlyLeaveReason}
                    onChange={(e) => setEarlyLeaveReason(e.target.value)}
                  />
                  <div className="leave-buttons">
                    <button onClick={handleEarlyLeave}>📤 Submit Early Leave</button>
                    <button
                      className="cancel-button"
                      onClick={() => {
                        setEarlyLeaveReason('');
                        setShowLeaveForm(false); 
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      );
}