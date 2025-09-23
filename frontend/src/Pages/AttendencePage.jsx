import { useState, useEffect } from 'react';
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
            const res = await axios.get('http://localhost:8070/api/attendance/today', {
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
            await axios.post('http://localhost:8070/api/attendance/checkin', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStatus("checked-in");
            alert('Checked in successfully!');
        }
        catch (error) {
            console.error('Error during check-in:', error);
            alert('Check-in failed. Please try again.');
        }
    };

    const handleEarlyLeave = async () => {
        if (!earlyLeaveReason) {
            alert('Please provide a reason for early leave.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8070/api/attendance/earlyleave', 
                { reason: earlyLeaveReason }, 
                { headers: { Authorization: `Bearer ${token}` },
            });
            setStatus("Early Leave");
            alert('Early leave recorded successfully!');
            setEarlyLeaveReason('');
        }
        catch (error) {
            console.error('Error during early leave:', error);
            alert('Early leave failed. Please try again.');
        }
    };

    return (
        <div className="attendance-container">
        <div className="attendance-card">
          <h2>Attendance Portal</h2>
            
  
          {!status && <button onClick={handleCheckIn}>✅ Check In</button>}
  
          {!status && (
              <button 
                className="attendence-logout-button" 
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
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