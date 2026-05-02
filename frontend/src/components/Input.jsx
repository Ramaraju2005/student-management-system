const Input = ({
  label,
  required,
  error,
  type = "text",
  className = "",
  ...props
}) => (
  <div className={`form-group ${className}`}>
    {label && (
      <label className="form-label">
        {label}
        {required && <span>*</span>}
      </label>
    )}
    <input
      type={type}
      className={`form-input ${error ? "error" : ""}`}
      {...props}
    />
    {error && <span className="form-error">⚠ {error}</span>}
  </div>
);

export default Input;
