import { Component, OnInit } from '@angular/core';
import { MassageService } from 'src/app/services/massage.service';
import { Massage } from 'src/app/models/massage.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
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
  public headerSchedule: any[] = []
  public headerScheduleString: string[] = []
  public rowsSchedule: any[] = []
  public reservations : Reservation[] = []

  constructor(
    private massageService : MassageService,
    private reservationService : ReservationService,
    private authService : AuthService,
    private toastService : ToastrService) { }

  ngOnInit(): void {

    this.reservationService.getAllReservations().subscribe(reservations => {
      this.reservations = reservations
      console.log(this.reservations)
    })
    moment.locale('fr');
    for(let i = 0; i < 6; i++){
      const actualMomentDay = moment(moment().startOf('week')).add(i,'day').format('L')
      const actualDay= moment(moment().startOf('week')).add(i,'day').format('LLLL').split(" ")
      const dayConcat = `${actualDay[0]} ${actualDay[1]}`
      this.headerSchedule.push({label:dayConcat , value:actualMomentDay})
    }
    for(let i = 0; i < 9; i++){
      let hour = i+9
      let pouet = {}
      let bet:any = {}
      this.headerSchedule.forEach(header => {
        bet[header.label]=hour
        pouet = {...bet}
      });
      this.rowsSchedule.push(pouet)
    }
    this.headerScheduleString = this.headerSchedule.map(header => header.label)

    // const actualTuesday= moment(actualMonday).add(1,'day')
    // const tuesdayArray = moment(actualTuesday).format('LLLL').split(" ")
    // const tuesdayConcat = `${tuesdayArray[0]} ${tuesdayArray[1]}`

    // this.headerSchedule.push({label:mondayConcat, value:actualMonday}, {label: tuesdayConcat, value:actualTuesday})
    // this.rowsSchedule.push({label:mondayConcat, value:actualMonday}, {label: tuesdayConcat, value:actualTuesday})
    // this.user = this.authService.getUser()
    this.massageService.getAllMassages().subscribe((massages:Massage[]) => {
      massages.forEach(massage => {
        massage.image = `/assets/${massage.nom}.png`
      });
      this.massages = massages
    })
  }
  saveReservation(element:any){

    let reservationToSave : Reservation = {
      creneau:element[0],
      date: element[1],
      idMassage :this.massageSelected._id,
      iduser:this.authService.getUser().value._id
    }
    if(!this.checkifOnePropertyisUndefined(reservationToSave)){
       this.reservationService.saveMassage(reservationToSave).subscribe(data=> {
        this.reservations.push(data)
        this.toastService.success('Réservation enregistrée')
       })
    }else{
      this.toastService.error('Veuillez sélectionner un massage')
    }
  }
  selectMassage(massage: Massage){
    this.massageSelected = massage
  }

  checkifOnePropertyisUndefined(objectToCheck:any) : boolean{
    let hasPropertyUndefined:boolean = false
    const objectKeys = Object.keys(objectToCheck)
    objectKeys.forEach(key => {
      if(objectToCheck[key] === undefined){
        hasPropertyUndefined = true
      }
    });
    return hasPropertyUndefined
  }

  checkIfcreneauIsReserved(creneau:any): boolean{
    let isReserved : boolean = false
    this.reservations.forEach(reservation => {
      if(reservation.creneau === creneau[0] && reservation.date === creneau[1]){
        isReserved = true
      }
    });
    return isReserved
  }

}
