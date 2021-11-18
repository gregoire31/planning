import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningComponent } from './planning.component';
import { MassageService } from 'src/app/services/massage.service';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { ReservationService } from 'src/app/services/reservation.service';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [PlanningComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule
  ],
  providers:[MassageService, ReservationService]
})
export class PlanningModule { }
