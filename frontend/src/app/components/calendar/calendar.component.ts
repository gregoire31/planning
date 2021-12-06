import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReservationService } from 'src/app/services/reservation.service';
import { AuthService } from 'src/app/services/auth.service';
import { Reservation } from 'src/app/models/reservation.model';
import * as moment from 'moment';
import { Massage } from 'src/app/models/massage.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  @Input() massageSelected: Massage = <Massage>{}
  @Output() massageEvent = new EventEmitter<Reservation>();

  public headerSchedule: any[] = []
  public headerScheduleString: string[] = []
  public rowsSchedule: any[] = []
  public reservations : Reservation[] = []
  public incrementNumberWeek : number = 0
  public schedule :any = []
  constructor(
    private reservationService : ReservationService,
    private authService : AuthService
  ) { }

  ngOnInit(): void {
    this.reservationService.getReservations()
    this.reservationService.getReservationTest().subscribe((planning:any) => {
      this.schedule = planning.sort(function compare(a:any, b:any) {
        var dateA = new Date(a.day).getTime();
        var dateB = new Date(b.day).getTime();
        return dateA - dateB;
      });
    })
    this.reservationService.reservations$.subscribe((reservations:Reservation[]) => {
      this.reservations = reservations
    })
    this.initScheduleData(this.incrementNumberWeek)
  }

  formateDate(date:any){
    return moment(date.day).format('dddd DD MMMM')
  }

  reserveCreneau(reservation:any, index:number){
    let daySelected = this.schedule.find((schedule:any) => schedule.day === reservation)
    daySelected.daySlot[index].isBooked = true
  }

  initScheduleData(weekFrom:number){
    this.headerSchedule = []
    this.rowsSchedule = []
    this.headerScheduleString = []
    let numberDayFrom : number = weekFrom * 7

    moment.locale('fr');
    for(let i = 0; i < 6; i++){
      const actualMomentDay = moment(moment().startOf('week')).add((i+numberDayFrom),'day').format('L')
      const actualDayDateMoment = moment(moment().startOf('week')).add((i+numberDayFrom),'day').format('LLLL')
      const actualDay= moment(moment().startOf('week')).add((i+numberDayFrom),'day').format('LLLL').split(" ")
      const dayConcat = `${actualDay[0]} ${actualDay[1]} ${actualDay[2]}`
      this.headerSchedule.push({label:dayConcat , value:actualMomentDay, valueDate : actualDayDateMoment})
    }

    for(let i = 0; i < 9; i++){
      let hour = i+9
      let rowScheduleValue:any = {}
      this.headerSchedule.forEach(header => {
        rowScheduleValue[header.label]=hour
      });
      this.rowsSchedule.push(rowScheduleValue)
    }
    this.headerScheduleString = this.headerSchedule.map(header => header.label)
  }

  getWeek(date:any) : string{
    return moment(date).format('LL')
  }

  checkifOnePropertyisUndefined(objectToCheck:any) : boolean{
    let hasPropertyUndefined:boolean = false
    for(let key in objectToCheck) {
      if(objectToCheck[key] === undefined){
        hasPropertyUndefined = true
      }
    }
    return hasPropertyUndefined
  }

  checkIfTimeSlotAvailable(creneau:any): boolean{
    let isReserved : boolean = true
    this.reservations.forEach(reservation => {
      if(reservation.creneau === creneau[0] && reservation.date === creneau[1]){
        isReserved = false
      }
    });
    return isReserved
  }

  public incrementWeek(){
    this.incrementNumberWeek = this.incrementNumberWeek+1
    this.initScheduleData(this.incrementNumberWeek)
  }

  public decrementWeek(){
    if(this.incrementNumberWeek > 0){
      this.incrementNumberWeek = this.incrementNumberWeek-1
      this.initScheduleData(this.incrementNumberWeek)
    }
  }

  saveReservation(element:any){
    let reservationToSave : Reservation = {
      creneau:element[0],
      date: element[1],
      idMassage :this.massageSelected._id,
      iduser:this.authService.getUser().value._id
    }
    this.massageEvent.emit(reservationToSave)
  }

}
