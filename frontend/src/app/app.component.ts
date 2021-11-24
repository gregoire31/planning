import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'planning';


constructor(
  private socketService : SocketService
) { }

ngOnInit(): void {
  this.socketService.setupSocketConnection();

}

ngOnDestroy() : void {
  this.socketService.disconnect();
}
}
