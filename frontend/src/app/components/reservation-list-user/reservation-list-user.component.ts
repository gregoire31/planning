import { Component, OnInit } from '@angular/core';
import { AdministrationService } from 'src/app/services/administration.service';
import { PrestationService } from 'src/app/services/prestation.service';
import { AuthService } from 'src/app/services/auth.service';
import { Employe } from 'src/app/models/employe.model';
import { combineLatest } from 'rxjs';
import { Prestation } from 'src/app/models/prestation.model';
import { UserService } from 'src/app/services/user.service';
import { map, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { Reservation } from 'src/app/models/reservation.model';

@Component({
  selector: 'app-reservation-list-user',
  templateUrl: './reservation-list-user.component.html',
  styleUrls: ['./reservation-list-user.component.scss']
})
export class ReservationListUserComponent implements OnInit {
  public employees : Employe[] = []
  public prestations : Prestation[] = []
  public user = <User>{}
  public reservations: Reservation[] = []
  constructor(
    private administrationService : AdministrationService,
    private prestationService : PrestationService,
    private authService :  AuthService,
    private userService : UserService,
    private reservationService : ReservationService) { }

  ngOnInit(): void {
    // this.authService.user.pipe(map(user => {
    //   console.log(user.reservationList)
      // combineLatest(this.administrationService.getEmployes(), this.prestationService.getAllPrestations(),this.authService.user).pipe(map(([employees,prestations,user]) => {
      //   this.employees = employees
      //   this.prestations = prestations
      //   this.user = user
      //   return user.reservationList
      // })).pipe(tap(reservationListUser => {

      // })).subscribe()
    // })).subscribe()
    // this.prestationService.getPrestations(this.authService.user.value.prestationSelected)


    }

}
