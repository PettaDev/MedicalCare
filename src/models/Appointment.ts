// Tipos Primitivos 
export type AppointmentStatus = "pendente" | "confirmado" | "cancelado";
export type Specialty =
  | "Clínica Geral"
  | "Cardiologia"
  | "Dermatologia"
  | "Ortopedia"
  | "Neurologia"
  | "Pediatria"
  | "Ginecologia"
  | "Oftalmologia";

// Classes + Construtores + Protótipos 
export class Person {
  name: string;
  email: string;
  phone: string;

  constructor(name: string, email: string, phone: string) {
    this.name = name;
    this.email = email;
    this.phone = phone;
  }

  getContact(): string {
    return `${this.email} | ${this.phone}`;
  }
}

// Herança
export class Doctor extends Person {
  specialty: Specialty;
  crm: string;

  constructor(name: string, email: string, phone: string, specialty: Specialty, crm: string) {
    super(name, email, phone); // Herança de Construtores
    this.specialty = specialty;
    this.crm = crm;
  }

  getLabel(): string {
    return `Dr(a). ${this.name} — ${this.specialty}`;
  }
}

// Tipos de Referência + Instanciando Tipos Próprios
export class Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctor: Doctor;
  date: string;
  time: string;
  notes: string;
  status: AppointmentStatus;
  createdAt: Date;

  constructor(
    patientName: string,
    patientEmail: string,
    patientPhone: string,
    doctor: Doctor,
    date: string,
    time: string,
    notes: string
  ) {
    // Tipos Primitivos
    this.id = `AGD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.patientName = patientName;
    this.patientEmail = patientEmail;
    this.patientPhone = patientPhone;
    this.doctor = doctor;
    this.date = date;
    this.time = time;
    this.notes = notes;
    this.status = "pendente";
    this.createdAt = new Date();
  }

  // Método herdado de Object.prototype (toString override)
  toString(): string {
    return `[${this.id}] ${this.patientName} com ${this.doctor.getLabel()} em ${this.date} às ${this.time}`;
  }

  getStatusLabel(): string {
    const labels: Record<AppointmentStatus, string> = {
      pendente: "Pendente",
      confirmado: "Confirmado",
      cancelado: "Cancelado",
    };
    return labels[this.status];
  }
}

// Retorno de Objetos (Forma Literal) ─
export const AVAILABLE_DOCTORS: Doctor[] = [
  new Doctor("Ana Lima", "ana.lima@medicalcare.com", "(11) 99001-0001", "Clínica Geral", "CRM-12345"),
  new Doctor("Carlos Souza", "carlos.souza@medicalcare.com", "(11) 99001-0002", "Cardiologia", "CRM-23456"),
  new Doctor("Fernanda Costa", "fernanda.costa@medicalcare.com", "(11) 99001-0003", "Dermatologia", "CRM-34567"),
  new Doctor("Roberto Alves", "roberto.alves@medicalcare.com", "(11) 99001-0004", "Ortopedia", "CRM-45678"),
  new Doctor("Juliana Mendes", "juliana.mendes@medicalcare.com", "(11) 99001-0005", "Neurologia", "CRM-56789"),
  new Doctor("Pedro Rocha", "pedro.rocha@medicalcare.com", "(11) 99001-0006", "Pediatria", "CRM-67890"),
  new Doctor("Camila Torres", "camila.torres@medicalcare.com", "(11) 99001-0007", "Ginecologia", "CRM-78901"),
  new Doctor("Lucas Ferreira", "lucas.ferreira@medicalcare.com", "(11) 99001-0008", "Oftalmologia", "CRM-89012"),
];

export const AVAILABLE_TIMES: string[] = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];
