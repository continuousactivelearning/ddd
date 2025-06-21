const MyCourses = () => {
  const courses = [
    { name: "Data Structures", progress: 70, instructor: "Dr. Smith", nextClass: "Tomorrow 10:00 AM", assignments: 3 },
    { name: "Web Development", progress: 45, instructor: "Prof. Johnson", nextClass: "Today 2:00 PM", assignments: 2 },
    { name: "SQL Mastery", progress: 85, instructor: "Dr. Brown", nextClass: "Friday 11:00 AM", assignments: 1 },
    { name: "Cloud Basics", progress: 60, instructor: "Prof. Davis", nextClass: "Monday 9:00 AM", assignments: 4 },
    { name: "Data Analytics", progress: 50, instructor: "Dr. Wilson", nextClass: "Wednesday 3:00 PM", assignments: 2 },
    { name: "CS Fundamentals", progress: 90, instructor: "Prof. Taylor", nextClass: "Thursday 1:00 PM", assignments: 1 },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "#10b981";
    if (progress >= 60) return "#3b82f6";
    if (progress >= 40) return "#f59e0b";
    return "#ef4444";
  };

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
        }}>📘 My Courses</h1>
        <p style={{
          color: "#64748b",
          fontSize: "16px",
          margin: "0"
        }}>Track your progress across all enrolled courses</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "24px"
      }}>
        {courses.map((course, _index) => (
          <div
            key={course.name}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e2e8f0",
              transition: "all 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "16px"
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1e293b",
                margin: "0"
              }}>{course.name}</h3>
              <span style={{
                backgroundColor: course.assignments > 2 ? "#fef3c7" : "#dcfce7",
                color: course.assignments > 2 ? "#92400e" : "#166534",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "500"
              }}>
                {course.assignments} pending
              </span>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <p style={{
                color: "#64748b",
                fontSize: "14px",
                margin: "0 0 4px 0"
              }}>Instructor: {course.instructor}</p>
              <p style={{
                color: "#64748b",
                fontSize: "14px",
                margin: "0"
              }}>Next Class: {course.nextClass}</p>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px"
              }}>
                <span style={{
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: "500"
                }}>Progress</span>
                <span style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: getProgressColor(course.progress)
                }}>{course.progress}%</span>
              </div>
              <div style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#f1f5f9",
                borderRadius: "4px",
                overflow: "hidden"
              }}>
                <div
                  style={{
                    height: "100%",
                    backgroundColor: getProgressColor(course.progress),
                    width: `${course.progress}%`,
                    borderRadius: "4px",
                    transition: "width 0.3s ease"
                  }}
                ></div>
              </div>
            </div>

            <div style={{
              display: "flex",
              gap: "8px",
              marginTop: "16px"
            }}>
              <button style={{
                flex: "1",
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
              >
                Continue
              </button>
              <button style={{
                flex: "1",
                padding: "8px 16px",
                backgroundColor: "transparent",
                color: "#64748b",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.color = "#1e293b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#64748b";
              }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;