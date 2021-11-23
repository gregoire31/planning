import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment';
@Injectable()
export class SocketService {
  public socket = <Socket>{}

  connect(){
    this.socket = io(environment.SOCKET_ENDPOINT)
  }



}
