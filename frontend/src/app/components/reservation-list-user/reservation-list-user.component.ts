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
import { Reservation, Reservation1 } from 'src/app/models/reservation.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/dialog-components/confirm-dialog/confirm-dialog.component';

export interface ReservationInterface {
  date: Date;
  day: string;
  slot: number | string;
  employeName: string;
  prestationName: string;
  prestationPrice: number;
  prestationDuration: number;
  reservationId? : string
}

@Component({
  selector: 'app-reservation-list-user',
  templateUrl: './reservation-list-user.component.html',
  styleUrls: ['./reservation-list-user.component.scss'],
})
export class ReservationListUserComponent implements OnInit {
  public employees: Employe[] = [];
  public prestations: Prestation[] = [];
  public user = <User>{};
  public reservations: Reservation1[] = [];
  public displayPassedReservation : ReservationInterface[] = []
  public displayFutureReservation : ReservationInterface[] = []
  displayedPassedColumns: string[] = ['day', 'slot', 'employeName', 'prestationName','prestationPrice','prestationDuration'];
  displayedFutureColumns: string[] = ['day', 'slot', 'employeName', 'prestationName','prestationPrice','prestationDuration','action'];
  public actualDay = new Date()
  constructor(
    private administrationService: AdministrationService,
    private prestationService: PrestationService,
    private authService: AuthService,
    private userService: UserService,
    private reservationService: ReservationService,
    public dialog : MatDialog
  ) {}

  ngOnInit(): void {

    combineLatest(
      this.administrationService.getEmployes(),
      this.prestationService.getAllPrestations(),
      this.authService.getUser()
    ).subscribe(([employees, prestations,currentUser]) => {
      if (Object.keys(currentUser).length !== 0) {
        this.reservationService
          .getReservations1OfUser(currentUser._id)
          .subscribe((reservations) => {


            reservations.map(reservation => {
              let durationReservation = prestations.filter(prestation => prestation._id === reservation.id_prestation)[0].duree

              let slotLitteral = (this.getLiterralHourOfSlots(reservation.slot,reservation.slot+durationReservation))
              let prestationSelected = prestations.filter(prestation => prestation._id === reservation.id_prestation)[0]
              let splittedDay = reservation.day.split('/')

              const dateOfTheReservation = new Date(Number(splittedDay[2]), Number(splittedDay[1])-1, Number(splittedDay[0]), Number(reservation.slot.toString().split('.')[0]) );
              const reservationAlreadyPassed= (dateOfTheReservation.getTime() < this.actualDay.getTime())


              if(reservationAlreadyPassed){
                this.displayPassedReservation.push({
                  date: reservation.date,
                  day : reservation.day,
                  slot: slotLitteral,
                  employeName : employees.filter(employe => employe._id === reservation.id_employe)[0].nom,
                  prestationName : prestationSelected.nom,
                  prestationPrice: prestationSelected.prix,
                  prestationDuration: durationReservation,
                })
              }else{
                this.displayFutureReservation.push({
                  date: reservation.date,
                  day : reservation.day,
                  slot: slotLitteral,
                  employeName : employees.filter(employe => employe._id === reservation.id_employe)[0].nom,
                  prestationName : prestationSelected.nom,
                  prestationPrice: prestationSelected.prix,
                  prestationDuration: durationReservation,
                  reservationId : reservation._id
                })
              }
            })
          });
      }

    });

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

  getLiterralHourOfSlots(firstSlot:number| string,secondSlot:number| string){
    let slots1 = Number(firstSlot.toString().split('.')[1]);
    let slots2 = Number(secondSlot.toString().split('.')[1]);
    if(!isNaN(slots1)){
      let slotsNumeric =Number( `0.${slots1}`) * 60
      firstSlot = `${firstSlot.toString().split('.')[0]}h${slotsNumeric}`
    }else{
      firstSlot = `${firstSlot}h`
    }
    if(!isNaN(slots2)){
      let slotsNumeric =Number( `0.${slots2}`) * 60
      secondSlot = `${secondSlot.toString().split('.')[0]}h${slotsNumeric}`
    }else{
      secondSlot = `${secondSlot}h`
    }
    return `${firstSlot} - ${secondSlot}`
  }


  removeReservation(reservation:ReservationInterface){
    const messages = [`Êtes vous sûr de vouloir supprimer cette réservation :`, `${reservation.day}, de ${reservation.slot} avec ${reservation.employeName}?`];

    const dialogData = new ConfirmDialogModel("Validation suppression réservation", messages);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(!dialogResult) return

      this.reservationService.deleteReservation(reservation.reservationId || '').subscribe(response => {
        if(response && response.statusCode === 200){
          this.displayFutureReservation = this.displayFutureReservation.filter(futureReservation => futureReservation.reservationId !== response.id)
        }
      })
    });

  }

  private orderByDate(reservations: Reservation1[]) {
    return reservations.sort(function compare(a: any, b: any) {
      let splittedDayA = a.day.split('/')
      const dateOfTheReservationA = new Date(Number(splittedDayA[2]), Number(splittedDayA[1])-1, Number(splittedDayA[0]), Number(a.slot.toString().split('.')[0]));
      let splittedDayB = b.day.split('/')
      const dateOfTheReservationB = new Date(Number(splittedDayB[2]), Number(splittedDayB[1])-1, Number(splittedDayB[0]), Number(b.slot.toString().split('.')[0]));
      var dateA = dateOfTheReservationA.getTime();
      var dateB = dateOfTheReservationB.getTime();
      return dateA - dateB;
    });
  }

}
