import React, { useState } from "react";
import { Appointment, AVAILABLE_DOCTORS, AVAILABLE_TIMES, Doctor } from "../models/Appointment";
import { saveAppointment, validateField } from "../modules/appointmentService";

// ── Tipos de Referência: forma literal do estado do formulário ───────────
interface FormState {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  date: string;
  time: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string | null;
}

// ── Componente Funcional — Ciclo de Vida com Hooks ───────────────────────
export default function ClientScheduling() {
  // useState — estado do componente (Ciclo de Vida)
  const [form, setForm] = useState<FormState>({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    doctorId: "",
    date: "",
    time: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<Appointment | null>(null);

  // ── Funções Anônimas — handlers de formulário ────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validação dinâmica em tempo real (Funções Anônimas e Dinâmicas)
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Função Declarada — valida o formulário completo
  function validateForm(): boolean {
    const fields = ["patientName", "patientEmail", "patientPhone", "doctorId", "date", "time"];
    const newErrors: FormErrors = {};
    let valid = true;

    fields.forEach((field) => {
      const error = validateField(field, form[field as keyof FormState]);
      newErrors[field] = error;
      if (error) valid = false;
    });

    setErrors(newErrors);
    return valid;
  }

  // ── Promises + Callbacks Assíncronos ────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const doctor = AVAILABLE_DOCTORS.find((d) => d.crm === form.doctorId) as Doctor;
    const appointment = new Appointment(
      form.patientName,
      form.patientEmail,
      form.patientPhone,
      doctor,
      form.date,
      form.time,
      form.notes
    );

    // Promise com then/catch/finally
    saveAppointment(appointment)
      .then((saved) => {
        setSuccess(saved);
        setForm({
          patientName: "",
          patientEmail: "",
          patientPhone: "",
          doctorId: "",
          date: "",
          time: "",
          notes: "",
        });
        setErrors({});
      })
      .catch((err: Error) => {
        console.error("Erro ao agendar:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNewAppointment = () => setSuccess(null);

  // Data mínima: hoje
  const today = new Date().toISOString().split("T")[0];

  // ── JSX — Criação de Componentes com React ───────────────────────────
  if (success) {
    return (
      <div className="page-container">
        <div className="success-screen">
          <div className="success-icon">✅</div>
          <h2>Agendamento Confirmado!</h2>
          <p>Seu agendamento foi registrado com sucesso.</p>
          <div className="success-details">
            <div className="success-row">
              <strong>Código:</strong> <span>{success.id}</span>
            </div>
            <div className="success-row">
              <strong>Paciente:</strong> <span>{success.patientName}</span>
            </div>
            <div className="success-row">
              <strong>Médico:</strong> <span>{success.doctor.getLabel()}</span>
            </div>
            <div className="success-row">
              <strong>Data:</strong>{" "}
              <span>
                {new Date(success.date + "T00:00:00").toLocaleDateString("pt-BR")} às{" "}
                {success.time}
              </span>
            </div>
            <div className="success-row">
              <strong>Status:</strong>{" "}
              <span className="status-badge status-pending">⏳ Pendente</span>
            </div>
          </div>
          <p className="success-info">
            Guarde o código do agendamento. Nossa recepção entrará em contato para confirmar.
          </p>
          <button className="btn btn-primary btn-lg" onClick={handleNewAppointment}>
            + Novo Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📅 Agendar Consulta</h1>
        <p>Preencha o formulário abaixo para agendar sua consulta médica.</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          {/* Dados do Paciente */}
          <fieldset className="form-section">
            <legend>👤 Dados do Paciente</legend>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="patientName">Nome completo *</label>
                <input
                  id="patientName"
                  name="patientName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.patientName}
                  onChange={handleChange}
                  className={errors.patientName ? "input-error" : ""}
                />
                {errors.patientName && (
                  <span className="error-msg">{errors.patientName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="patientEmail">E-mail *</label>
                <input
                  id="patientEmail"
                  name="patientEmail"
                  type="email"
                  placeholder="seu@email.com"
                  value={form.patientEmail}
                  onChange={handleChange}
                  className={errors.patientEmail ? "input-error" : ""}
                />
                {errors.patientEmail && (
                  <span className="error-msg">{errors.patientEmail}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="patientPhone">Telefone *</label>
                <input
                  id="patientPhone"
                  name="patientPhone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={form.patientPhone}
                  onChange={handleChange}
                  className={errors.patientPhone ? "input-error" : ""}
                />
                {errors.patientPhone && (
                  <span className="error-msg">{errors.patientPhone}</span>
                )}
              </div>
            </div>
          </fieldset>

          {/* Dados da Consulta */}
          <fieldset className="form-section">
            <legend>🏥 Dados da Consulta</legend>

            <div className="form-grid">
              <div className="form-group form-group-full">
                <label htmlFor="doctorId">Médico / Especialidade *</label>
                <select
                  id="doctorId"
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
                  className={errors.doctorId ? "input-error" : ""}
                >
                  <option value="">Selecione um médico...</option>
                  {AVAILABLE_DOCTORS.map((d) => (
                    <option key={d.crm} value={d.crm}>
                      {d.getLabel()} — CRM {d.crm}
                    </option>
                  ))}
                </select>
                {errors.doctorId && (
                  <span className="error-msg">{errors.doctorId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="date">Data da Consulta *</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={handleChange}
                  className={errors.date ? "input-error" : ""}
                />
                {errors.date && <span className="error-msg">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="time">Horário *</label>
                <select
                  id="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className={errors.time ? "input-error" : ""}
                >
                  <option value="">Selecione um horário...</option>
                  {AVAILABLE_TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.time && <span className="error-msg">{errors.time}</span>}
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="notes">Observações (opcional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Descreva brevemente o motivo da consulta ou sintomas..."
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </fieldset>

          <div className="form-footer">
            <p className="form-disclaimer">
              * Campos obrigatórios. Após o agendamento, nossa equipe entrará em contato para confirmar.
            </p>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? "⏳ Agendando..." : "✅ Confirmar Agendamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
