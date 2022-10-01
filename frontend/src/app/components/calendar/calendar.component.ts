import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChildren,
  QueryList,
  Renderer2,
  ViewChild,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { ReservationService } from 'src/app/services/reservation.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  Reservation,
  dateBooking,
  ReservationSlotData,
  Reservation1,
} from 'src/app/models/reservation.model';
import * as moment from 'moment';
import { Prestation } from 'src/app/models/prestation.model';
import { ToastrService } from 'ngx-toastr';
import {
  translateEnglishDays,
  translateEnglishMonths,
} from 'src/app/models/date.model';
import { SlotBooking } from 'src/app/models/slots';
import { AdministrationService } from 'src/app/services/administration.service';
import { Employe } from 'src/app/models/employe.model';
import { combineLatest } from 'rxjs';
import { PrestationService } from 'src/app/services/prestation.service';
import { User } from 'src/app/models/user.model';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @ViewChildren('planning') planning: QueryList<ElementRef> | undefined;
  @Input() prestationSelected: Prestation = <Prestation>{};
  @Output() prestationEvent = new EventEmitter<ReservationSlotData>();
  @Output() chooseEmploye = new EventEmitter<string>();
  public actualDay = new Date()
  public incrementNumberWeek: number = 0;
  public schedule: Reservation[] = [];
  public currentMonday: string = '';
  private dateBooking: dateBooking = <dateBooking>{};
  public currentMondayFrench: string = '';
  public hoursRange = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  public employees: Employe[] = [];
  public temporateBookedSlots: any;
  public reservation: SlotBooking[] = [];
  public topPositionInPx: number = 0;
  public selectedDate: Date = new Date();
  private prestations : Prestation[] = []
  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private toastService: ToastrService,
    private renderer: Renderer2,
    private administrationService: AdministrationService,
    private prestationService : PrestationService,
    private elm : ElementRef,
    private calendarService : CalendarService
  ) {}

  ngOnInit(): void {
    combineLatest(this.administrationService.getEmployes(), this.prestationService.getAllPrestations()).subscribe(
      ([employees, prestations]) => {
        this.prestations = prestations
        this.employees = employees;
        this.fetchReservationAndGenerateSlot()
      }
    );

    // this.currentMonday = moment(moment().startOf('week'))
    //   .add(1, 'day')
    //   .format('YYYY-MM-DD');
    // this.currentMondayFrench = `${this.convertToFrechDate(
    //   this.formateDate(this.currentMonday)
    // )} ${moment(this.currentMonday).format('YYYY')}`;
    // this.reservationService.getReservations(this.currentMonday);
    // this.reservationService.reservations$.subscribe((planning) => {
    //   if (this.planning) {
    //     let hourSlots = this.planning?.nativeElement.childNodes;
    //     hourSlots.forEach((hourSlot: any) => {
    //       let quartHourSlots = hourSlot.childNodes;
    //       quartHourSlots.forEach((quartHourSlot: any) => {
    //         this.renderer.setStyle(quartHourSlot, 'background', 'aliceblue');
    //       });
    //     });
    //   }
    //   this.schedule = this.orderByDate(planning);
    //   this.schedule = this.addLitteralHours(planning);
    // });
  }

  selectEmploye(employeId: string){
    this.chooseEmploye.emit(employeId)
  }

  fetchReservationAndGenerateSlot(event?:any){
    this.reservation = []
    this.calendarService.removeEmployeCards(this.elm,this.renderer)
    this.reservationService.getReservations1(this.selectedDate.toLocaleDateString('fr')).subscribe(reservations => {

      this.employees.forEach((employe,index) => {

        let slotsBooked : number[] = []

        reservations.map(reservation => {
          if(reservation.id_employe === employe._id){
            const reservationName = this.prestations.filter(prestation => prestation._id === reservation.id_prestation)[0].nom

            let topPixelPosition = (reservation.slot - this.hoursRange[0]) * 80 + 40
            let numberOfSlot = this.prestations.find(prestation => prestation._id === reservation.id_prestation)?.duree
            numberOfSlot = numberOfSlot ? numberOfSlot * 4 : 0

            slotsBooked = [...slotsBooked,...this.calendarService.generateSlotListBooked(numberOfSlot, reservation.slot )]
            let extraStyle = 'background-color:crimson'
            const div = this.renderer.createElement('div');
            this.renderer.setAttribute(div, 'class', 'rendererCard');
            this.calendarService.generateCardSlot(this.renderer,div,topPixelPosition,numberOfSlot,index,extraStyle,true, this.planning?.toArray()[index],reservationName)
          }
        })
        this.reservation.push({
          employe_id: employe._id,
          slotsBooked: slotsBooked,
          slotsUnbooked: [],
          actualSlotFocus: 0,
          numberOfSlot: 0,
          slotToBook: [],
          firstIndexSlotsBooked : 0
        });
      });
      setTimeout(() => {
        this.addListenerFunctionCalendar();
      }, 0);
    })
  }

  addListenerFunctionCalendar() {
    // var timesPerSecond = 5;
    // var wait = false;

    this.planning?.toArray().forEach((item, index) => {
      this.renderer.listen(item.nativeElement, 'mouseleave', () => {
        // lance event à chaque fois qu'on sort du planning
        this.calendarService.removeCreationSlot(item, this.renderer ,this.temporateBookedSlots);
      });
      this.renderer.listen(item.nativeElement, 'mouseover', (event) => {
        // lance event à chaque passage sur un autre slot
        // if (!wait) {
        let cannotBeBooked = true;

        this.calendarService.removeCreationSlot(item, this.renderer ,this.temporateBookedSlots);
        this.reservation[index].actualSlotFocus = Number(event.target.id);
        this.reservation[index].numberOfSlot = this.prestationSelected.duree * 4;
        this.reservation[index].slotToBook = [];
        this.reservation[index].slotsUnbooked = [];
        for (let i = 0; i < this.reservation[index].numberOfSlot; i++) {
          this.reservation[index].slotToBook.push(
            this.reservation[index].actualSlotFocus + 0.25 * i
          );
        }

        for (let i = 1; i < this.reservation[index].numberOfSlot; i++) {
          this.reservation[index].slotsUnbooked.push(
            this.hoursRange[this.hoursRange.length - 1] + 1 - 0.25 * i
          );
        }

        cannotBeBooked = this.reservation[index].slotToBook.some(
          (r) => this.reservation[index].slotsBooked.indexOf(r) >= 0
        ); // vérifie si le créneau à réserver n'empiètent pas sur un autre et qu'il y a de la place pour la réservation

        if (
          this.reservation[index].slotToBook[
            this.reservation[index].slotToBook.length - 1
          ] >=
          this.hoursRange[this.hoursRange.length - 1] + 1
        ) {
          // vérifie s'il n'est pas trop tard pour réserver ce créneau
          cannotBeBooked = true;
        }


        if (cannotBeBooked) {
          this.renderer.setStyle(item.nativeElement, 'cursor', 'not-allowed');
        } else {
          this.renderer.setStyle(item.nativeElement, 'cursor', 'pointer');

          this.topPositionInPx =
            (this.reservation[index].actualSlotFocus - this.hoursRange[0]) * 80 + 40;

            let extraStyle = `background-image: linear-gradient(45deg, #1f943d 8.33%, #ffffff 8.33%, #ffffff 50%, #1f943d 50%, #1f943d 58.33%, #ffffff 58.33%, #ffffff 100%);
            background-size: 8.49px 8.49px`
            this.temporateBookedSlots = this.renderer.createElement('div')
            this.calendarService.generateCardSlot(this.renderer,this.temporateBookedSlots,this.topPositionInPx,this.reservation[index].numberOfSlot,index,extraStyle,false,item,this.prestationSelected.nom)

        }

        //   wait = true;
        //   setTimeout(function () {
        //     wait = false;
        //   }, 1000 / timesPerSecond);
        // }
      });
    });
  }

  public bookSlot(index: number, employeId:string, event:any) {

    if (Object.keys(this.prestationSelected).length !== 0) {
      this.reservation[index].firstIndexSlotsBooked = Number(event.target.id)
      this.reservation[index].slotsBooked = [
        ...this.reservation[index].slotsBooked,
        ...this.reservation[index].slotToBook,

      ];
      this.calendarService.saveToDB(this.reservation[index].firstIndexSlotsBooked,employeId,this.authService.user.getValue()._id, this.selectedDate,this.prestationSelected._id)
      let extraStyle = 'background-color:crimson'
      const div = this.renderer.createElement('div');
      this.renderer.setAttribute(div, 'class', 'rendererCard');
      this.calendarService.generateCardSlot(this.renderer,div,this.topPositionInPx,this.reservation[index].numberOfSlot,index,extraStyle,true, this.planning?.toArray()[index],this.prestationSelected.nom)


    //   const divToCreate = this.renderer.createElement('div');

    //   const text = this.renderer.createText(
    //     `Réservation massage ${this.prestationSelected.nom}`
    //   );


    //   this.renderer.appendChild(divToCreate, text);

    //   this.renderer.setAttribute(
    //     divToCreate,
    //     'style',
    //     `display:flex; justify-content:center; align-items:center; color:white; position: absolute; top:${
    //       this.topPositionInPx
    //     }px; background-color:crimson; width: 90%; height: ${
    //       this.reservation[index].numberOfSlot * 20
    //     }px;pointer-events:none`
    //   );
    //   this.renderer.appendChild(
    //     this.planning?.toArray()[index].nativeElement,
    //     divToCreate
    //   );
    }
  }

  // private addLitteralHours(planning: Reservation[]) {
  //   planning.forEach((day) => {
  //     day.daySlot.forEach((slot) => {
  //       slot.litteralHour = this.convertLiteralHour(slot.hourSlot);
  //     });
  //   });
  //   return planning;
  // }

  // formateDate(date: any) {
  //   return moment(date).format('dddd DD MMMM');
  // }

  // getScheduleDocument(day: string) {
  //   return this.schedule.filter(
  //     (schedule) => this.formateDate(schedule.day) === day
  //   )[0];
  // }

  // reserveCreneau(reservation: any, index: number) {
  //   if (Object.keys(this.prestationSelected).length === 0) {
  //     this.toastService.error('Veuillez sélectionner un prestation');
  //     return;
  //   }
  //   let daySelected = JSON.parse(
  //     JSON.stringify(
  //       this.schedule.find((schedule: any) => schedule.day === reservation)
  //     )
  //   );

  //   if (daySelected && daySelected.daySlot[index].isBooked === false) {
  //     this.dateBooking = {
  //       slot: daySelected.daySlot[index].hourSlot,
  //       day: this.formateDate(daySelected.day),
  //     };

  //     const reservation: ReservationSlotData = {
  //       isBooked: true,
  //       idPrestation: this.prestationSelected._id,
  //       idUser: this.authService.getUser().value._id,
  //       idSlot: daySelected.daySlot[index].idSlot,
  //       idReservation: this.getScheduleDocument(this.dateBooking.day)._id,
  //       dateSchema: this.currentMonday,
  //       slot: this.convertLiteralHour(daySelected.daySlot[index].hourSlot),
  //       day: this.convertToFrechDate(this.formateDate(daySelected.day)),
  //     };
  //     this.prestationEvent.emit(reservation);
  //   }
  // }


  // public incrementWeek() {
  //   this.incrementNumberWeek = this.incrementNumberWeek + 1;
  //   this.currentMonday = moment(moment().startOf('week'))
  //     .add(1 + this.incrementNumberWeek * 7, 'day')
  //     .format('YYYY-MM-DD');
  //   this.currentMondayFrench = `${this.convertToFrechDate(
  //     this.formateDate(this.currentMonday)
  //   )} ${moment(this.currentMonday).format('YYYY')}`;
  //   this.reservationService.getReservations(this.currentMonday);
  // }

  // public decrementWeek() {
  //   if (this.incrementNumberWeek > 0) {
  //     this.incrementNumberWeek = this.incrementNumberWeek - 1;
  //     this.currentMonday = moment(moment().startOf('week'))
  //       .add(1 + this.incrementNumberWeek * 7, 'day')
  //       .format('YYYY-MM-DD');
  //     this.currentMondayFrench = `${this.convertToFrechDate(
  //       this.formateDate(this.currentMonday)
  //     )} ${moment(this.currentMonday).format('YYYY')}`;
  //     this.reservationService.getReservations(this.currentMonday);
  //   }
  // }

  // public convertToFrechDate(englishDate: string) {
  //   const dayName = englishDate.split(' ')[0];
  //   const dayNumber = englishDate.split(' ')[1];
  //   const monthName = englishDate.split(' ')[2];
  //   return `${translateEnglishDays[dayName]} ${dayNumber} ${translateEnglishMonths[monthName]}`;
  // }

  // public convertLiteralHour(hour: number): string {
  //   return hour % 1 === 0 ? `${hour} h` : `${Math.trunc(hour)} h 30`;
  // }
}
