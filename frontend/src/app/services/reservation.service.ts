import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation } from '../models/reservation.model';
import { Subject } from 'rxjs';

@Injectable()
export class ReservationService {
  public reservations$ : Subject<Reservation[]> = new Subject()

  constructor(private http: HttpClient) {}

  getReservations(){
    this.http.get<Reservation[]>('http://www.localhost:3000/api/reservations/reservations').subscribe(reservations => {
      this.reservations$.next([...reservations])
    })
  }

  saveMassage(param:Reservation){
    return this.http.post<Reservation>(`http://www.localhost:3000/api/reservations/reservations`,param);
  }


}
