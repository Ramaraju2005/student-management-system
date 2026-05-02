import { NavLink } from "react-router-dom";

const DashboardIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
  </svg>
);

const StudentsIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const AddStudentIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
  </svg>
);

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 99,
          }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">EduAdmin</span>
            <span className="sidebar-logo-subtitle">Student Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>

          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <DashboardIcon />
            Dashboard
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <StudentsIcon />
            All Students
          </NavLink>

          <NavLink
            to="/students/add"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <AddStudentIcon />
            Add Student
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          Smart SMS v1.0.0
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
