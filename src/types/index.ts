export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  position: string;
  department: Department;
  experienceLevel: 'Iniciante' | 'Experiente' | 'Mentor';
  status: 'Ativo' | 'Inativo' | 'Afastado';
  experiencePeriod?: { start: Date; end: Date };
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  level: number; // 1-Diretor, 2-Coordenador, 3-Gerente, 4-Analista, etc.
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  actions: string[]; // ['create', 'read', 'update', 'delete']
}

export interface Department {
  id: string;
  name: string;
  color: string;
  parentId?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Schedule {
  id: string;
  name: string;
  department: Department;
  period: {
    start: Date;
    end: Date;
  };
  type: 'semanal' | 'mensal';
  rotationType: 'manual' | 'automatica';
  status: 'Rascunho' | 'Ativa' | 'Finalizada';
  template?: ScheduleTemplate;
  configuration: Record<string, any>;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleTemplate {
  id: string;
  name: string;
  department: Department;
  configuration: Record<string, any>;
  isDefault: boolean;
  createdBy: User;
  createdAt: Date;
}

export interface Shift {
  id: string;
  schedule: Schedule;
  user: User;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  type: 'Individual' | 'Dupla' | 'Equipe';
  status: 'Provisório' | 'Confirmado' | 'Cancelado';
  location?: Location;
  notes?: string;
  isMultiDay?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Mentorship {
  id: string;
  mentor: User;
  mentee: User;
  startDate: Date;
  endDate: Date;
  status: 'Ativo' | 'Finalizado' | 'Suspenso';
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShiftExchange {
  id: string;
  requester: User;
  targetUser: User;
  originalShift: Shift;
  targetShift: Shift;
  reason: string;
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
  approvedBy?: User;
  approvalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Absence {
  id: string;
  user: User;
  type: 'Férias' | 'Licença Médica' | 'Falta Justificada' | 'Licença Maternidade' | 'Outros';
  startDate: Date;
  endDate: Date;
  reason?: string;
  isApproved: boolean;
  approvedBy?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  department: Department;
  address: string;
  timezone: string;
  isActive: boolean;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  department: Department;
  type: 'shift' | 'absence' | 'mentorship';
  data: Shift | Absence | Mentorship;
}

export interface CalendarShiftEvent {
  shift: Shift;
  startDay: number;
  endDay: number;
  week: number;
  position: number;
  width: number;
}
