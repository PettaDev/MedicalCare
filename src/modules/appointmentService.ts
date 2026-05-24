// ── Módulos ──────────────────────────────────────────────────────────────
// Módulo responsável por gerenciar agendamentos (Closure + Funções)

import { Appointment, type AppointmentStatus, Doctor, AVAILABLE_DOCTORS } from "../models/Appointment";

const STORAGE_KEY = "medicalcare_appointments";

// ── Serialização/Deserialização para localStorage ────────────────────────
// Necessário porque JSON.parse devolve objetos literais — sem prototype.
// Reconstruímos as instâncias das classes para manter os métodos intactos.
const deserialize = (json: string): Appointment[] => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return JSON.parse(json).map((raw: any) => {
      const doctor = new Doctor(
        raw.doctor.name,
        raw.doctor.email,
        raw.doctor.phone,
        raw.doctor.specialty,
        raw.doctor.crm
      );
      const appt = new Appointment(
        raw.patientName, raw.patientEmail, raw.patientPhone,
        doctor, raw.date, raw.time, raw.notes
      );
      appt.id = raw.id;
      appt.status = raw.status;
      appt.createdAt = new Date(raw.createdAt);
      return appt;
    });
  } catch {
    return [];
  }
};

// ── Closure: estado privado encapsulado no módulo ────────────────────────
const createAppointmentStore = () => {
  // Tenta carregar do localStorage; cai no seed se vazio
  let appointments: Appointment[] = (function (): Appointment[] {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const loaded = deserialize(saved);
      if (loaded.length > 0) return loaded;
    }

    // Função Autoinvocada (IIFE) — popula dados iniciais apenas na 1ª vez
    const seedDoctor = (index: number): Doctor => AVAILABLE_DOCTORS[index];
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    const addDays = (d: Date, n: number) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + n);
      return copy;
    };

    const seeds = [
      new Appointment("Maria Silva", "maria@email.com", "(11) 91111-1111", seedDoctor(0), fmt(addDays(today, 1)), "09:00", "Consulta de rotina"),
      new Appointment("João Pereira", "joao@email.com", "(11) 92222-2222", seedDoctor(1), fmt(addDays(today, 2)), "10:30", "Dor no peito"),
      new Appointment("Luisa Gomes", "luisa@email.com", "(11) 93333-3333", seedDoctor(2), fmt(addDays(today, 2)), "14:00", "Mancha na pele"),
    ];
    seeds[1].status = "confirmado";

    // Persiste o seed imediatamente
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
    return seeds;
  })();

  // Salva estado atual no localStorage após cada mutação
  const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));

  // ── Funções Declaradas ───────────────────────────────────────────────
  function getAll(): Appointment[] {
    return [...appointments];
  }

  function getById(id: string): Appointment | undefined {
    return appointments.find((a) => a.id === id);
  }

  function add(appointment: Appointment): void {
    appointments = [...appointments, appointment];
    persist();
  }

  function updateStatus(id: string, status: AppointmentStatus): boolean {
    const idx = appointments.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    appointments[idx].status = status;
    persist();
    return true;
  }

  function remove(id: string): boolean {
    const before = appointments.length;
    appointments = appointments.filter((a) => a.id !== id);
    const removed = appointments.length < before;
    if (removed) persist();
    return removed;
  }

  // Retorno de Objetos — interface pública do closure
  return { getAll, getById, add, updateStatus, remove };
};

// Instância única (singleton via closure)
const store = createAppointmentStore();

// ── Processamento Assíncrono com Promises ────────────────────────────────
const simulateDelay = <T>(value: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

// ── Funções Anônimas exportadas (arrow functions) ────────────────────────
export const fetchAppointments = (): Promise<Appointment[]> =>
  simulateDelay(store.getAll());

export const saveAppointment = (appointment: Appointment): Promise<Appointment> =>
  simulateDelay(appointment, 600).then((a) => {
    store.add(a);
    return a;
  });

export const changeStatus = (id: string, status: AppointmentStatus): Promise<boolean> =>
  simulateDelay(store.updateStatus(id, status), 300);

export const deleteAppointment = (id: string): Promise<boolean> =>
  simulateDelay(store.remove(id), 300);

// ── Funções Anônimas e Dinâmicas — validação dinâmica de campos ──────────
type FieldValidator = (value: string) => string | null;

const validators: Record<string, FieldValidator> = {
  patientName: (v) => (v.trim().length < 3 ? "Nome deve ter ao menos 3 caracteres." : null),
  patientEmail: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "E-mail inválido."),
  patientPhone: (v) => (v.replace(/\D/g, "").length >= 10 ? null : "Telefone inválido."),
  date: (v) => {
    if (!v) return "Data é obrigatória.";
    const selected = new Date(v + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today ? null : "A data não pode ser no passado.";
  },
  time: (v) => (v ? null : "Horário é obrigatório."),
  doctorId: (v) => (v ? null : "Selecione um médico."),
};

export const validateField = (field: string, value: string): string | null => {
  const fn = validators[field];
  return fn ? fn(value) : null;
};
