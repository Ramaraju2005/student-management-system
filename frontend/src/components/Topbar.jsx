const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
  </svg>
);

const Topbar = ({ title, subtitle, onMenuClick }) => {
  const now = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          className="btn btn-ghost btn-icon"
          onClick={onMenuClick}
          style={{ display: "none" }}
          id="menu-toggle"
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </button>
        <style>{`
          @media (max-width: 900px) {
            #menu-toggle { display: flex !important; }
          }
        `}</style>
        <div className="topbar-left">
          <span className="topbar-title">{title}</span>
          {subtitle && <span className="topbar-breadcrumb">{subtitle}</span>}
        </div>
      </div>

      <div className="topbar-right">
        <span className="topbar-date">{now}</span>
      </div>
    </header>
  );
};

export default Topbar;
