import { CalendarDay, DateRange } from './date-range-picker.models';

const MONTHS_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const formatDate = (date: Date | null | string): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

export const parseDate = (value: string | null): Date | null => {
  if (!value) return null;
  
  const parts = value.split('/');
  if (parts.length !== 3) return null;
  
  const [day, month, year] = parts.map(Number);
  const date = new Date(year, month - 1, day);
  
  return isNaN(date.getTime()) ? null : date;
};

export const toInputDateFormat = (date: Date | null): string => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const fromInputDateFormat = (value: string | null): Date | null => {
  if (!value) return null;
  const date = new Date(value + 'T00:00:00');
  return isNaN(date.getTime()) ? null : date;
};

export const getMonthName = (month: number): string => MONTHS_ES[month] || '';

export const getDayName = (day: number): string => DAYS_ES[day] || '';

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
};

export const isDateDisabled = (
  date: Date,
  minDate: Date | undefined,
  maxDate: Date | undefined,
  disabledDates: Date[] = []
): boolean => {
  const time = date.getTime();
  
  if (minDate && time < minDate.getTime()) return true;
  if (maxDate && time > maxDate.getTime()) return true;
  
  return disabledDates.some((d) => isSameDay(d, date));
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const generateCalendarDays = (
  year: number,
  month: number,
  range: DateRange,
  minDate?: Date,
  maxDate?: Date,
  disabledDates: Date[] = []
): CalendarDay[] => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  
  const days: CalendarDay[] = [];
  
  // Días del mes anterior
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const date = new Date(year, month - 1, dayNum);
    days.push(createCalendarDay(date, false));
  }
  
  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push(createCalendarDay(date, true));
  }
  
  // Días del siguiente mes para completar la semana
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    days.push(createCalendarDay(date, false));
  }
  
  function createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const isDisabled = isDateDisabled(date, minDate, maxDate, disabledDates);
    
    return {
      date,
      day: date.getDate(),
      isCurrentMonth,
      isToday: isToday(date),
      isDisabled,
      isSelected: isSameDay(date, range.start) || isSameDay(date, range.end),
      isInRange: isDateInRange(date, range.start, range.end),
      isRangeStart: isSameDay(date, range.start),
      isRangeEnd: isSameDay(date, range.end),
      isSameDay: isSameDay(range.start, range.end),
    };
  }
  
  return days;
};

export const createDateRangeFromStrings = (
  start: string | null,
  end: string | null
): DateRange => {
  return {
    start: start ? fromInputDateFormat(start) : null,
    end: end ? fromInputDateFormat(end) : null,
  };
};
