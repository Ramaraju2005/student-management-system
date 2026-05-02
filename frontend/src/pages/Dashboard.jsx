import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStats } from "../services/api";
import Spinner from "../components/Spinner";

const StatCard = ({ icon, label, value, colorClass }) => (
  <div className="stat-card">
    <div className={`stat-icon ${colorClass}`}>{icon}</div>
    <div className="stat-info">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats()
      .then((data) => {
        setStats(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard data. Is the backend running?");
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) return <Spinner text="Loading dashboard..." />;

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <h3 style={{ color: "var(--text-primary)", marginBottom: 8 }}>Connection Error</h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's an overview of your students.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/students/add")}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Student
        </button>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <StatCard
          icon="🎓"
          label="Total Students"
          value={stats?.totalStudents ?? 0}
          colorClass="blue"
        />
        <StatCard
          icon="✅"
          label="Active Students"
          value={stats?.activeStudents ?? 0}
          colorClass="green"
        />
        <StatCard
          icon="🚫"
          label="Inactive Students"
          value={stats?.inactiveStudents ?? 0}
          colorClass="red"
        />
        <StatCard
          icon="📅"
          label="Recently Added"
          value={stats?.recentStudents?.length ?? 0}
          colorClass="amber"
        />
      </div>

      {/* Recent students table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recently Added Students</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/students")}>
            View All →
          </button>
        </div>

        {!stats?.recentStudents?.length ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              No students added yet.{" "}
              <span
                style={{ color: "var(--primary)", cursor: "pointer" }}
                onClick={() => navigate("/students/add")}
              >
                Add your first student →
              </span>
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll Number</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Added On</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentStudents.map((s) => (
                  <tr key={s._id} className="recent-row">
                    <td className="td-name">{s.fullName}</td>
                    <td><span className="td-mono">{s.rollNumber}</span></td>
                    <td>{s.course}</td>
                    <td>
                      <span className={`badge badge-${s.status.toLowerCase()}`}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                      {formatDate(s.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick action cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginTop: 20,
        }}
      >
        <div
          className="card"
          style={{ cursor: "pointer", transition: "box-shadow 150ms ease" }}
          onClick={() => navigate("/students/add")}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>➕</div>
          <h3 style={{ fontWeight: 700, marginBottom: 4, fontSize: "0.95rem" }}>Add New Student</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Register a new student record into the system.
          </p>
        </div>

        <div
          className="card"
          style={{ cursor: "pointer", transition: "box-shadow 150ms ease" }}
          onClick={() => navigate("/students")}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>📋</div>
          <h3 style={{ fontWeight: 700, marginBottom: 4, fontSize: "0.95rem" }}>View All Students</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Browse, search, and manage all student records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
