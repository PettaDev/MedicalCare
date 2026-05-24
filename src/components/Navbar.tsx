type Page = "home" | "cliente" | "recepcionista";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

// ── Componente Funcional com Props (Funções Declaradas) ──────────────────
export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: "home", label: "Início", icon: "🏥" },
    { id: "cliente", label: "Agendar Consulta", icon: "📅" },
    { id: "recepcionista", label: "Recepcionista", icon: "👩‍⚕️" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">⚕️</span>
        <span className="navbar-title">MedicalCare</span>
      </div>
      <ul className="navbar-links">
        {navItems.map(({ id, label, icon }) => (
          <li key={id}>
            <button
              className={`nav-btn ${currentPage === id ? "active" : ""}`}
              onClick={() => onNavigate(id)}
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
