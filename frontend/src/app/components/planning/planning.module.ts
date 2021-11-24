import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningComponent } from './planning.component';
import { MassageService } from 'src/app/services/massage.service';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CalendarModule } from '../calendar/calendar.module';
import { SocketService } from 'src/app/services/socket.service';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmationReservationDialogComponent } from 'src/app/dialog-components/confirmation-reservation-dialog/confirmation-reservation-dialog.component';

@NgModule({
  declarations: [PlanningComponent, ConfirmationReservationDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    CalendarModule,
    MatDialogModule
  ],
  providers:[MassageService, SocketService]
})
export class PlanningModule { }
