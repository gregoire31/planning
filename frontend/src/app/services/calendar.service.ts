import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Reservation1 } from '../models/reservation.model';
import { ReservationService } from './reservation.service';

@Injectable()
export class CalendarService {
  constructor(private reservationService: ReservationService) { }

  public saveToDB(slotBooked: number, employeId : string, userId: string,selectedDate:Date, idPrestationSelected: string){
    const newReservation : Reservation1 = {
      date: selectedDate,
      day: selectedDate.toLocaleDateString('fr'),
      id_employe: employeId,
      id_prestation : idPrestationSelected,
      id_user: userId,
      slot: slotBooked
    }
    this.reservationService.saveReservation1(newReservation).subscribe();
  }

  public generateSlotListBooked(numberOfSlot:number, slotStartIndex: number ): number[]{
    let slotsBooked = []
    for (let i = 0; i < numberOfSlot; i++) {
      slotsBooked.push(
        slotStartIndex + 0.25 * i
      );
    }
    return slotsBooked
  }

  public getMonday() {
    let d = new Date();
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1);
    return new Date(d.setDate(diff));
  }

  public getSunday(){
    return new Date(this.getMonday().setDate(this.getMonday().getDate() + 6))
  }

  public addDays(date: Date, days:number) :Date{
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  public removeEmployeCards(elm:ElementRef, renderer:Renderer2){

    let employeCards = elm.nativeElement.querySelectorAll('.employeCardReservations')

    if(employeCards){
      employeCards.forEach((employeCard:any,index:any) => {
        let elements = elm.nativeElement.querySelectorAll(`#employe${index} .rendererCard`);
        if(elements){
          elements.forEach((element:any) => {
            renderer.removeChild(employeCard, element);
          });
        }
      })
    }
  }

  public removeCreationSlot(element: ElementRef, renderer: Renderer2, temporateBookedSlots:any) {
    if (temporateBookedSlots) {
      renderer.removeChild(
        element.nativeElement,
        temporateBookedSlots
      );
    }
  }

  public generateDaysOfWeek(numberOfDays:number) : any[]{
    let daysOfTheWeek = []
    for(let i = 0 ; i < numberOfDays ; i++){
      const day = this.addDays(this.getMonday(),i);
      daysOfTheWeek.push(
        {
          literalDay : this.getLiterralFrenchDayFromNumericEnglishDay(day.getDay()),
          day : day.getDate(),
          date : day.toLocaleDateString('fr'),
          fullDate : new Date(day.toLocaleDateString('en'))
        }
      )
    }
    return daysOfTheWeek;
  }

  public getLiterralFrenchDayFromNumericEnglishDay(enDay:number):string{
    return enDay === 0 ? 'Dimanche' : enDay === 1 ? 'Lundi' : enDay === 2 ? 'Mardi' : enDay === 3 ? 'Mercredi' : enDay === 4 ? 'Jeudi' : enDay === 5 ? 'Vendredi' : 'Samedi';
  }

  public generateCardSlot(renderer: Renderer2,divToCreate:any,topPixelPosition:number, numberOfSlot:number,index:number, extraStyle:string, addText:boolean, elementRef : ElementRef | undefined, reservationName: string){

    if(addText){
      const text = renderer.createText(
        `Réservation massage ${reservationName}`
      );
      renderer.appendChild(divToCreate, text);
    }

    renderer.setAttribute(
      divToCreate,
      'style',
      `display:flex; justify-content:center; align-items:center; color:white; position: absolute; top:${topPixelPosition}px;
       width: 90%; height: ${numberOfSlot * 20}px; pointer-events:none; ${extraStyle}`
    );
    if(elementRef){
      renderer.appendChild(
        elementRef.nativeElement,
        divToCreate
      );
    }
  }

  public orderByDate(planning: Reservation1[]) {
    return planning.sort(function compare(a: any, b: any) {
      var dateA = new Date(a.day).getTime();
      var dateB = new Date(b.day).getTime();
      return dateA - dateB;
    });
  }

  public checkifOnePropertyisUndefined(objectToCheck: any): boolean {
    let hasPropertyUndefined: boolean = false;
    for (let key in objectToCheck) {
      if (objectToCheck[key] === undefined) {
        hasPropertyUndefined = true;
      }
    }
    return hasPropertyUndefined;
  }

}
