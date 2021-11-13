import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  private user = <User>{}
  constructor(private http: HttpClient, private router : Router) { }

  getUser():User {
    return this.user
  }

  signIn(credentials:any){
    this.http.post('http://www.localhost:3000/api/users/signIn', credentials).subscribe((res:any) => {
      if (res['token']) {
        localStorage.setItem('token', res['token']);
        this.user = res['user'][0]
        this.router.navigate(['/planning'])
      }
    })
  }

  signUp(user:any){
    return this.http.post('http://www.localhost:3000/api/users/signUp', user)
  }

  logOut(){
    localStorage.removeItem('token')
    this.user = <User>{}
    this.router.navigate(['/signIn'])
  }

}
