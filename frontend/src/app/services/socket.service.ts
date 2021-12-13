import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment';
import { ReservationService } from './reservation.service';
import { Reservation } from '../models/reservation.model';
@Injectable()

export class SocketService {
  public socket = <Socket>{}

  constructor(private reservationService : ReservationService) { }

  setupSocketConnection(){
    this.socket = io(environment.SOCKET_ENDPOINT)

    this.socket.on('reservation', (reservation: Reservation) => {
      const newScheduleReservationIndex = this.reservationService.reservations$.value.findIndex(schedule => schedule.day === reservation.day)
      this.reservationService.reservations$.value[newScheduleReservationIndex] = reservation
      this.reservationService.reservations$.next(this.reservationService.reservations$.value)
    });

  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }

}
