import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReservationService } from 'src/app/services/reservation.service';
import { AuthService } from 'src/app/services/auth.service';
import { Reservation, dateBooking, ReservationData } from 'src/app/models/reservation.model';
import * as moment from 'moment';
import { Massage } from 'src/app/models/massage.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  @Input() massageSelected: Massage = <Massage>{}
  @Output() massageEvent = new EventEmitter<ReservationData>();

  public incrementNumberWeek : number = 0
  public schedule : Reservation[] = []
  public currentMonday : string = ''
  private dateBooking : dateBooking = <dateBooking>{}
  constructor(
    private reservationService : ReservationService,
    private authService : AuthService
  ) { }

  ngOnInit(): void {
    this.currentMonday = moment(moment().startOf('week')).add((1),'day').format("YYYY-MM-DD")
    this.reservationService.getReservations(this.currentMonday)
    this.reservationService.reservations$.subscribe(planning => {
      this.schedule = planning.sort(function compare(a:any, b:any) {
        var dateA = new Date(a.day).getTime();
        var dateB = new Date(b.day).getTime();
        return dateA - dateB;
      });
    })
  }

  formateDate(date:any){
    return moment(date).format('dddd DD MMMM')
  }

  getScheduleDocument(day:string){
    return this.schedule.filter(schedule => moment(schedule.day).format('dddd DD MMMM') === day)[0]
  }

  reserveCreneau(reservation:any, index:number){
    let daySelected = this.schedule.find((schedule:any) => schedule.day === reservation)
    if(daySelected && daySelected.daySlot[index].isBooked === false){
      daySelected.daySlot[index].isBooked = true
      daySelected.daySlot[index].idMassage = this.massageSelected._id
      daySelected.daySlot[index].idUser = this.authService.getUser().value._id
      this.dateBooking = {
        slot : daySelected.daySlot[index].hourSlot,
        day: this.formateDate(daySelected.day)
      }
      this.saveReservation()
    }
  }

  getWeek() : string{
    return moment(this.currentMonday).format('DD MMMM YYYY')
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

  public incrementWeek(){
    this.incrementNumberWeek = this.incrementNumberWeek+1
    this.currentMonday = moment(moment().startOf('week')).add((1 + (this.incrementNumberWeek * 7)),'day').format("YYYY-MM-DD")
    this.reservationService.getReservations(this.currentMonday)
  }

  public decrementWeek(){
    if(this.incrementNumberWeek > 0){
      this.incrementNumberWeek = this.incrementNumberWeek-1
      this.currentMonday = moment(moment().startOf('week')).add((1 + (this.incrementNumberWeek * 7)),'day').format("YYYY-MM-DD")
      this.reservationService.getReservations(this.currentMonday)
    }
  }

  saveReservation(){
    const scheduleDocument = this.getScheduleDocument(this.dateBooking.day)

      let reservationToSave : ReservationData = {
        document: scheduleDocument,
        dateSchema : this.currentMonday,
        date: this.dateBooking.day,
        slot: this.dateBooking.slot
      }

      this.massageEvent.emit(reservationToSave)
  }

}
