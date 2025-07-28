import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Calendar,
  Users,
  Building2,
  Clock,
  UserCheck,
  RefreshCw,
  Calendar as CalendarIcon,
  BarChart3,
  Settings,
  Home,
  MapPin,
} from 'lucide-react';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Calendário', href: '/', icon: Calendar, permission: null },
  { name: 'Usuários', href: '/users', icon: Users, permission: { resource: 'users', action: 'read' } },
  { name: 'Departamentos', href: '/departments', icon: Building2, permission: { resource: 'departments', action: 'read' } },
  { name: 'Escalas', href: '/schedules', icon: Home, permission: { resource: 'schedules', action: 'read' } },
  { name: 'Plantões', href: '/shifts', icon: Clock, permission: { resource: 'shifts', action: 'read' } },
  { name: 'Mentorias', href: '/mentorships', icon: UserCheck, permission: { resource: 'shifts', action: 'read' } },
  { name: 'Trocas', href: '/exchanges', icon: RefreshCw, permission: { resource: 'exchanges', action: 'read' } },
  { name: 'Ausências', href: '/absences', icon: CalendarIcon, permission: { resource: 'absences', action: 'read' } },
  { name: 'Localizações', href: '/locations', icon: MapPin, permission: { resource: 'departments', action: 'read' } },
  { name: 'Relatórios', href: '/reports', icon: BarChart3, permission: { resource: 'reports', action: 'read' } },
  { name: 'Configurações', href: '/settings', icon: Settings, permission: { resource: 'users', action: 'update' } },
];

export function Sidebar() {
  const { hasPermission } = useSupabaseAuth();

  const filteredNavigation = navigation.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission.resource, item.permission.action);
  });

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold text-white">
          Gestão de Escalas
        </h1>
      </div>
      
      <nav className="flex flex-1 flex-col p-4">
        <ul className="flex flex-1 flex-col gap-y-1">
          {filteredNavigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  )
                }
              >
                <item.icon className="h-6 w-6 shrink-0" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
