import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/Card';
import { Button } from '../UI/Button';
import { Badge } from '../UI/Badge';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Plus,
} from 'lucide-react';
import { shifts, departments } from '../../data/mockData';
import { 
  formatDate, 
  formatTime, 
  getDayOfWeek, 
  getMonthName, 
  isSameDay, 
  addDays,
  getDatesBetween,
  isDateInRange,
  getDayOfMonth
} from '../../lib/utils';
import { Shift, CalendarShiftEvent } from '../../types';

export function GoogleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startOfCalendar = new Date(startOfMonth);
  startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());
  const endOfCalendar = new Date(endOfMonth);
  endOfCalendar.setDate(endOfCalendar.getDate() + (6 - endOfCalendar.getDay()));

  const calendarDays = [];
  let day = new Date(startOfCalendar);
  while (day <= endOfCalendar) {
    calendarDays.push(new Date(day));
    day = addDays(day, 1);
  }

  // Organizar dias em semanas
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const filteredShifts = useMemo(() => {
    return shifts.filter(shift => {
      const matchesDepartment = selectedDepartments.length === 0 || 
                               selectedDepartments.includes(shift.schedule.department.id);
      const matchesMonth = shift.startDate <= endOfCalendar && shift.endDate >= startOfCalendar;
      return matchesDepartment && matchesMonth;
    });
  }, [selectedDepartments, startOfCalendar, endOfCalendar]);

  // Calcular posição dos eventos no calendário
  const calendarEvents = useMemo(() => {
    const events: CalendarShiftEvent[] = [];
    
    weeks.forEach((week, weekIndex) => {
      const weekShifts = filteredShifts.filter(shift => 
        week.some(day => isDateInRange(day, shift.startDate, shift.endDate))
      );

      // Organizar shifts por nível (para evitar sobreposição)
      const levels: Shift[][] = [];
      
      weekShifts.forEach(shift => {
        let levelIndex = 0;
        while (levelIndex < levels.length) {
          const hasConflict = levels[levelIndex].some(existingShift => {
            return !(shift.endDate < existingShift.startDate || shift.startDate > existingShift.endDate);
          });
          
          if (!hasConflict) {
            levels[levelIndex].push(shift);
            break;
          }
          levelIndex++;
        }
        
        if (levelIndex === levels.length) {
          levels.push([shift]);
        }
      });

      // Calcular posições
      levels.forEach((level, levelIndex) => {
        level.forEach(shift => {
          const startDay = Math.max(0, week.findIndex(day => day >= shift.startDate));
          const endDay = Math.min(6, week.findIndex(day => day >= shift.endDate));
          const actualEndDay = endDay === -1 ? 6 : endDay;
          
          if (startDay !== -1) {
            events.push({
              shift,
              startDay,
              endDay: actualEndDay,
              week: weekIndex,
              position: levelIndex,
              width: actualEndDay - startDay + 1,
            });
          }
        });
      });
    });

    return events;
  }, [weeks, filteredShifts]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Confirmado': return 'success';
      case 'Provisório': return 'warning';
      case 'Cancelado': return 'danger';
      default: return 'default';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const toggleDepartment = (departmentId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(departmentId)
        ? prev.filter(id => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendário de Plantões</h1>
          <p className="text-gray-600 mt-1">Gestão visual de escalas e plantões</p>
        </div>

        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Plantão
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtros */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Departamentos</h4>
                <div className="space-y-2">
                  {departments.map(dept => (
                    <label key={dept.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(dept.id)}
                        onChange={() => toggleDepartment(dept.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: dept.color }}
                        />
                        <span className="text-sm text-gray-700">{dept.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Legenda</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Confirmado</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">Provisório</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="danger">Cancelado</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendário */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {getMonthName(currentDate)} {currentDate.getFullYear()}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Hoje
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Cabeçalho dos dias da semana */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Semanas */}
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="relative border-b border-gray-200 last:border-b-0">
                    {/* Grid dos dias */}
                    <div className="grid grid-cols-7">
                      {week.map((day, dayIndex) => {
                        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                        const isToday = isSameDay(day, new Date());

                        return (
                          <div
                            key={dayIndex}
                            className={`min-h-[120px] p-2 border-r border-gray-200 last:border-r-0 ${
                              isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                            } ${isToday ? 'bg-blue-50' : ''}`}
                          >
                            <div className={`text-sm ${isToday ? 'font-bold text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                              {getDayOfMonth(day)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Eventos sobrepostos */}
                    <div className="absolute inset-0 pointer-events-none">
                      {calendarEvents
                        .filter(event => event.week === weekIndex)
                        .map((event, eventIndex) => (
                          <div
                            key={`${event.shift.id}-${eventIndex}`}
                            className="absolute pointer-events-auto"
                            style={{
                              left: `${(event.startDay / 7) * 100}%`,
                              width: `${(event.width / 7) * 100}%`,
                              top: `${30 + (event.position * 20)}px`,
                              height: '18px',
                              backgroundColor: event.shift.schedule.department.color,
                              borderRadius: '3px',
                              padding: '2px 6px',
                              margin: '1px',
                              zIndex: 10,
                            }}
                            title={`${event.shift.user.name} - ${formatTime(event.shift.startTime)}-${formatTime(event.shift.endTime)}`}
                          >
                            <div className="text-xs text-white font-medium truncate">
                              {event.shift.user.name.split(' ')[0]} {event.shift.isMultiDay ? '(Multi-dia)' : ''}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detalhes dos plantões */}
      <Card>
        <CardHeader>
          <CardTitle>Plantões em Destaque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredShifts
              .filter(shift => shift.isMultiDay)
              .slice(0, 4)
              .map(shift => (
                <div key={shift.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: shift.schedule.department.color }}
                        />
                        <span className="font-medium text-gray-900">{shift.user.name}</span>
                        <Badge variant={getStatusBadgeVariant(shift.status)} className="text-xs">
                          {shift.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {formatDate(shift.startDate)} - {formatDate(shift.endDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {shift.schedule.department.name}
                        </div>
                        {shift.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {shift.location.name}
                          </div>
                        )}
                      </div>

                      {shift.notes && (
                        <p className="text-sm text-gray-500 mt-2 italic">
                          "{shift.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
