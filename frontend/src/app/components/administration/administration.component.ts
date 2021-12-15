import { Component, OnInit } from '@angular/core';
import { Employe } from 'src/app/models/employe.model';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {
  public employees : Employe[] = []
  constructor() { }

  ngOnInit(): void {
    this.employees = [
      {
        _id : "frehrehgeg",
        jourArret: ["sat : 2021/20/03","sat : 2021/20/03"],
        jourTravaille: ["sat : 2021/20/03","sat : 2021/20/03"],
        listeDesPrestations : ["619026968a03ad3f9c868caf","619026968a03ad3f9c868cb0","619026968a03ad3f9c868cb1","619026968a03ad3f9c868cb2","619026968a03ad3f9c868cb3"],
        nom: "Cindy",
        pauseEntrePrestation : 30,
        photo : "../../../assets/masseuse1.jpg",
        profession: "masseuse"
      },
      {
        _id : "fezfzegzeg",
        jourArret: ["sat : 2021/20/03","sat : 2021/20/03"],
        jourTravaille: ["sat : 2021/20/03","sat : 2021/20/03"],
        listeDesPrestations : ["619026968a03ad3f9c868caf","619026968a03ad3f9c868cb0","619026968a03ad3f9c868cb1","619026968a03ad3f9c868cb2"],
        nom: "Samantha",
        pauseEntrePrestation : 30,
        photo : "../../../assets/masseuse2.png",
        profession: "masseuse"
      }
    ]
  }

}
