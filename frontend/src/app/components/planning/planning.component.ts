import { Component, OnInit } from '@angular/core';
import { MassageService } from 'src/app/services/massage.service';
import { Massage } from 'src/app/models/massage.model';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmationReservationDialogComponent } from 'src/app/dialog-components/confirmation-reservation-dialog/confirmation-reservation-dialog.component';
import { Reservation } from 'src/app/models/reservation.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  public massages = <Massage[]>[]
  public massageSelected = <Massage>{}

  constructor(
    private massageService : MassageService,
    private dialog: MatDialog,
    private reservationService : ReservationService,
    private toastService : ToastrService
  ) { }

  ngOnInit(): void {

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

  bookMassage(reservation: Reservation){
    const confirmDialog = this.dialog.open(ConfirmationReservationDialogComponent, {
      data: {
        massage: this.massageSelected,
        reservation:reservation
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.reservationService.saveMassage(reservation).subscribe()
        this.toastService.success('Réservation enregistrée')
      }else{
        this.toastService.error('Veuillez sélectionner un massage')
      }
    });
  }

}
