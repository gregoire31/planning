import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation } from '../models/reservation.model';
import { Router } from '@angular/router';

@Injectable()
export class ReservationService {
  constructor(private http: HttpClient, private router : Router) { }

  getAllReservations(){
    return this.http.get<Reservation[]>('http://www.localhost:3000/api/reservations/reservations');
  }

  saveMassage(param:Reservation){
    console.log(param)
    return this.http.post<Reservation>(`http://www.localhost:3000/api/reservations/reservations`,param);
  }


}
