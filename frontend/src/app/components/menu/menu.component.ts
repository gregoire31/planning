import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(!token || Object.keys(this.authService.getUser().value).length !==0) return
    this.authService.checkToken(token).subscribe((user)=> {
      this.authService.user.next(user)
    })
  }

  logOut(){
    this.authService.logOut()
  }

}
