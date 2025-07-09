import { useEffect, useState } from "react";
import type { UserDashboardData } from "../data/SampleUserData";
import { sampleUserData, getDashboardMetricsById } from "../data/SampleUserData";
import { useAuth } from "../context/Authcontext";

const Settings = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (!authUser) {
      setLoading(false);
      return;
    }

    try {
      // Get data from localStorage or use sample data as fallback
      const localDataString = localStorage.getItem("sampleUserData");
      let data: UserDashboardData[] = [];
      
      if (localDataString) {
        data = JSON.parse(localDataString);
      }
      
      // If no local data or empty array, use sample data
      if (data.length === 0) {
        data = sampleUserData;
        // Save sample data to localStorage for future edits
        localStorage.setItem("sampleUserData", JSON.stringify(data));
      }
      
      // Find user by ID
      const found = data.find(u => u.id === authUser.id);
      
      if (found) {
        setUser(found);
      } else {
        // If user not found in data, create a basic user object
        const newUser: UserDashboardData = {
          id: authUser.id,
          name: authUser.name || authUser.email || "Unknown User",
          email: authUser.email || "",
          role: "Student",
          avatar: authUser.avatar || "",
          performance: {
            score: 0,
            accuracy: 0,
            totalQuestions: 0,
            quizScore: "0/0"
          },
          peerComparison: [],
          progress: {
            weeklyScores: [],
            peakScore: 0,
            averageScore: 0,
            totalHours: 0
          },
          xp: {
            daily: []
          },
          streak: {
            current: 0,
            longest: 0,
            bestPercent: 0,
            week: [
              { day: "M", date: "01/15", completed: false },
              { day: "T", date: "01/16", completed: false },
              { day: "W", date: "01/17", completed: false },
              { day: "T", date: "01/18", completed: false },
              { day: "F", date: "01/19", completed: false },
              { day: "S", date: "01/20", completed: false },
              { day: "S", date: "01/21", completed: false }
            ]
          },
          badges: [],
          courses: []
        };
        setUser(newUser);
        
        // Add new user to data and save
        const updatedData = [...data, newUser];
        localStorage.setItem("sampleUserData", JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  const updateUser = (field: keyof UserDashboardData, value: any) => {
    if (!user) return;
    
    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);

    try {
      // Get current data from localStorage
      const localDataString = localStorage.getItem("sampleUserData");
      let allUsers: UserDashboardData[] = [];
      
      if (localDataString) {
        allUsers = JSON.parse(localDataString);
      } else {
        allUsers = sampleUserData;
      }
      
      // Update the user in the array
      const updatedUsers = allUsers.map(u => u.id === user.id ? updatedUser : u);
      
      // Save back to localStorage
      localStorage.setItem("sampleUserData", JSON.stringify(updatedUsers));
      
      // Show success message
      setSaveMessage("Changes saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving user data:", error);
      setSaveMessage("Error saving changes");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const updateNestedField = (field: string, nestedField: string, value: any) => {
    if (!user) return;
    
    const currentFieldValue = user[field as keyof UserDashboardData];
    
    // Type-safe check to ensure the field is an object
    if (typeof currentFieldValue === 'object' && currentFieldValue !== null) {
      const updatedUser = { 
        ...user, 
        [field]: { 
          ...currentFieldValue, 
          [nestedField]: value 
        } 
      };
      setUser(updatedUser);

      try {
        const localDataString = localStorage.getItem("sampleUserData");
        let allUsers: UserDashboardData[] = [];
        
        if (localDataString) {
          allUsers = JSON.parse(localDataString);
        } else {
          allUsers = sampleUserData;
        }

        const updatedUsers = allUsers.map(u => u.id === user.id ? updatedUser : u);
        localStorage.setItem("sampleUserData", JSON.stringify(updatedUsers));
        
        setSaveMessage("Changes saved successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      } catch (error) {
        console.error("Error saving user data:", error);
        setSaveMessage("Error saving changes");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } else {
      console.error(`Field ${field} is not an object and cannot be updated`);
      return;
    }
  };

  const handleSaveChanges = () => {
    if (user) {
      setSaveMessage("All changes have been saved!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div style={{ padding: "32px", paddingLeft: "230px", backgroundColor: "transparent", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <p style={{ fontSize: "18px", color: "#64748b" }}>Loading settings...</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div style={{ padding: "32px", paddingLeft: "230px", backgroundColor: "transparent", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>⚙️ Settings</h1>
        <p style={{ color: "#ef4444", fontSize: "16px", marginBottom: "24px" }}>Please log in to access settings</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "32px", paddingLeft: "230px", backgroundColor: "transparent", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>⚙️ Settings</h1>
        <p style={{ color: "#ef4444", fontSize: "16px", marginBottom: "24px" }}>User data not found</p>
      </div>
    );
  }

  // Get dashboard metrics for display
  const dashboardMetrics = getDashboardMetricsById(user.id);

  return (
    <div style={{ padding: "32px", paddingLeft: "230px", backgroundColor: "transparent", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>⚙️ Settings</h1>
      <p style={{ color: "#64748b", fontSize: "16px", marginBottom: "24px" }}>Manage your account preferences and privacy settings</p>

      {saveMessage && (
        <div style={{ 
          backgroundColor: saveMessage.includes("Error") ? "#fef2f2" : "#f0f9ff", 
          color: saveMessage.includes("Error") ? "#dc2626" : "#0369a1",
          padding: "12px 16px", 
          borderRadius: "8px", 
          marginBottom: "16px",
          border: `1px solid ${saveMessage.includes("Error") ? "#fecaca" : "#bae6fd"}`
        }}>
          {saveMessage}
        </div>
      )}

      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", maxWidth: "700px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", border: "1px solid #e2e8f0" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "16px", fontWeight: 600 }}>🧑 Account Info</h2>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>User ID:</div>
          <div style={{ fontSize: "14px", color: "#6b7280", fontFamily: "monospace" }}>{user.id}</div>
        </div>
        
        <label style={labelStyle}>Full Name</label>
        <input
          style={inputStyle}
          value={user.name || ""}
          onChange={e => updateUser("name", e.target.value)}
          placeholder="Enter your full name"
        />

        <label style={labelStyle}>Email</label>
        <input
          style={inputStyle}
          value={user.email || ""}
          onChange={e => updateUser("email", e.target.value)}
          placeholder="Enter your email"
        />

        <label style={labelStyle}>Role</label>
        <select
          style={inputStyle}
          value={user.role || "Student"}
          onChange={e => updateUser("role", e.target.value)}
        >
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Mentor">Mentor</option>
          <option value="Admin">Admin</option>
        </select>

        <label style={labelStyle}>Avatar URL</label>
        <input
          style={inputStyle}
          value={user.avatar || ""}
          onChange={e => updateUser("avatar", e.target.value)}
          placeholder="Enter URL or path to avatar image"
        />

        <h3 style={{ fontSize: "16px", marginTop: "32px", marginBottom: "16px", fontWeight: 600, color: "#374151" }}>📊 Learning Stats</h3>
        
        <label style={labelStyle}>Total Hours (Progress)</label>
        <input
          style={inputStyle}
          type="number"
          step="0.1"
          value={user.progress.totalHours || 0}
          onChange={e => updateNestedField("progress", "totalHours", parseFloat(e.target.value) || 0)}
          placeholder="Total learning hours"
        />

        <label style={labelStyle}>Work Time (Read-only)</label>
        <input
          style={{ ...inputStyle, backgroundColor: "#f8f9fa", cursor: "not-allowed" }}
          value={dashboardMetrics?.workTime || "0h 0m"}
          readOnly
          placeholder="Calculated from total hours"
        />

        <label style={labelStyle}>Performance Score</label>
        <input
          style={inputStyle}
          type="number"
          value={user.performance.score || 0}
          onChange={e => updateNestedField("performance", "score", parseInt(e.target.value) || 0)}
          placeholder="Performance score (0-100)"
        />

        <label style={labelStyle}>Accuracy Percentage</label>
        <input
          style={inputStyle}
          type="number"
          value={user.performance.accuracy || 0}
          onChange={e => updateNestedField("performance", "accuracy", parseInt(e.target.value) || 0)}
          placeholder="Accuracy percentage (0-100)"
        />

        <label style={labelStyle}>Total Questions Answered</label>
        <input
          style={inputStyle}
          type="number"
          value={user.performance.totalQuestions || 0}
          onChange={e => updateNestedField("performance", "totalQuestions", parseInt(e.target.value) || 0)}
          placeholder="Total questions answered"
        />

        <label style={labelStyle}>Quiz Score</label>
        <input
          style={inputStyle}
          value={user.performance.quizScore || "0/0"}
          onChange={e => updateNestedField("performance", "quizScore", e.target.value)}
          placeholder="Quiz score (e.g., 8/10)"
        />

        <label style={labelStyle}>Current Streak</label>
        <input
          style={inputStyle}
          type="number"
          value={user.streak.current || 0}
          onChange={e => updateNestedField("streak", "current", parseInt(e.target.value) || 0)}
          placeholder="Current streak count"
        />

        <label style={labelStyle}>Longest Streak</label>
        <input
          style={inputStyle}
          type="number"
          value={user.streak.longest || 0}
          onChange={e => updateNestedField("streak", "longest", parseInt(e.target.value) || 0)}
          placeholder="Longest streak achieved"
        />

        <label style={labelStyle}>Best Percentage</label>
        <input
          style={inputStyle}
          type="number"
          value={user.streak.bestPercent || 0}
          onChange={e => updateNestedField("streak", "bestPercent", parseInt(e.target.value) || 0)}
          placeholder="Best percentage achieved"
        />

        <div style={{ marginTop: "24px", display: "flex", gap: "16px" }}>
          <button
            style={{ ...buttonStyle, backgroundColor: "#3b82f6" }}
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
          <button
            style={{ ...buttonStyle, backgroundColor: "#ef4444" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Metrics Display */}
      <div style={{ marginTop: "24px", backgroundColor: "white", borderRadius: "12px", padding: "24px", maxWidth: "700px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", border: "1px solid #e2e8f0" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "16px", fontWeight: 600 }}>📈 Dashboard Metrics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div style={{ padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Work Time</div>
            <div style={{ fontSize: "18px", fontWeight: "600" }}>{dashboardMetrics?.workTime || "0h 0m"}</div>
          </div>
          <div style={{ padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Evaluations Pending</div>
            <div style={{ fontSize: "18px", fontWeight: "600" }}>{dashboardMetrics?.evaluationsPending || 0}</div>
          </div>
          <div style={{ padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Evaluations Completed</div>
            <div style={{ fontSize: "18px", fontWeight: "600" }}>{dashboardMetrics?.evaluationsCompleted || "0%"}</div>
          </div>
          <div style={{ padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Current Streak</div>
            <div style={{ fontSize: "18px", fontWeight: "600" }}>{dashboardMetrics?.streak || "0 Days"}</div>
          </div>
        </div>
      </div>

      {/* Debug information - remove in production */}
      <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#f8f9fa", borderRadius: "8px", fontSize: "12px", color: "#6b7280" }}>
        <h3>Debug Info:</h3>
        <p>Auth User ID: {authUser?.id}</p>
        <p>Found User: {user ? "Yes" : "No"}</p>
        <p>Sample Data Length: {sampleUserData.length}</p>
        <p>Total Hours: {user.progress.totalHours}</p>
        <p>Performance Score: {user.performance.score}</p>
      </div>
    </div>
  );
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
  marginBottom: "6px",
  marginTop: "16px",
  display: "block"
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  backgroundColor: "white",
  boxSizing: "border-box" as const
};

const buttonStyle = {
  color: "white",
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.2s ease"
};

export default Settings;