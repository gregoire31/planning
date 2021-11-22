import { Component, OnInit } from '@angular/core';
import { MassageService } from 'src/app/services/massage.service';
import { Massage } from 'src/app/models/massage.model';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  public massages = <Massage[]>[]
  public massageSelected = <Massage>{}
  constructor(
    private massageService : MassageService,
    private socketService : SocketService) { }

  ngOnInit(): void {
    this.socketService.connect()
    this.massageService.getAllMassages().subscribe((massages:Massage[]) => {
      massages.forEach(massage => {
        massage.image = `/assets/${massage.nom}.png`
      });
      this.massages = massages
    })
  }

  selectMassage(massage: Massage){
    this.massageSelected = massage
  }

}
