import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudents, deleteStudent } from "../services/api";
import { useToast } from "../hooks/useToast";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import DeleteModal from "../components/DeleteModal";

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      const data = await fetchStudents(params);
      setStudents(data.data);
    } catch {
      addToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(loadStudents, 350);
    return () => clearTimeout(timer);
  }, [loadStudents]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteStudent(deleteTarget._id);
      addToast(`${deleteTarget.fullName} has been deleted`, "success");
      setDeleteTarget(null);
      loadStudents();
    } catch (err) {
      addToast(err?.response?.data?.message || "Failed to delete student", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">All Students</h1>
          <p className="page-subtitle">Manage and view all registered students</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/students/add")}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Student
        </button>
      </div>

      {/* Card with table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Table controls */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <div className="table-controls">
            <div className="table-controls-left">
              {/* Search */}
              <div className="search-bar">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search by name, roll no, email, course..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Status filter */}
              <select
                className="form-input form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: "auto", minWidth: 130 }}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {!loading && (
              <span className="table-count">
                {students.length} student{students.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Spinner text="Loading students..." />
        ) : students.length === 0 ? (
          <EmptyState
            icon="🎓"
            title={search || statusFilter ? "No students match your search" : "No students yet"}
            description={
              search || statusFilter
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first student record."
            }
            action={
              !search && !statusFilter ? (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/students/add")}
                >
                  Add First Student
                </button>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => { setSearch(""); setStatusFilter(""); }}
                >
                  Clear Filters
                </button>
              )
            }
          />
        ) : (
          <div className="table-wrapper" style={{ border: "none", borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No.</th>
                  <th>Contact</th>
                  <th>Course / Dept</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Added</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="td-name">{s.fullName}</div>
                    </td>
                    <td>
                      <span className="td-mono">{s.rollNumber}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.82rem" }}>{s.email}</div>
                      <div className="td-meta">{s.phone}</div>
                    </td>
                    <td>
                      <div>{s.course}</div>
                      <div className="td-meta">{s.department}</div>
                    </td>
                    <td>{s.year}</td>
                    <td>
                      <span className={`badge badge-${s.status.toLowerCase()}`}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                      {formatDate(s.createdAt)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Edit student"
                          onClick={() => navigate(`/students/edit/${s._id}`)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="btn btn-danger btn-sm btn-icon"
                          title="Delete student"
                          onClick={() => setDeleteTarget(s)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          studentName={deleteTarget.fullName}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleteLoading}
        />
      )}
    </div>
  );
};

export default StudentList;
