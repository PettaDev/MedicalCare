import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ClientScheduling from "./components/ClientScheduling";
import ReceptionistScheduling from "./components/ReceptionistScheduling";
import "./App.css";

// ── Tipos Primitivos: tipo da página ─────────────────────────────────────
type Page = "home" | "cliente" | "recepcionista";

// ── SPA — Single Page Application ───────────────────────────────────────
// Toda a navegação ocorre sem recarregar a página (sem React Router)
// usando apenas estado local (useState) para controlar a página ativa.
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  // Função Declarada — navegar entre páginas
  function navigate(page: Page): void {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // JSX — JavaScript XML: renderização condicional (DOM virtual do React)
  const renderPage = () => {
    if (currentPage === "cliente") return <ClientScheduling />;
    if (currentPage === "recepcionista") return <ReceptionistScheduling />;
    return <Home onNavigate={navigate} />;
  };

  return (
    <div className="app">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main className="main-content">{renderPage()}</main>
      <footer className="footer">
        <p>© 2025 MedicalCare — Sistema de Agendamento Médico</p>
        <p>Desenvolvido com React · SPA · JSX · Closures · Módulos · Promises</p>
      </footer>
    </div>
  );
}
