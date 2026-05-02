const DeleteModal = ({ studentName, onConfirm, onCancel, isLoading }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>

      <h2 className="modal-title">Delete Student</h2>
      <p className="modal-body">
        Are you sure you want to delete{" "}
        <strong>{studentName}</strong>? This action cannot be undone and all
        student data will be permanently removed.
      </p>

      <div className="modal-actions">
        <button
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          className="btn btn-danger"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner spinner-sm" style={{ borderTopColor: "white" }} />
              Deleting...
            </>
          ) : (
            "Delete Student"
          )}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteModal;
