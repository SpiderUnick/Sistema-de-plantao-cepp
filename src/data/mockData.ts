import { faker } from '@faker-js/faker';
import { User, Role, Department, Schedule, Shift, Mentorship, Absence, Location, Permission } from '../types';

// Configurar faker para português
faker.locale = 'pt_BR';

// Permissões do sistema
export const permissions: Permission[] = [
  { id: '1', name: 'Gerenciar Usuários', resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
  { id: '2', name: 'Gerenciar Departamentos', resource: 'departments', actions: ['create', 'read', 'update', 'delete'] },
  { id: '3', name: 'Gerenciar Escalas', resource: 'schedules', actions: ['create', 'read', 'update', 'delete'] },
  { id: '4', name: 'Gerenciar Plantões', resource: 'shifts', actions: ['create', 'read', 'update', 'delete'] },
  { id: '5', name: 'Aprovar Trocas', resource: 'exchanges', actions: ['read', 'update'] },
  { id: '6', name: 'Visualizar Relatórios', resource: 'reports', actions: ['read'] },
  { id: '7', name: 'Gerenciar Ausências', resource: 'absences', actions: ['create', 'read', 'update', 'delete'] },
];

// Cargos e hierarquia
export const roles: Role[] = [
  {
    id: '1',
    name: 'Diretor',
    level: 1,
    permissions: permissions,
  },
  {
    id: '2',
    name: 'Coordenador',
    level: 2,
    permissions: permissions.filter(p => !['users'].includes(p.resource)),
  },
  {
    id: '3',
    name: 'Gerente',
    level: 3,
    permissions: permissions.filter(p => ['schedules', 'shifts', 'exchanges', 'reports', 'absences'].includes(p.resource)),
  },
  {
    id: '4',
    name: 'Analista',
    level: 4,
    permissions: permissions.filter(p => p.actions.includes('read')),
  },
  {
    id: '5',
    name: 'Funcionário',
    level: 5,
    permissions: permissions.filter(p => p.resource === 'shifts' && p.actions.includes('read')),
  },
];

// Departamentos
export const departments: Department[] = [
  {
    id: '1',
    name: 'Emergência',
    color: '#ef4444',
    description: 'Atendimento de emergência 24h',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Enfermaria',
    color: '#3b82f6',
    description: 'Cuidados gerais e internação',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'UTI',
    color: '#8b5cf6',
    description: 'Unidade de Terapia Intensiva',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Pediatria',
    color: '#06d6a0',
    description: 'Atendimento pediátrico especializado',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    name: 'Cirurgia',
    color: '#f59e0b',
    description: 'Centro cirúrgico e procedimentos',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
];

// Usuários (funcionários)
export const users: User[] = [
  {
    id: '1',
    name: 'Dr. Carlos Silva',
    email: 'carlos.silva@hospital.com',
    role: roles[0], // Diretor
    position: 'Diretor Médico',
    department: departments[0],
    experienceLevel: 'Mentor',
    status: 'Ativo',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Dra. Ana Costa',
    email: 'ana.costa@hospital.com',
    role: roles[1], // Coordenador
    position: 'Coordenadora de Enfermagem',
    department: departments[1],
    experienceLevel: 'Experiente',
    status: 'Ativo',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Sammy Santos',
    email: 'sammy.santos@hospital.com',
    role: roles[2], // Gerente
    position: 'Enfermeiro Especialista',
    department: departments[2],
    experienceLevel: 'Experiente',
    status: 'Ativo',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Dr. João Oliveira',
    email: 'joao.oliveira@hospital.com',
    role: roles[3],
    position: 'Médico Plantonista',
    department: departments[0],
    experienceLevel: 'Experiente',
    status: 'Ativo',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  // Adicionar mais usuários com faker
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `${i + 5}`,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: roles[Math.floor(Math.random() * roles.length)],
    position: faker.person.jobTitle(),
    department: departments[Math.floor(Math.random() * departments.length)],
    experienceLevel: ['Iniciante', 'Experiente', 'Mentor'][Math.floor(Math.random() * 3)] as any,
    status: ['Ativo', 'Inativo', 'Afastado'][Math.floor(Math.random() * 3)] as any,
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent(),
  })),
];

// Localizações
export const locations: Location[] = [
  {
    id: '1',
    name: 'Hospital Central - Ala Norte',
    department: departments[0],
    address: 'Rua Principal, 123 - Centro',
    timezone: 'America/Sao_Paulo',
    isActive: true,
    contactInfo: {
      phone: '(11) 9999-0001',
      email: 'emergencia@hospital.com',
    },
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Hospital Central - Ala Sul',
    department: departments[1],
    address: 'Rua Principal, 123 - Centro',
    timezone: 'America/Sao_Paulo',
    isActive: true,
    contactInfo: {
      phone: '(11) 9999-0002',
      email: 'enfermaria@hospital.com',
    },
    createdAt: new Date('2024-01-01'),
  },
];

// Escalas
export const schedules: Schedule[] = [
  {
    id: '1',
    name: 'Escala Emergência - Janeiro 2025',
    department: departments[0],
    period: {
      start: new Date('2025-01-01'),
      end: new Date('2025-01-31'),
    },
    type: 'mensal',
    rotationType: 'automatica',
    status: 'Ativa',
    configuration: {
      horasPorPlantao: 12,
      descansoMinimo: 24,
      maxPlantoesPorSemana: 4,
    },
    createdBy: users[0],
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '2',
    name: 'Escala UTI - Janeiro 2025',
    department: departments[2],
    period: {
      start: new Date('2025-01-01'),
      end: new Date('2025-01-31'),
    },
    type: 'semanal',
    rotationType: 'manual',
    status: 'Ativa',
    configuration: {
      horasPorPlantao: 6,
      descansoMinimo: 12,
      maxPlantoesPorSemana: 6,
    },
    createdBy: users[1],
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
];

// Plantões com eventos de múltiplos dias
export const shifts: Shift[] = [
  // Plantão do Sammy de 7 dias (13 a 19 de Janeiro)
  {
    id: 'sammy-week-shift',
    schedule: schedules[1],
    user: users[2], // Sammy Santos
    startDate: new Date('2025-01-13'),
    endDate: new Date('2025-01-19'),
    startTime: '07:00',
    endTime: '19:00',
    type: 'Individual',
    status: 'Confirmado',
    location: locations[1],
    notes: 'Cobertura especial - plantão estendido',
    isMultiDay: true,
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  // Dr. João - plantão de fim de semana
  {
    id: 'joao-weekend-shift',
    schedule: schedules[0],
    user: users[3], // Dr. João
    startDate: new Date('2025-01-11'),
    endDate: new Date('2025-01-12'),
    startTime: '18:00',
    endTime: '06:00',
    type: 'Individual',
    status: 'Confirmado',
    location: locations[0],
    notes: 'Plantão noturno - emergência',
    isMultiDay: true,
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18'),
  },
  // Outros plantões regulares
  ...Array.from({ length: 45 }, (_, i) => {
    const schedule = schedules[Math.floor(Math.random() * schedules.length)];
    const user = users.filter(u => u.department.id === schedule.department.id)[
      Math.floor(Math.random() * users.filter(u => u.department.id === schedule.department.id).length)
    ] || users[0];
    
    const startDate = new Date('2025-01-01');
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
    
    // 30% chance de ser um plantão de múltiplos dias
    const isMultiDay = Math.random() < 0.3;
    const endDate = new Date(startDate);
    if (isMultiDay) {
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 3) + 1); // 1-3 dias extras
    }
    
    return {
      id: `shift-${i + 3}`,
      schedule,
      user,
      startDate,
      endDate,
      startTime: ['06:00', '12:00', '18:00'][Math.floor(Math.random() * 3)],
      endTime: ['12:00', '18:00', '06:00'][Math.floor(Math.random() * 3)],
      type: ['Individual', 'Dupla', 'Equipe'][Math.floor(Math.random() * 3)] as any,
      status: ['Provisório', 'Confirmado', 'Cancelado'][Math.floor(Math.random() * 3)] as any,
      location: locations[Math.floor(Math.random() * locations.length)],
      notes: Math.random() > 0.7 ? faker.lorem.sentence() : undefined,
      isMultiDay,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent(),
    };
  }),
];

// Mentorias
export const mentorships: Mentorship[] = Array.from({ length: 10 }, (_, i) => {
  const mentor = users.filter(u => u.experienceLevel === 'Mentor')[
    Math.floor(Math.random() * users.filter(u => u.experienceLevel === 'Mentor').length)
  ] || users[0];
  
  const mentee = users.filter(u => u.experienceLevel === 'Iniciante' && u.id !== mentor.id)[
    Math.floor(Math.random() * users.filter(u => u.experienceLevel === 'Iniciante').length)
  ] || users[1];
  
  const startDate = faker.date.past({ years: 1 });
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 6);
  
  return {
    id: `${i + 1}`,
    mentor,
    mentee,
    startDate,
    endDate,
    status: ['Ativo', 'Finalizado', 'Suspenso'][Math.floor(Math.random() * 3)] as any,
    observations: Math.random() > 0.5 ? faker.lorem.paragraph() : undefined,
    createdAt: startDate,
    updatedAt: faker.date.recent(),
  };
});

// Ausências
export const absences: Absence[] = Array.from({ length: 15 }, (_, i) => {
  const user = users[Math.floor(Math.random() * users.length)];
  const startDate = faker.date.future({ years: 1 });
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 14) + 1);
  
  return {
    id: `${i + 1}`,
    user,
    type: ['Férias', 'Licença Médica', 'Falta Justificada', 'Licença Maternidade', 'Outros'][Math.floor(Math.random() * 5)] as any,
    startDate,
    endDate,
    reason: Math.random() > 0.3 ? faker.lorem.sentence() : undefined,
    isApproved: Math.random() > 0.2,
    approvedBy: Math.random() > 0.5 ? users[Math.floor(Math.random() * 3)] : undefined,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
});

export const currentUser = users[0]; // Para simulação, usuário logado é o diretor
