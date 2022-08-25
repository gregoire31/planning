import { Component, OnInit } from '@angular/core';
import { PrestationService } from 'src/app/services/prestation.service';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmationReservationDialogComponent } from 'src/app/dialog-components/confirmation-reservation-dialog/confirmation-reservation-dialog.component';
import { ReservationSlotData } from 'src/app/models/reservation.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { ToastrService } from 'ngx-toastr';
import { Employe } from 'src/app/models/employe.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { Prestation } from 'src/app/models/prestation.model';
import { UserService } from 'src/app/services/user.service';
import { combineLatest } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  public prestations = <Prestation[]>[]
  public prestationSelected = <Prestation>{}
  public employes: Employe[] = []
  constructor(
    private prestationService : PrestationService,
    private dialog: MatDialog,
    private reservationService : ReservationService,
    private toastService : ToastrService,
    private administrationService : AdministrationService,
    private  userService : UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.administrationService.getEmployes().subscribe(employees => {
      this.employes = employees
    })
    this.prestationService.getAllPrestations().subscribe((prestations:Prestation[]) => {
      prestations.forEach(prestation => {
        prestation.image = `/assets/${prestation.nom}.png`
      });
      this.prestations = prestations
    })
  }

  selectPrestation(prestation: Prestation){
    this.prestationSelected = prestation
  }

  getEmployeesMatchWithPrestationSelected(): Employe[]{

    return this.employes.filter(employe => employe.listeDesPrestations.some(prestation => {
      if(prestation._id === this.prestationSelected._id) return prestation.acquis
      return false
    }))
  }

  bookPrestation(reservation: ReservationSlotData){
    const confirmDialog = this.dialog.open(ConfirmationReservationDialogComponent, {
      data: {
        prestation: this.prestationSelected,
        reservation:reservation,
        employeesAvailable : this.getEmployeesMatchWithPrestationSelected()
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result && result.close === true) {
        reservation.employeId = result.employee._id
        delete reservation.day
        delete reservation.slot
        this.reservationService.saveReservation(reservation).subscribe()
        // combineLatest(
        // this.administrationService.addReservationToEmploye({idEmploye : result.employee._id, idReservation : reservation.idReservation}),
        // this.userService.addReservationToUser({idReservation: reservation.idReservation, idUser : reservation.idUser}))
        // .subscribe(([employe,user]) => {
        //   this.authService.updateUser(user)
        // })
        combineLatest(
        this.reservationService.saveReservation(reservation),
        this.administrationService.addReservationToEmploye({idEmploye : result.employee._id, idReservation : reservation.idReservation}),
        this.userService.addReservationToUser({idReservation: reservation.idReservation, idUser : reservation.idUser}))
        .subscribe()
        this.toastService.success('Réservation enregistrée')
      }
    });
  }

  deleteProperties(object : any, properties:Array<string>){ //not working
    for (let key in object){
      if(properties.includes(key)){
        delete object.key
      }
    }
    return object
  }

}
