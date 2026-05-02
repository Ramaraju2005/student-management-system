import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import StudentList from "./pages/StudentList";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import { ToastProvider } from "./hooks/useToast";

// Page title mapping
const PAGE_INFO = {
  "/": { title: "Dashboard", subtitle: "Overview & Stats" },
  "/students": { title: "All Students", subtitle: "Students → List" },
  "/students/add": { title: "Add Student", subtitle: "Students → Add New" },
};

const getPageInfo = (pathname) => {
  if (pathname.startsWith("/students/edit/")) {
    return { title: "Edit Student", subtitle: "Students → Edit" };
  }
  return PAGE_INFO[pathname] || { title: "Page", subtitle: "" };
};

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { title, subtitle } = getPageInfo(location.pathname);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen((o) => !o)}
        />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/add" element={<AddStudent />} />
            <Route path="/students/edit/:id" element={<EditStudent />} />
            {/* 404 fallback */}
            <Route
              path="*"
              element={
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                  <div style={{ fontSize: 56 }}>🔍</div>
                  <h2 style={{ marginTop: 16, marginBottom: 8 }}>Page Not Found</h2>
                  <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
                    The page you're looking for doesn't exist.
                  </p>
                  <a href="/" className="btn btn-primary">
                    Go to Dashboard
                  </a>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppLayout />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
