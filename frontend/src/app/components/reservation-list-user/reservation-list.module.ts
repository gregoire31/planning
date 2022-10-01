import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { ReservationService } from 'src/app/services/reservation.service';
import { ReservationListUserComponent } from './reservation-list-user.component';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from 'src/app/dialog-components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [ReservationListUserComponent,ConfirmDialogComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  providers:[ReservationService],
  entryComponents:[ConfirmDialogComponent],
  exports:[ReservationListUserComponent]
})
export class reservationListModule { }
