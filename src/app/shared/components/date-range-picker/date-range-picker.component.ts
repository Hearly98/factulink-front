import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  WritableSignal,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DropdownModule,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { DateRange, CalendarDay } from './date-range-picker.models';
import {
  formatDate,
  fromInputDateFormat,
  generateCalendarDays,
  getMonthName,
  toInputDateFormat,
} from './date-range-picker.utils';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    IconDirective,
  ],
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
})
export class DateRangePickerComponent implements OnInit {
  @Input() startDate: string | null = null;
  @Input() endDate: string | null = null;
  @Input() minDate?: string;
  @Input() maxDate?: string;
  @Input() disabledDates: string[] = [];
  @Input() placeholderStart = 'Desde';
  @Input() placeholderEnd = 'Hasta';
  @Input() label = 'Rango de Fechas';

  @Output() rangeChange = new EventEmitter<DateRange>();

  // Estado interno
  isOpen = signal(false);
  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());
  
  // Rangos - usando writableSignal para poder modificar
  start: WritableSignal<Date | null> = signal(null);
  end: WritableSignal<Date | null> = signal(null);
  
  // Referencia al contenedor
  container = viewChild.required<HTMLElement>('container');
  
  // Helpers
  readonly getMonthName = getMonthName;

  // Días de la semana
  weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

  ngOnInit(): void {
    this.loadInitialDates();
  }

  private loadInitialDates(): void {
    if (this.startDate || this.endDate) {
      this.start.set(fromInputDateFormat(this.startDate));
      this.end.set(fromInputDateFormat(this.endDate));
    }
  }

  get calendarDays(): CalendarDay[] {
    const minDateObj: Date | undefined = this.minDate ? fromInputDateFormat(this.minDate) ?? undefined : undefined;
    const maxDateObj: Date | undefined = this.maxDate ? fromInputDateFormat(this.maxDate) ?? undefined : undefined;
    const disabledDatesObj = this.disabledDates.map((d) => fromInputDateFormat(d)).filter((d): d is Date => d !== null);
    
    return generateCalendarDays(
      this.currentYear(),
      this.currentMonth(),
      { start: this.start(), end: this.end() },
      minDateObj,
      maxDateObj,
      disabledDatesObj
    );
  }

  get startInputValue(): string {
    return this.start() ? toInputDateFormat(this.start()!) : '';
  }

  get endInputValue(): string {
    return this.end() ? toInputDateFormat(this.end()!) : '';
  }

  get startDisplayValue(): string {
    return formatDate(this.start());
  }

  get endDisplayValue(): string {
    return formatDate(this.end());
  }

  get displayStart(): string {
    return this.startDisplayValue || this.placeholderStart;
  }

  get displayEnd(): string {
    return this.endDisplayValue || this.placeholderEnd;
  }

  onStartDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const date = fromInputDateFormat(value);
    
    if (date) {
      this.start.set(date);
      
      // Si la fecha de inicio es posterior a la de fin, limpiar fin
      if (this.end() && date > this.end()!) {
        this.end.set(null);
      }
      
      this.emitChange();
    } else {
      this.start.set(null);
      this.emitChange();
    }
  }

  onEndDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const date = fromInputDateFormat(value);
    
    if (date) {
      this.end.set(date);
      
      // Si la fecha de fin es anterior a la de inicio, limpiar inicio
      if (this.start() && date < this.start()!) {
        this.start.set(null);
      }
      
      this.emitChange();
    } else {
      this.end.set(null);
      this.emitChange();
    }
  }

  onDayClick(day: CalendarDay): void {
    if (day.isDisabled || !day.isCurrentMonth) return;

    const clickedDate = day.date;

    // Si no hay inicio o ya hay un rango completo, empezar nuevo rango
    if (!this.start() || (this.start() && this.end())) {
      this.start.set(clickedDate);
      this.end.set(null);
    } else {
      // Si clickedDate es anterior a start, reiniciar
      if (clickedDate < this.start()!) {
        this.start.set(clickedDate);
        this.end.set(null);
      } else {
        // Mismo día = rango de un día
        this.end.set(clickedDate);
        this.emitChange();
        this.close();
      }
    }
  }

  prevMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(this.currentYear() - 1);
    } else {
      this.currentMonth.set(this.currentMonth() - 1);
    }
  }

  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(this.currentYear() + 1);
    } else {
      this.currentMonth.set(this.currentMonth() + 1);
    }
  }

  goToToday(): void {
    const today = new Date();
    this.currentMonth.set(today.getMonth());
    this.currentYear.set(today.getFullYear());
  }

  clearRange(): void {
    this.start.set(null);
    this.end.set(null);
    this.emitChange();
    this.close();
  }

  applyRange(): void {
    this.emitChange();
    this.close();
  }

  private emitChange(): void {
    this.rangeChange.emit({
      start: this.start(),
      end: this.end(),
    });
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      // Si hay fechas seleccionadas, mostrar ese mes
      if (this.start()) {
        this.currentMonth.set(this.start()!.getMonth());
        this.currentYear.set(this.start()!.getFullYear());
      }
    }
  }

  open(): void {
    this.isOpen.set(true);
    if (this.start()) {
      this.currentMonth.set(this.start()!.getMonth());
      this.currentYear.set(this.start()!.getFullYear());
    }
  }

  close(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    try {
      const containerEl = this.container();
      if (!containerEl) {
        return;
      }
      if (containerEl.contains(event.target as Node)) {
        return;
      }
      this.close();
    } catch {
      // Ignorar errores si el elemento no está disponible
    }
  }

  // Prevenir cierre al hacer click en el dropdown
  onDropdownClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
