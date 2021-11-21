import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {
  public user = new BehaviorSubject(<User>{});
  constructor(private http: HttpClient, private router : Router) { }

  getUser():BehaviorSubject<User> {
    return this.user
  }

  signIn(credentials:any){
    this.http.post('http://www.localhost:3000/api/users/signIn', credentials).subscribe((res:any) => {
      if (res['token']) {
        localStorage.setItem('token', res['token']);
        this.user.next(res['user'][0])
        this.router.navigate(['/planning'])
      }
    })
  }

  signUp(user:User){
    return this.http.post('http://www.localhost:3000/api/users/signUp', user)
  }

  checkToken(token:string){
    return this.http.get<User>(`http://www.localhost:3000/api/users/checkToken/${token}`);
  }

  logOut(){
    this.user.next(<User>{})
    this.router.navigate(['/signIn'])
  }

}
