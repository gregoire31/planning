import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './components/login/login.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ErrorInterceptor } from 'src/_helpers/error.interceptor';
import { AuthInterceptorService } from 'src/_helpers/auth-interceptor.service';
import { PlanningModule } from './components/planning/planning.module';
import { MenuModule } from './components/menu/menu.module';
import { AdministrationModule } from './components/administration/administration.module';
import {MatSelectModule} from '@angular/material/select'
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    PlanningModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MenuModule,
    AdministrationModule,MatSelectModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
