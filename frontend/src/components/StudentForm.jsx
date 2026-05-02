import { useState } from "react";
import Input from "./Input";

const COURSES = [
  "B.Tech", "B.Sc", "B.Com", "B.A", "MBA", "MCA", "M.Tech", "M.Sc",
  "BCA", "BBA", "Diploma", "PhD", "Other",
];

const DEPARTMENTS = [
  "Computer Science", "Electronics", "Mechanical", "Civil", "Electrical",
  "Information Technology", "Chemical", "Mathematics", "Physics", "Commerce",
  "Business Administration", "Arts", "Other",
];

const YEARS = [
  "1st Year", "2nd Year", "3rd Year", "4th Year",
  "Semester 1", "Semester 2", "Semester 3", "Semester 4",
  "Semester 5", "Semester 6", "Semester 7", "Semester 8",
];

const initialState = {
  fullName: "",
  rollNumber: "",
  email: "",
  phone: "",
  course: "",
  department: "",
  year: "",
  status: "Active",
  address: "",
};

const validate = (data) => {
  const errors = {};
  if (!data.fullName.trim()) errors.fullName = "Full name is required";
  else if (data.fullName.trim().length < 2) errors.fullName = "Name must be at least 2 characters";

  if (!data.rollNumber.trim()) errors.rollNumber = "Roll number is required";

  if (!data.email.trim()) errors.email = "Email is required";
  else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))
    errors.email = "Enter a valid email address";

  if (!data.phone.trim()) errors.phone = "Phone number is required";
  else if (!/^[0-9+\-\s()]{7,15}$/.test(data.phone))
    errors.phone = "Enter a valid phone number";

  if (!data.course) errors.course = "Course is required";
  if (!data.department) errors.department = "Department is required";
  if (!data.year) errors.year = "Year / Semester is required";

  return errors;
};

const StudentForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [form, setForm] = useState(
    initialData ? { ...initialState, ...initialData } : initialState
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        {/* Row 1 */}
        <Input
          label="Full Name"
          required
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="e.g. Arjun Sharma"
          error={errors.fullName}
        />
        <Input
          label="Roll Number / Student ID"
          required
          name="rollNumber"
          value={form.rollNumber}
          onChange={handleChange}
          placeholder="e.g. CS2024001"
          error={errors.rollNumber}
        />

        {/* Row 2 */}
        <Input
          label="Email Address"
          required
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="e.g. arjun@example.com"
          error={errors.email}
        />
        <Input
          label="Phone Number"
          required
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="e.g. +91 98765 43210"
          error={errors.phone}
        />

        {/* Row 3 */}
        <div className="form-group">
          <label className="form-label">
            Course <span>*</span>
          </label>
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            className={`form-input form-select ${errors.course ? "error" : ""}`}
          >
            <option value="">Select course...</option>
            {COURSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.course && <span className="form-error">⚠ {errors.course}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Department <span>*</span>
          </label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className={`form-input form-select ${errors.department ? "error" : ""}`}
          >
            <option value="">Select department...</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.department && <span className="form-error">⚠ {errors.department}</span>}
        </div>

        {/* Row 4 */}
        <div className="form-group">
          <label className="form-label">
            Year / Semester <span>*</span>
          </label>
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className={`form-input form-select ${errors.year ? "error" : ""}`}
          >
            <option value="">Select year / semester...</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {errors.year && <span className="form-error">⚠ {errors.year}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="form-input form-select"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Address - full width */}
        <div className="form-group full-width">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="form-input"
            placeholder="Street, City, State, Pincode"
            rows={3}
            style={{ resize: "vertical" }}
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span
                  className="spinner spinner-sm"
                  style={{ borderTopColor: "white" }}
                />
                Saving...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
                </svg>
                {initialData ? "Save Changes" : "Add Student"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default StudentForm;
