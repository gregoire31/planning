import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { AdministrationComponent } from './administration.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
@NgModule({
  declarations: [AdministrationComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule
  ],
  providers:[AuthService]
})
export class AdministrationModule { }
