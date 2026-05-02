import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchStudentById, updateStudent } from "../services/api";
import { useToast } from "../hooks/useToast";
import StudentForm from "../components/StudentForm";
import Spinner from "../components/Spinner";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [student, setStudent] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudentById(id)
      .then((data) => {
        setStudent(data.data);
        setLoadingData(false);
      })
      .catch(() => {
        addToast("Student not found", "error");
        navigate("/students");
      });
  }, [id]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      await updateStudent(id, formData);
      addToast("Student updated successfully!", "success");
      navigate("/students");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to update student. Please try again.";
      addToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) return <Spinner text="Loading student data..." />;

  return (
    <div>
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16, paddingLeft: 4 }}
      >
        ← Back
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Student</h1>
          <p className="page-subtitle">
            Editing: <strong>{student?.fullName}</strong> &nbsp;·&nbsp;{" "}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
              {student?.rollNumber}
            </span>
          </p>
        </div>
      </div>

      <div className="card">
        <StudentForm
          initialData={student}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/students")}
          isLoading={saving}
        />
      </div>
    </div>
  );
};

export default EditStudent;
