import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, ReservationUser } from '../models/user.model';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private http: HttpClient, private router: Router) { }

  addReservationToUser(reservationUser: ReservationUser) {
    return this.http.post<User>('http://www.localhost:3000/api/users/addReservationToUser', reservationUser);
  }

}
