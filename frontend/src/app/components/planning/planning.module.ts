import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningComponent } from './planning.component';
import { MassageService } from 'src/app/services/massage.service';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [PlanningComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  providers:[MassageService]
})
export class PlanningModule { }
