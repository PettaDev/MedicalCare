import { Appointment, type AppointmentStatus } from "../models/Appointment";

interface AppointmentCardProps {
  appointment: Appointment;
  isReceptionist?: boolean;
  onStatusChange?: (id: string, status: AppointmentStatus) => void;
  onDelete?: (id: string) => void;
}

// ── Componente de Carta de Agendamento ───────────────────────────────────
export default function AppointmentCard({
  appointment,
  isReceptionist = false,
  onStatusChange,
  onDelete,
}: AppointmentCardProps) {
  // Funções Anônimas (arrow) como handlers
  const handleConfirm = () => onStatusChange?.(appointment.id, "confirmado");
  const handleCancel = () => onStatusChange?.(appointment.id, "cancelado");
  const handlePending = () => onStatusChange?.(appointment.id, "pendente");
  const handleDelete = () => {
    if (window.confirm(`Remover agendamento de ${appointment.patientName}?`)) {
      onDelete?.(appointment.id);
    }
  };

  // Tipos Primitivos: string para classe CSS
  const statusClass: Record<AppointmentStatus, string> = {
    pendente: "status-pending",
    confirmado: "status-confirmed",
    cancelado: "status-cancelled",
  };

  const statusIcon: Record<AppointmentStatus, string> = {
    pendente: "⏳",
    confirmado: "✅",
    cancelado: "❌",
  };

  // Formatação de data — Métodos de Tipos Primitivos
  const formattedDate = new Date(appointment.date + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={`appointment-card ${statusClass[appointment.status]}`}>
      <div className="card-header">
        <div className="card-id">{appointment.id}</div>
        <span className={`status-badge ${statusClass[appointment.status]}`}>
          {statusIcon[appointment.status]} {appointment.getStatusLabel()}
        </span>
      </div>

      <div className="card-body">
        <div className="card-info-row">
          <div className="card-info">
            <span className="info-label">👤 Paciente</span>
            <span className="info-value">{appointment.patientName}</span>
          </div>
          <div className="card-info">
            <span className="info-label">📞 Contato</span>
            <span className="info-value">{appointment.patientPhone}</span>
          </div>
        </div>

        <div className="card-info-row">
          <div className="card-info">
            <span className="info-label">👨‍⚕️ Médico</span>
            <span className="info-value">{appointment.doctor.getLabel()}</span>
          </div>
          <div className="card-info">
            <span className="info-label">🏥 Especialidade</span>
            <span className="info-value">{appointment.doctor.specialty}</span>
          </div>
        </div>

        <div className="card-info-row">
          <div className="card-info">
            <span className="info-label">📅 Data</span>
            <span className="info-value">{formattedDate}</span>
          </div>
          <div className="card-info">
            <span className="info-label">🕐 Horário</span>
            <span className="info-value">{appointment.time}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="card-notes">
            <span className="info-label">📝 Observações</span>
            <span className="info-value">{appointment.notes}</span>
          </div>
        )}
      </div>

      {isReceptionist && (
        <div className="card-actions">
          {appointment.status === "pendente" && (
            <button className="btn btn-success btn-sm" onClick={handleConfirm}>
              ✅ Confirmar
            </button>
          )}
          {appointment.status === "cancelado" && (
            <button className="btn btn-outline btn-sm" onClick={handlePending}>
              ⏳ Reativar
            </button>
          )}
          {appointment.status !== "cancelado" && (
            <button className="btn btn-warning btn-sm" onClick={handleCancel}>
              ❌ Cancelar
            </button>
          )}
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            🗑️ Remover
          </button>
        </div>
      )}
    </div>
  );
}
