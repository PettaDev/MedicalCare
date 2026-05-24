# MedicalCare — Documentação do Projeto

## Domínio de Negócio

**MedicalCare** é um sistema de agendamento médico que conecta pacientes e recepcionistas de uma clínica. Pacientes agendam consultas online escolhendo médico, especialidade, data e horário. A recepcionista gerencia a agenda: confirma, cancela ou remove agendamentos e pode criar novos diretamente. O ciclo de vida de um agendamento segue o fluxo `Pendente → Confirmado → Cancelado`, com persistência local via `localStorage`.

---

## Entidades de Negócio

### Person (Pessoa)

Base da hierarquia — representa qualquer pessoa no sistema.

| Atributo | Tipo   | Descrição        |
| -------- | ------ | ---------------- |
| `name`   | string | Nome completo    |
| `email`  | string | E-mail de contato |
| `phone`  | string | Telefone         |

---

### Doctor (Médico) — herda de Person

Representa o profissional de saúde disponível para atendimento.

| Atributo    | Tipo      | Descrição           |
| ----------- | --------- | ------------------- |
| `specialty` | Specialty | Especialidade médica |
| `crm`       | string    | Registro profissional |

> Especialidades disponíveis: Clínica Geral, Cardiologia, Dermatologia, Ortopedia, Neurologia, Pediatria, Ginecologia, Oftalmologia.

---

### Appointment (Agendamento)

Entidade central do sistema — representa uma consulta marcada.

| Atributo                        | Tipo                                     | Descrição                              |
| ------------------------------- | ---------------------------------------- | -------------------------------------- |
| `id`                            | string                                   | Código único gerado automaticamente    |
| `patientName`                   | string                                   | Nome completo do paciente              |
| `patientEmail`                  | string                                   | E-mail do paciente                     |
| `patientPhone`                  | string                                   | Telefone do paciente                   |
| `doctor`                        | Doctor                                   | Médico associado à consulta (relação)  |
| `date`                          | string                                   | Data da consulta (formato YYYY-MM-DD)  |
| `time`                          | string                                   | Horário da consulta (formato HH:MM)    |
| `notes`                         | string                                   | Observações opcionais do paciente      |
| `status`                        | `pendente` \| `confirmado` \| `cancelado` | Ciclo de vida do agendamento           |
| `createdAt`                     | Date                                     | Data e hora de criação do registro     |

#### Ciclo de vida do status

```
Pendente ──► Confirmado
    │              │
    └──────────────┴──► Cancelado ──► Reativar (Pendente)
```

---

## Conceitos Aplicados

### Single Page Application (SPA)
Toda a navegação ocorre sem recarregar a página. O componente `App.tsx` controla a página ativa via `useState` e renderiza condicionalmente os componentes `Home`, `ClientScheduling` ou `ReceptionistScheduling`.

### JSX — JavaScript XML
Todos os componentes utilizam JSX para descrever a interface. O React transforma o JSX em chamadas ao DOM virtual (`React.createElement`), que por sua vez atualiza o DOM real de forma eficiente.

### Componentes e Ciclo de Vida
| Hook | Onde | Finalidade |
|---|---|---|
| `useState` | Todos os componentes | Gerencia estado local (formulário, página ativa, lista de agendamentos) |
| `useEffect` | `ReceptionistScheduling` | Carrega os agendamentos ao montar o componente |
| `useCallback` | `ReceptionistScheduling` | Memoiza os handlers para evitar recriações desnecessárias |

### Funções
| Tipo | Exemplo |
|---|---|
| **Declarada** | `function navigate()`, `function getAll()`, `function validateForm()` |
| **Anônima (arrow)** | `handleChange`, `handleSubmit`, `handleDelete`, `simulateDelay` |
| **Autoinvocada (IIFE)** | Inicialização do store — carrega localStorage ou seed |
| **Retorno de objeto** | `createAppointmentStore()` retorna a interface pública do closure |
| **Dinâmica** | Objeto `validators` — cada chave possui uma arrow function diferente |

### Closures
A função `createAppointmentStore()` em `appointmentService.ts` encapsula o array `appointments` em escopo privado. As funções internas (`getAll`, `add`, `updateStatus`, `remove`) formam closures que acessam e modificam esse estado sem expô-lo diretamente.

### Módulos
`appointmentService.ts` é um módulo isolado que exporta apenas as funções públicas necessárias (`fetchAppointments`, `saveAppointment`, `changeStatus`, `deleteAppointment`, `validateField`). Os componentes importam apenas o que precisam.

### Tipos Primitivos e de Referência
- **Primitivos:** `string` (nome, e-mail, status), `number` (índices), `boolean` (flags de loading/success)
- **Referência:** Instâncias de `Appointment` e `Doctor`, arrays `Appointment[]`, objetos de configuração literais como `validators` e `labels`

### Classes, Construtores e Protótipos
```
Person
  └── Doctor (herança via extends + super())
Appointment (instância própria)
```
Métodos como `getLabel()`, `getStatusLabel()` e `toString()` ficam no prototype das classes, compartilhados entre todas as instâncias.

### Herança
`Doctor extends Person` — reutiliza `name`, `email`, `phone` e o método `getContact()` da classe pai via herança de protótipos. O construtor de `Doctor` chama `super()` para inicializar os atributos herdados.

### Processamento Assíncrono — Promises e Callbacks
Todas as operações de dados simulam latência de rede com `Promise` + `setTimeout`. O fluxo completo de `then / catch / finally` é utilizado em `handleSubmit` no componente de agendamento do cliente. `useEffect` utiliza callback assíncrono (`async/await`) para carregar os dados iniciais.

### LocalStorage (Persistência)
O módulo `appointmentService.ts` serializa os agendamentos em JSON ao realizar qualquer mutação (`add`, `updateStatus`, `remove`) e os desserializa na inicialização, reconstruindo as instâncias de classe para preservar os métodos do prototype.
