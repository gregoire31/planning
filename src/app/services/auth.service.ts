import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }

  getListCourse(){
    return this.http.get('http://www.localhost:3000/getCourses');
  }

  // connect(credentials:any){
  //   return this.http.post('http://www.localhost:3000/api/users/createUser', credentials)
  // }
  createUser(user:any){
    return this.http.post('http://www.localhost:3000/api/users/createUser', user)
  }

}
