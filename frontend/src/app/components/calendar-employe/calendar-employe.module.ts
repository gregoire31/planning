import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReservationService } from 'src/app/services/reservation.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CalendarEmployeComponent } from './calendar-employe.component';
import { CalendarService } from 'src/app/services/calendar.service';
@NgModule({
  declarations: [CalendarEmployeComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCardModule
  ],
  providers:[ReservationService, CalendarService],
  exports:[CalendarEmployeComponent]
})
export class CalendarEmployeModule { }
