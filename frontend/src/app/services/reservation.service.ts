import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation } from '../models/reservation.model';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class ReservationService {
  public reservations$ = new BehaviorSubject<Reservation[]>([])

  constructor(private http: HttpClient) {}

  getReservations(){
    this.http.get<Reservation[]>('http://www.localhost:3000/api/reservations/reservations').subscribe(reservations => {
      this.reservations$.next([...reservations])
    })
  }

  getReservationTest(){
    this.http.get('http://www.localhost:3000/api/reservations/reservations2/2021-12-06').subscribe(reservations => {
      console.log(reservations)
    })
  }

  saveMassage(param:Reservation){
    return this.http.post<Reservation>(`http://www.localhost:3000/api/reservations/reservations`,param);
  }


}
