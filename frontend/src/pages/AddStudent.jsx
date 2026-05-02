import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStudent } from "../services/api";
import { useToast } from "../hooks/useToast";
import StudentForm from "../components/StudentForm";

const AddStudent = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await createStudent(formData);
      addToast("Student added successfully!", "success");
      navigate("/students");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to add student. Please try again.";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Breadcrumb / back */}
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16, paddingLeft: 4 }}
      >
        ← Back
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Student</h1>
          <p className="page-subtitle">Fill in the details to register a new student</p>
        </div>
      </div>

      <div className="card">
        <StudentForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/students")}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default AddStudent;
