import React, { useState, useEffect, useCallback } from "react";
import { Appointment, type AppointmentStatus, AVAILABLE_DOCTORS, AVAILABLE_TIMES, Doctor } from "../models/Appointment";
import {
  fetchAppointments,
  saveAppointment,
  changeStatus,
  deleteAppointment,
  validateField,
} from "../modules/appointmentService";
import AppointmentCard from "./AppointmentCard";

type FilterStatus = "todos" | AppointmentStatus;

interface NewForm {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  date: string;
  time: string;
  notes: string;
}

// ── Componente Recepcionista — useEffect + useCallback (Ciclo de Vida) ───
export default function ReceptionistScheduling() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [form, setForm] = useState<NewForm>({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    doctorId: "",
    date: "",
    time: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});

  // ── useEffect — Ciclo de Vida: montagem do componente ───────────────
  useEffect(() => {
    // Callback Assíncrono
    const loadData = async () => {
      try {
        const data = await fetchAppointments();
        setAppointments(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ── useCallback — Funções Memoizadas (Closures + Callbacks) ─────────
  const handleStatusChange = useCallback(
    (id: string, status: AppointmentStatus) => {
      // Promise then/catch
      changeStatus(id, status)
        .then((ok) => {
          if (ok) {
            setAppointments((prev) => {
              const idx = prev.findIndex((a) => a.id === id);
              if (idx === -1) return prev;
              prev[idx].status = status;
              return [...prev]; // novo array, instâncias preservadas (prototype intacto)
            });
          }
        })
        .catch(console.error);
    },
    []
  );

  const handleDelete = useCallback((id: string) => {
    deleteAppointment(id)
      .then((ok) => {
        if (ok) setAppointments((prev) => prev.filter((a) => a.id !== id));
      })
      .catch(console.error);
  }, []);

  // ── Funções Anônimas — handlers do formulário interno ────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields = ["patientName", "patientEmail", "patientPhone", "doctorId", "date", "time"];
    const errors: Record<string, string | null> = {};
    let valid = true;

    fields.forEach((f) => {
      const err = validateField(f, form[f as keyof NewForm]);
      errors[f] = err;
      if (err) valid = false;
    });

    setFormErrors(errors);
    if (!valid) return;

    setFormLoading(true);
    const doctor = AVAILABLE_DOCTORS.find((d) => d.crm === form.doctorId) as Doctor;
    const appt = new Appointment(
      form.patientName,
      form.patientEmail,
      form.patientPhone,
      doctor,
      form.date,
      form.time,
      form.notes
    );
    appt.status = "confirmado";

    saveAppointment(appt)
      .then((saved) => {
        setAppointments((prev) => [saved, ...prev]);
        setFormSuccess(true);
        setForm({ patientName: "", patientEmail: "", patientPhone: "", doctorId: "", date: "", time: "", notes: "" });
        setFormErrors({});
        setTimeout(() => {
          setFormSuccess(false);
          setShowForm(false);
        }, 2000);
      })
      .finally(() => setFormLoading(false));
  };

  // ── Filtragem — Funções Anônimas (arrow) + Métodos de Array ─────────
  const filtered = appointments.filter((a) => {
    const byStatus = filterStatus === "todos" || a.status === filterStatus;
    const byDoctor = !filterDoctor || a.doctor.crm === filterDoctor;
    const byDate = !filterDate || a.date === filterDate;
    return byStatus && byDoctor && byDate;
  });

  const counts = {
    todos: appointments.length,
    pendente: appointments.filter((a) => a.status === "pendente").length,
    confirmado: appointments.filter((a) => a.status === "confirmado").length,
    cancelado: appointments.filter((a) => a.status === "cancelado").length,
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-screen">
          <div className="spinner" />
          <p>Carregando agendamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👩‍⚕️ Painel da Recepcionista</h1>
        <p>Gerencie todos os agendamentos médicos da clínica.</p>
      </div>

      {/* Estatísticas */}
      <div className="stats-grid">
        {(["todos", "confirmado", "pendente", "cancelado"] as const).map((s) => (
          <button
            key={s}
            className={`stat-card ${filterStatus === s ? "stat-card-active" : ""} stat-${s}`}
            onClick={() => setFilterStatus(s)}
          >
            <strong>{counts[s]}</strong>
            <span>
              {s === "todos" ? "Total" : s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <select
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos os médicos</option>
          {AVAILABLE_DOCTORS.map((d) => (
            <option key={d.crm} value={d.crm}>
              {d.getLabel()}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="filter-input"
          placeholder="Filtrar por data"
        />

        {(filterDoctor || filterDate) && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { setFilterDoctor(""); setFilterDate(""); }}
          >
            ✕ Limpar filtros
          </button>
        )}

        <button
          className="btn btn-primary btn-sm ml-auto"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Fechar" : "+ Novo Agendamento"}
        </button>
      </div>

      {/* Formulário rápido */}
      {showForm && (
        <div className="inline-form">
          <h3>+ Novo Agendamento (Recepcionista)</h3>
          {formSuccess && (
            <div className="alert alert-success">✅ Agendamento criado e confirmado!</div>
          )}
          <form onSubmit={handleFormSubmit} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome do Paciente *</label>
                <input name="patientName" placeholder="Nome completo" value={form.patientName} onChange={handleChange} className={formErrors.patientName ? "input-error" : ""} />
                {formErrors.patientName && <span className="error-msg">{formErrors.patientName}</span>}
              </div>
              <div className="form-group">
                <label>E-mail *</label>
                <input name="patientEmail" type="email" placeholder="email@exemplo.com" value={form.patientEmail} onChange={handleChange} className={formErrors.patientEmail ? "input-error" : ""} />
                {formErrors.patientEmail && <span className="error-msg">{formErrors.patientEmail}</span>}
              </div>
              <div className="form-group">
                <label>Telefone *</label>
                <input name="patientPhone" type="tel" placeholder="(11) 99999-9999" value={form.patientPhone} onChange={handleChange} className={formErrors.patientPhone ? "input-error" : ""} />
                {formErrors.patientPhone && <span className="error-msg">{formErrors.patientPhone}</span>}
              </div>
              <div className="form-group">
                <label>Médico *</label>
                <select name="doctorId" value={form.doctorId} onChange={handleChange} className={formErrors.doctorId ? "input-error" : ""}>
                  <option value="">Selecione...</option>
                  {AVAILABLE_DOCTORS.map((d) => (
                    <option key={d.crm} value={d.crm}>{d.getLabel()}</option>
                  ))}
                </select>
                {formErrors.doctorId && <span className="error-msg">{formErrors.doctorId}</span>}
              </div>
              <div className="form-group">
                <label>Data *</label>
                <input name="date" type="date" min={today} value={form.date} onChange={handleChange} className={formErrors.date ? "input-error" : ""} />
                {formErrors.date && <span className="error-msg">{formErrors.date}</span>}
              </div>
              <div className="form-group">
                <label>Horário *</label>
                <select name="time" value={form.time} onChange={handleChange} className={formErrors.time ? "input-error" : ""}>
                  <option value="">Selecione...</option>
                  {AVAILABLE_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {formErrors.time && <span className="error-msg">{formErrors.time}</span>}
              </div>
              <div className="form-group form-group-full">
                <label>Observações</label>
                <textarea name="notes" rows={2} placeholder="Observações opcionais..." value={form.notes} onChange={handleChange} />
              </div>
            </div>
            <div className="form-footer">
              <button type="submit" className="btn btn-primary" disabled={formLoading}>
                {formLoading ? "⏳ Salvando..." : "✅ Criar Agendamento"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista */}
      <div className="appointments-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span>📭</span>
            <p>Nenhum agendamento encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <>
            <p className="list-count">
              Exibindo <strong>{filtered.length}</strong> agendamento(s)
            </p>
            {filtered.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                isReceptionist
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
