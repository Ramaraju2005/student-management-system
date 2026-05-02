const EmptyState = ({ icon = "📭", title, description, action }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <h3 className="empty-title">{title}</h3>
    {description && <p className="empty-description">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
