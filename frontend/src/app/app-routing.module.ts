import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PlanningComponent } from './components/planning/planning.component';
import { AuthGuard } from './guard/auth/auth.guard';
import { AdministrationComponent } from './components/administration/administration.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/signIn', pathMatch: 'full'},
  { path: 'signIn', component: LoginComponent},
  { path: 'planning', component: PlanningComponent, canActivate:[AuthGuard]},
  { path: 'administration', component: AdministrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
