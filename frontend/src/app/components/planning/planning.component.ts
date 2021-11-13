import { Component, OnInit } from '@angular/core';
import { MassageService } from 'src/app/services/massage.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {

  constructor(private massageService : MassageService) { }

  ngOnInit(): void {
    this.massageService.getAllMassages().subscribe(massages => {
      console.log(massages)
    })
  }

  getMassages(){
    this.massageService.getAllMassages().subscribe(massages => {
      console.log(massages)
    })
  }

}
