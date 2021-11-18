import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningComponent } from './planning.component';
import { MassageService } from 'src/app/services/massage.service';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { ReservationService } from 'src/app/services/reservation.service';

@NgModule({
  declarations: [PlanningComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule
  ],
  providers:[MassageService, ReservationService]
})
export class PlanningModule { }
