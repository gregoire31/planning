import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Employe } from 'src/app/models/employe.model';
import { Prestation } from 'src/app/models/prestation.model';
import { Reservation1 } from 'src/app/models/reservation.model';
import { SlotBooking } from 'src/app/models/slots';
import { AdministrationService } from 'src/app/services/administration.service';
import { AuthService } from 'src/app/services/auth.service';
import { CalendarService } from 'src/app/services/calendar.service';
import { PrestationService } from 'src/app/services/prestation.service';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-calendar-employe',
  templateUrl: './calendar-employe.component.html',
  styleUrls: ['./calendar-employe.component.scss']
})
export class CalendarEmployeComponent implements OnInit, OnChanges {
  @ViewChildren('planning') planning: QueryList<ElementRef> | undefined;
  @Input() idEmploye: string = '';
  @Input() prestationSelected: Prestation = <Prestation>{};
  @Input() numberOfDays : number = 0;
  public daysOfTheWeek : any[] = [];
  public employeSelected : Employe = <Employe>{};
  public hoursRange = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  public reservations : Reservation1[] = []

  public incrementNumberWeek: number = 0;
  public schedule: Reservation1[] = [];
  public currentMonday: string = '';
  public currentMondayFrench: string = '';
  public employees: Employe[] = [];
  public temporateBookedSlots: any;
  public reservation: SlotBooking[] = [];
  public topPositionInPx: number = 0;
  public selectedDate: Date = new Date();
  private prestations : Prestation[] = []

  constructor(private administrationService : AdministrationService,
    private reservationService : ReservationService,
    private renderer : Renderer2,
    private elm : ElementRef,
    private prestationService : PrestationService,
    private authService :AuthService,
    private calendarService : CalendarService) { }

  ngOnInit(): void {

    this.daysOfTheWeek = this.calendarService.generateDaysOfWeek(this.numberOfDays)

  }

  ngOnChanges(){
    combineLatest(this.reservationService.getReservationOfEmploye(this.idEmploye,[this.calendarService.getMonday(),this.calendarService.getSunday()]),
    this.administrationService.getEmploye(this.idEmploye),
    this.prestationService.getAllPrestations()).subscribe(([reservations,employe,prestations]) => {
      this.reservations = reservations;
      this.employeSelected = employe;
      this.prestations = prestations
      this.fetchReservationAndGenerateSlot()
    })
  }

  addListenerFunctionCalendar() {

    // var timesPerSecond = 5;
    // var wait = false;

    this.planning?.toArray().forEach((item, index) => {

      this.renderer.listen(item.nativeElement, 'mouseleave', () => {
        // lance event à chaque fois qu'on sort du planning
        this.calendarService.removeCreationSlot(item, this.renderer,this.temporateBookedSlots);
      });
      this.renderer.listen(item.nativeElement, 'mouseover', (event:any) => {
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

  // private generateCardSlot(divToCreate:any,topPixelPosition:number, numberOfSlot:number,index:number, extraStyle:string, addText:boolean, elementRef : ElementRef | undefined, reservationName: string){

  //   if(addText){
  //     const text = this.renderer.createText(
  //       `Réservation massage ${reservationName}`
  //     );

  //     this.renderer.appendChild(divToCreate, text);
  //   }

  //   this.renderer.setAttribute(
  //     divToCreate,
  //     'style',
  //     `display:flex; justify-content:center; align-items:center; color:white; position: absolute; top:${topPixelPosition}px;
  //      width: 90%; height: ${numberOfSlot * 20}px; pointer-events:none; ${extraStyle}`
  //   );
  //   if(elementRef){
  //     this.renderer.appendChild(
  //       elementRef.nativeElement,
  //       divToCreate
  //     );
  //   }

  // }

  fetchReservationAndGenerateSlot(event?:any){
    this.reservation = []
    this.calendarService.removeEmployeCards(this.elm,this.renderer)

    this.daysOfTheWeek.forEach((days,index) => {

        let slotsBooked : number[] = []

        this.reservations.map(reservation => {
          if(reservation.day === days.date){

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
          employe_id: this.employeSelected._id,
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
  }

  public bookSlot(index: number,day:any, event:any) {

    if (Object.keys(this.prestationSelected).length !== 0) {
      this.reservation[index].firstIndexSlotsBooked = Number(event.target.id)
      this.reservation[index].slotsBooked = [
        ...this.reservation[index].slotsBooked,
        ...this.reservation[index].slotToBook,
      ];

      this.calendarService.saveToDB(this.reservation[index].firstIndexSlotsBooked,this.employeSelected._id,this.authService.user.getValue()._id,day.fullDate,this.prestationSelected._id)
      let extraStyle = 'background-color:crimson'
      const div = this.renderer.createElement('div');
      this.renderer.setAttribute(div, 'class', 'rendererCard');
      this.calendarService.generateCardSlot(this.renderer,div,this.topPositionInPx,this.reservation[index].numberOfSlot,index,extraStyle,true, this.planning?.toArray()[index],this.prestationSelected.nom)

    }
  }

}
