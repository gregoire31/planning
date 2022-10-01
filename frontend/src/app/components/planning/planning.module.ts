import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningComponent } from './planning.component';
import { PrestationService } from 'src/app/services/prestation.service';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CalendarModule } from '../calendar/calendar.module';
import { SocketService } from 'src/app/services/socket.service';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmationReservationDialogComponent } from 'src/app/dialog-components/confirmation-reservation-dialog/confirmation-reservation-dialog.component';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CalendarEmployeModule } from '../calendar-employe/calendar-employe.module';
@NgModule({
  declarations: [PlanningComponent, ConfirmationReservationDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    CalendarModule,
    CalendarEmployeModule,
    MatDialogModule,
    MatSelectModule,FormsModule,ReactiveFormsModule
  ],
  providers:[PrestationService, SocketService, UserService],
  entryComponents: [ConfirmationReservationDialogComponent]
})
export class PlanningModule { }
