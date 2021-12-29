import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { AdministrationComponent } from './administration.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { AdministrationService } from 'src/app/services/administration.service';
import { MatDialogModule } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScheduleDialogComponent } from 'src/app/dialog-components/schedule-dialog/schedule-dialog.component';
import { PrestationDialogComponent } from 'src/app/dialog-components/prestation-dialog/prestation-dialog.component';
import {MatInputModule} from '@angular/material/input';
@NgModule({
  declarations: [AdministrationComponent,PrestationDialogComponent, ScheduleDialogComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule
  ],
  providers:[AdministrationService]
})
export class AdministrationModule { }
