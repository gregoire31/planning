import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReservationService } from 'src/app/services/reservation.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCardModule
  ],
  providers:[ReservationService],
  exports:[CalendarComponent]
})
export class CalendarModule { }
