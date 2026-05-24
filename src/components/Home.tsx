type Page = "home" | "cliente" | "recepcionista";

interface HomeProps {
  onNavigate: (page: Page) => void;
}

// ── Componente Home — DOM e React.DOM (JSX) ──────────────────────────────
export default function Home({ onNavigate }: HomeProps) {
  const features = [
    {
      icon: "📅",
      title: "Agendamento Fácil",
      desc: "Marque sua consulta em poucos cliques, sem filas e sem espera.",
    },
    {
      icon: "👨‍⚕️",
      title: "Especialistas",
      desc: "Equipe com médicos em 8 especialidades prontos para atendê-lo.",
    },
    {
      icon: "🔒",
      title: "Seguro e Confiável",
      desc: "Seus dados protegidos e seus agendamentos sempre disponíveis.",
    },
    {
      icon: "⏰",
      title: "Atendimento Rápido",
      desc: "Horários flexíveis de manhã e tarde para encaixar na sua rotina.",
    },
  ];

  const specialties = [
    "Clínica Geral",
    "Cardiologia",
    "Dermatologia",
    "Ortopedia",
    "Neurologia",
    "Pediatria",
    "Ginecologia",
    "Oftalmologia",
  ];

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Cuidando da sua <span className="highlight">saúde</span>
            <br />com tecnologia e carinho
          </h1>
          <p className="hero-subtitle">
            Sistema moderno de agendamento médico. Rápido, seguro e acessível
            para pacientes e equipe de saúde.
          </p>
          <div className="hero-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate("cliente")}
            >
              📅 Agendar Consulta
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => onNavigate("recepcionista")}
            >
              👩‍⚕️ Área da Recepção
            </button>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="hero-card">
            <div className="hero-card-icon">⚕️</div>
            <div className="hero-card-text">
              <strong>MedicalCare</strong>
              <span>Sua saúde em primeiro lugar</span>
            </div>
          </div>
          <div className="stat-badges">
            <div className="stat-badge">
              <strong>8</strong>
              <span>Especialidades</span>
            </div>
            <div className="stat-badge">
              <strong>8</strong>
              <span>Médicos</span>
            </div>
            <div className="stat-badge">
              <strong>24/7</strong>
              <span>Online</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <h2 className="section-title">Por que escolher o MedicalCare?</h2>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specialties */}
      <section className="section section-blue">
        <h2 className="section-title">Nossas Especialidades</h2>
        <div className="specialties-grid">
          {specialties.map((s) => (
            <div className="specialty-pill" key={s}>
              {s}
            </div>
          ))}
        </div>
        <button
          className="btn btn-white btn-lg mt-6"
          onClick={() => onNavigate("cliente")}
        >
          Agendar agora →
        </button>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <h2>Pronto para cuidar da sua saúde?</h2>
        <p>Agende sua consulta agora mesmo ou entre em contato com nossa recepção.</p>
        <div className="hero-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate("cliente")}
          >
            Agendar como Paciente
          </button>
          <button
            className="btn btn-outline btn-lg"
            onClick={() => onNavigate("recepcionista")}
          >
            Acesso Recepcionista
          </button>
        </div>
      </section>
    </div>
  );
}
