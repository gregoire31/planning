import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReservationService } from 'src/app/services/reservation.service';
import { AuthService } from 'src/app/services/auth.service';
import { Reservation, dateBooking, ReservationSlotData } from 'src/app/models/reservation.model';
import * as moment from 'moment';
import { Prestation } from 'src/app/models/prestation.model';
import { ToastrService } from 'ngx-toastr';
import { translateEnglishDays, translateEnglishMonths } from 'src/app/models/date.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  @Input() prestationSelected: Prestation = <Prestation>{}
  @Output() prestationEvent = new EventEmitter<ReservationSlotData>();

  public incrementNumberWeek : number = 0
  public schedule : Reservation[] = []
  public currentMonday : string = ''
  private dateBooking : dateBooking = <dateBooking>{}
  public currentMondayFrench : string = ''
  constructor(
    private reservationService : ReservationService,
    private authService : AuthService,
    private toastService : ToastrService
  ) { }

  ngOnInit(): void {
    this.currentMonday = moment(moment().startOf('week')).add((1),'day').format("YYYY-MM-DD")
    this.currentMondayFrench = `${this.convertToFrechDate(this.formateDate(this.currentMonday))} ${moment(this.currentMonday).format('YYYY')}`
    this.reservationService.getReservations(this.currentMonday)
    this.reservationService.reservations$.subscribe(planning => {
      this.schedule = this.orderByDate(planning)
      this.schedule = this.addLitteralHours(planning)
    })
  }

  private orderByDate(planning: Reservation[]) {
    return planning.sort(function compare(a:any, b:any) {
      var dateA = new Date(a.day).getTime();
      var dateB = new Date(b.day).getTime();
      return dateA - dateB;
    });
  }

  private addLitteralHours(planning: Reservation[]){
    planning.forEach(day => {
      day.daySlot.forEach(slot => {
        slot.litteralHour = this.convertLiteralHour(slot.hourSlot)
      });

    })
    return planning
  }

  formateDate(date:any){
    return moment(date).format('dddd DD MMMM')
  }

  getScheduleDocument(day:string){
    return this.schedule.filter(schedule => this.formateDate(schedule.day) === day)[0]
  }

  reserveCreneau(reservation:any, index:number){
    if(Object.keys(this.prestationSelected).length === 0){
      this.toastService.error('Veuillez sélectionner un prestation')
      return
    }
    let daySelected = JSON.parse(JSON.stringify(this.schedule.find((schedule:any) => schedule.day === reservation)))


    if(daySelected && daySelected.daySlot[index].isBooked === false){
      this.dateBooking = {
        slot : daySelected.daySlot[index].hourSlot,
        day: this.formateDate(daySelected.day)
      }

      const reservation :ReservationSlotData = {
        isBooked : true,
        idPrestation : this.prestationSelected._id,
        idUser : this.authService.getUser().value._id,
        idSlot : daySelected.daySlot[index].idSlot,
        idReservation : this.getScheduleDocument(this.dateBooking.day)._id,
        dateSchema : this.currentMonday,
        slot : this.convertLiteralHour(daySelected.daySlot[index].hourSlot),
        day: this.convertToFrechDate(this.formateDate(daySelected.day))
      }
      this.prestationEvent.emit(reservation)
    }
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
    this.currentMondayFrench = `${this.convertToFrechDate(this.formateDate(this.currentMonday))} ${moment(this.currentMonday).format('YYYY')}`
    this.reservationService.getReservations(this.currentMonday)
  }

  public decrementWeek(){
    if(this.incrementNumberWeek > 0){
      this.incrementNumberWeek = this.incrementNumberWeek-1
      this.currentMonday = moment(moment().startOf('week')).add((1 + (this.incrementNumberWeek * 7)),'day').format("YYYY-MM-DD")
      this.currentMondayFrench = `${this.convertToFrechDate(this.formateDate(this.currentMonday))} ${moment(this.currentMonday).format('YYYY')}`
      this.reservationService.getReservations(this.currentMonday)
    }
  }

  public convertToFrechDate(englishDate : string){
    const dayName = englishDate.split(' ')[0]
    const dayNumber = englishDate.split(' ')[1]
    const monthName = englishDate.split(' ')[2]
    return `${translateEnglishDays[dayName]} ${dayNumber} ${translateEnglishMonths[monthName]}`
  }

  public convertLiteralHour (hour: number) : string{
    return hour % 1 === 0 ? `${hour} h` : `${Math.trunc(hour)} h 30`
  }

}
