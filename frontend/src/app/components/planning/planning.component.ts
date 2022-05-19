import { Component, OnInit } from '@angular/core';
import { MassageService } from 'src/app/services/massage.service';
import { Massage } from 'src/app/models/massage.model';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmationReservationDialogComponent } from 'src/app/dialog-components/confirmation-reservation-dialog/confirmation-reservation-dialog.component';
import { ReservationSlotData } from 'src/app/models/reservation.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { ToastrService } from 'ngx-toastr';
import { Employe } from 'src/app/models/employe.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { combineLatest } from 'rxjs/operators';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  public massages = <Massage[]>[]
  public massageSelected = <Massage>{}
  public employes: Employe[] = []
  constructor(
    private massageService : MassageService,
    private dialog: MatDialog,
    private reservationService : ReservationService,
    private toastService : ToastrService,
    private administrationService : AdministrationService
  ) { }

  ngOnInit(): void {
    this.administrationService.getEmployes().subscribe(employees => {
      this.employes = employees
    })
    this.massageService.getAllMassages().subscribe((massages:Massage[]) => {
      massages.forEach(massage => {
        massage.image = `/assets/${massage.nom}.png`
      });
      this.massages = massages
    })
  }

  selectMassage(massage: Massage){
    this.massageSelected = massage
  }

  getEmployeesMatchWithMassageSelected(): Employe[]{

    return this.employes.filter(employe => employe.listeDesPrestations.some(prestation => {
      if(prestation._id === this.massageSelected._id) return prestation.acquis
      return false
    }))
  }

  bookMassage(reservation: ReservationSlotData){
    const confirmDialog = this.dialog.open(ConfirmationReservationDialogComponent, {
      data: {
        massage: this.massageSelected,
        reservation:reservation,
        employeesAvailable : this.getEmployeesMatchWithMassageSelected()
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result && result.close === true) {
        reservation.employeId = result.employee._id
        delete reservation.day
        delete reservation.slot
        // combineLatest(this.reservationService.saveMassage(reservation), this.administrationService.addPrestationToEmploye({employeId : result.employee._id, prestationId: }))
        this.reservationService.saveMassage(reservation).subscribe()
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
