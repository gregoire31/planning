import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }

  getListCourse(){
    return this.http.get('http://www.localhost:3000/getCourses');
  }

  signIn(credentials:any){
    return this.http.post('http://www.localhost:3000/api/users/signIn', credentials)
  }
  signUp(user:any){
    return this.http.post('http://www.localhost:3000/api/users/signUp', user)
  }

}
