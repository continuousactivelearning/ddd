import { useState } from "react";

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  assignments: boolean;
  quizzes: boolean;
  announcements: boolean;
}

interface PrivacySettings {
  profileVisibility: string;
  activityVisibility: string;
  allowMessages: boolean;
}

interface PreferenceSettings {
  theme: string;
  language: string;
  timezone: string;
  autoSave: boolean;
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
}

const Settings = () => {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: false,
    sms: false,
    assignments: true,
    quizzes: true,
    announcements: false
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "friends",
    activityVisibility: "private",
    allowMessages: true
  });

  const [preferences, setPreferences] = useState<PreferenceSettings>({
    theme: "light",
    language: "english",
    timezone: "UTC",
    autoSave: true
  });

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: string | boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: keyof PreferenceSettings, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const ToggleSwitch = ({ 
    checked, 
    onChange, 
    label 
  }: ToggleSwitchProps) => (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 0"
    }}>
      <span style={{
        fontSize: "14px",
        color: "#374151"
      }}>{label}</span>
      <div
        style={{
          width: "44px",
          height: "24px",
          backgroundColor: checked ? "#3b82f6" : "#d1d5db",
          borderRadius: "12px",
          position: "relative",
          cursor: "pointer",
          transition: "background-color 0.2s ease"
        }}
        onClick={() => onChange(!checked)}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: "white",
            borderRadius: "50%",
            position: "absolute",
            top: "2px",
            left: checked ? "22px" : "2px",
            transition: "left 0.2s ease",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
          }}
        />
      </div>
    </div>
  );

  const SelectInput = ({ 
    value, 
    onChange, 
    options, 
    label 
  }: SelectInputProps) => (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 0"
    }}>
      <span style={{
        fontSize: "14px",
        color: "#374151"
      }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #d1d5db",
          backgroundColor: "white",
          fontSize: "14px",
          cursor: "pointer"
        }}
      >
        {options.map((option: { value: string; label: string }) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div style={{
      padding: "32px",
      paddingLeft: "230px",
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{
        marginBottom: "32px"
      }}>
        <h1 style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#1e293b",
          margin: "0 0 8px 0"
        }}>⚙️ Settings</h1>
        <p style={{
          color: "#64748b",
          fontSize: "16px",
          margin: "0"
        }}>Manage your account preferences and privacy settings</p>
      </div>

      <div style={{
        display: "grid",
        gap: "24px",
        maxWidth: "800px"
      }}>
        {/* Account Settings */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <span style={{
              fontSize: "20px",
              marginRight: "8px"
            }}>👤</span>
            <h2 style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0"
            }}>Account Settings</h2>
          </div>
          
          <div style={{
            display: "grid",
            gap: "16px"
          }}>
            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px"
              }}>Full Name</label>
              <input
                type="text"
                defaultValue="Gaurpad Shukla"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  backgroundColor: "white"
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px"
              }}>Email Address</label>
              <input
                type="email"
                defaultValue="gaurpad@gmail.com"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  backgroundColor: "white"
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px"
              }}>Student ID</label>
              <input
                type="text"
                defaultValue="PES2024001"
                disabled
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  backgroundColor: "#f9fafb",
                  color: "#6b7280"
                }}
              />
            </div>
            
            <button style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              alignSelf: "flex-start",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
            >
              Update Profile
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <span style={{
              fontSize: "20px",
              marginRight: "8px"
            }}>🔔</span>
            <h2 style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0"
            }}>Notification Preferences</h2>
          </div>
          
          <div style={{
            borderBottom: "1px solid #f1f5f9",
            paddingBottom: "16px",
            marginBottom: "16px"
          }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#374151",
              margin: "0 0 12px 0"
            }}>Notification Methods</h3>
            <ToggleSwitch
              checked={notifications.email}
              onChange={(value) => handleNotificationChange('email', value)}
              label="Email Notifications"
            />
            <ToggleSwitch
              checked={notifications.push}
              onChange={(value) => handleNotificationChange('push', value)}
              label="Push Notifications"
            />
            <ToggleSwitch
              checked={notifications.sms}
              onChange={(value) => handleNotificationChange('sms', value)}
              label="SMS Notifications"
            />
          </div>
          
          <div>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#374151",
              margin: "0 0 12px 0"
            }}>Notification Types</h3>
            <ToggleSwitch
              checked={notifications.assignments}
              onChange={(value) => handleNotificationChange('assignments', value)}
              label="Assignment Reminders"
            />
            <ToggleSwitch
              checked={notifications.quizzes}
              onChange={(value) => handleNotificationChange('quizzes', value)}
              label="Quiz Notifications"
            />
            <ToggleSwitch
              checked={notifications.announcements}
              onChange={(value) => handleNotificationChange('announcements', value)}
              label="Course Announcements"
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <span style={{
              fontSize: "20px",
              marginRight: "8px"
            }}>🔒</span>
            <h2 style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0"
            }}>Privacy Settings</h2>
          </div>
          
          <div style={{
            display: "grid",
            gap: "8px"
          }}>
            <SelectInput
              value={privacy.profileVisibility}
              onChange={(value) => handlePrivacyChange('profileVisibility', value)}
              options={[
                { value: "public", label: "Public" },
                { value: "friends", label: "Friends Only" },
                { value: "private", label: "Private" }
              ]}
              label="Profile Visibility"
            />
            <SelectInput
              value={privacy.activityVisibility}
              onChange={(value) => handlePrivacyChange('activityVisibility', value)}
              options={[
                { value: "public", label: "Public" },
                { value: "friends", label: "Friends Only" },
                { value: "private", label: "Private" }
              ]}
              label="Activity Visibility"
            />
            <ToggleSwitch
              checked={privacy.allowMessages}
              onChange={(value) => handlePrivacyChange('allowMessages', value)}
              label="Allow Messages from Other Students"
            />
          </div>
        </div>

        {/* General Preferences */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <span style={{
              fontSize: "20px",
              marginRight: "8px"
            }}>🎨</span>
            <h2 style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0"
            }}>General Preferences</h2>
          </div>
          
          <div style={{
            display: "grid",
            gap: "8px"
          }}>
            <SelectInput
              value={preferences.theme}
              onChange={(value) => handlePreferenceChange('theme', value)}
              options={[
                { value: "light", label: "Light Mode" },
                { value: "dark", label: "Dark Mode" },
                { value: "auto", label: "Auto (System)" }
              ]}
              label="Theme"
            />
            <SelectInput
              value={preferences.language}
              onChange={(value) => handlePreferenceChange('language', value)}
              options={[
                { value: "english", label: "English" },
                { value: "spanish", label: "Spanish" },
                { value: "french", label: "French" },
                { value: "german", label: "German" }
              ]}
              label="Language"
            />
            <SelectInput
              value={preferences.timezone}
              onChange={(value) => handlePreferenceChange('timezone', value)}
              options={[
                { value: "UTC", label: "UTC" },
                { value: "EST", label: "Eastern Time" },
                { value: "PST", label: "Pacific Time" },
                { value: "GMT", label: "GMT" },
                { value: "IST", label: "India Standard Time" }
              ]}
              label="Timezone"
            />
            <ToggleSwitch
              checked={preferences.autoSave}
              onChange={(value) => handlePreferenceChange('autoSave', value)}
              label="Auto-save Work"
            />
          </div>
        </div>

        {/* Security Settings */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <span style={{
              fontSize: "20px",
              marginRight: "8px"
            }}>🛡️</span>
            <h2 style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0"
            }}>Security</h2>
          </div>
          
          <div style={{
            display: "grid",
            gap: "16px"
          }}>
            <button style={{
              backgroundColor: "#ef4444",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              alignSelf: "flex-start",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
            >
              Change Password
            </button>
            
            <button style={{
              backgroundColor: "#10b981",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              alignSelf: "flex-start",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#059669"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#10b981"}
            >
              Enable Two-Factor Authentication
            </button>
            
            <div style={{
              padding: "16px",
              backgroundColor: "#fef3c7",
              borderRadius: "8px",
              border: "1px solid #f59e0b"
            }}>
              <p style={{
                fontSize: "14px",
                color: "#92400e",
                margin: "0"
              }}>
                <strong>Last login:</strong> Today at 2:45 PM from Chrome on Windows
              </p>
            </div>
          </div>
        </div>

        {/* Save Changes */}
        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end",
          paddingTop: "24px"
        }}>
          <button style={{
            backgroundColor: "#6b7280",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#6b7280"}
          >
            Cancel
          </button>
          
          <button style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;