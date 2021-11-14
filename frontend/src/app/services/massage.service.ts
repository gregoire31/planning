import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Massage } from '../models/massage.model';
import { Router } from '@angular/router';

@Injectable()
export class MassageService {
  constructor(private http: HttpClient, private router : Router) { }

  getAllMassages(){
    return this.http.get<Massage[]>('http://www.localhost:3000/api/massages/massages');
  }

  getMassage(id:string){
    return this.http.get<Massage>(`http://www.localhost:3000/api/massages/massage/${id}`);
  }


}
