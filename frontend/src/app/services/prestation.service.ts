import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Prestation } from '../models/prestation.model';
import { Router } from '@angular/router';

@Injectable()
export class PrestationService {
  constructor(private http: HttpClient, private router : Router) { }

  getAllPrestations(){
    return this.http.get<Prestation[]>('http://www.localhost:3000/api/prestations/prestations');
  }

  getPrestation(id:string){
    return this.http.get<Prestation>(`http://www.localhost:3000/api/prestations/prestation/${id}`);
  }


}
