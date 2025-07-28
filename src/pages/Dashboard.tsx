import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { 
  Users, 
  Calendar, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Building2
} from 'lucide-react';
import { users, shifts, schedules, departments, absences, mentorships } from '../data/mockData';
import { formatDate } from '../lib/utils';

export function Dashboard() {
  const activeUsers = users.filter(u => u.status === 'Ativo').length;
  const activeShifts = shifts.filter(s => s.status === 'Confirmado').length;
  const activeSchedules = schedules.filter(s => s.status === 'Ativa').length;
  const pendingAbsences = absences.filter(a => !a.isApproved).length;
  const activeMentorships = mentorships.filter(m => m.status === 'Ativo').length;

  const recentShifts = shifts
    .filter(s => s.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const departmentStats = departments.map(dept => ({
    department: dept,
    userCount: users.filter(u => u.department.id === dept.id && u.status === 'Ativo').length,
    shiftCount: shifts.filter(s => s.schedule.department.id === dept.id).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do sistema de gestão de escalas</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Escalas Ativas</p>
                <p className="text-3xl font-bold text-gray-900">{activeSchedules}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Plantões Confirmados</p>
                <p className="text-3xl font-bold text-gray-900">{activeShifts}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ausências Pendentes</p>
                <p className="text-3xl font-bold text-gray-900">{pendingAbsences}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Plantões */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Próximos Plantões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentShifts.map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{shift.user.name}</p>
                    <p className="text-sm text-gray-600">
                      {shift.schedule.department.name} • {formatDate(shift.date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {shift.startTime} - {shift.endTime}
                    </p>
                  </div>
                  <Badge
                    variant={
                      shift.status === 'Confirmado' ? 'success' :
                      shift.status === 'Provisório' ? 'warning' : 'danger'
                    }
                  >
                    {shift.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas por Departamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Departamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentStats.map((stat) => (
                <div key={stat.department.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stat.department.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{stat.department.name}</p>
                      <p className="text-sm text-gray-600">{stat.department.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{stat.userCount} usuários</p>
                    <p className="text-sm text-gray-500">{stat.shiftCount} plantões</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mentorias Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{activeMentorships}</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  Acompanhamento em andamento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departamentos</p>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {departments.filter(d => d.isActive).length} ativos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Plantões</p>
                <p className="text-2xl font-bold text-gray-900">{shifts.length}</p>
                <p className="text-sm text-blue-600 mt-1">
                  Este mês
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
