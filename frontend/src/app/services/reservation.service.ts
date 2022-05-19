import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation, ReservationSlotData } from '../models/reservation.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ReservationService {
  public reservations$ = new BehaviorSubject<Reservation[]>([])

  constructor(private http: HttpClient) {}

  getReservations(date:string){
    this.http.get<Reservation[]>(`http://www.localhost:3000/api/reservations/reservations/${date}`).subscribe(reservations => {
      this.reservations$.next(reservations)
    })
  }

  savePrestation(param:ReservationSlotData){
    return this.http.post<Reservation>(`http://www.localhost:3000/api/reservations/reservations`,param);
  }


}
