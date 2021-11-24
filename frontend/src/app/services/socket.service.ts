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

    this.socket.on('reservation', (data: Reservation[]) => {
      this.reservationService.reservations$.next([...data])
    });

  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
}


}
