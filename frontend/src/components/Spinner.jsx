const Spinner = ({ size = "default", text = "Loading..." }) => (
  <div className="spinner-wrapper">
    <div className={`spinner ${size === "sm" ? "spinner-sm" : ""}`} />
    {text && <p className="spinner-text">{text}</p>}
  </div>
);

export default Spinner;
