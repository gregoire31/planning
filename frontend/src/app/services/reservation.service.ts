import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation, Reservation1, ReservationSlotData } from '../models/reservation.model';
import { BehaviorSubject } from 'rxjs';
import { httpResponseCustom } from '../models/generic.model';

@Injectable()
export class ReservationService {
  public reservations$ = new BehaviorSubject<Reservation[]>([])

  constructor(private http: HttpClient) {}

  getReservations(date:string){
    this.http.get<Reservation[]>(`http://www.localhost:3000/api/reservations/reservations/${date}`).subscribe(reservations => {
      this.reservations$.next(reservations)
    })
  }

  saveReservation(param:ReservationSlotData){
    return this.http.post<Reservation>(`http://www.localhost:3000/api/reservations/reservations`,param);
  }

  saveReservation1(param:Reservation1){
    return this.http.post<Reservation1>(`http://www.localhost:3000/api/reservations1/reservations1`,param);
  }

  getReservations1(date:string){
    return this.http.get<Reservation1[]>(`http://www.localhost:3000/api/reservations1/reservations1/${date}`)
  }
  getReservations1OfUser(userID:string){
    return this.http.get<Reservation1[]>(`http://www.localhost:3000/api/reservations1/reservations1/userId/${userID}`)
  }

  getReservationOfEmploye(employeId:string, rangeDate: Date[]){
    const param : any = {
      employeId,
      rangeDate
    }
    return this.http.post<Reservation1[]>(`http://www.localhost:3000/api/reservations1/reservations1/employeId`,param)
  }

  deleteReservation(reservationId:string){
    return this.http.get<httpResponseCustom>(`http://www.localhost:3000/api/reservations1/reservations1/removeReservation/${reservationId}`)
  }

}
