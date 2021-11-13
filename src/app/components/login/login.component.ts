import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm = this.fb.group({
    username: [null],
    password: [null]
  });
  public registerForm = this.fb.group({
    nom: [null],
    prenom: [null],
    adresse: [null],
    email: [null],
    numeroTelephone:[null],
    password: [null]
  });
  public logginPage : boolean = true
  constructor(private fb: FormBuilder, private authService : AuthService) { }

  ngOnInit(): void {
  }
  toggleLogginPageButton(){
    this.logginPage = !this.logginPage
  }
  // onSubmit() {
  //   console.log(this.loginForm.value)
  //   this.authService.connect(this.loginForm.value).subscribe(data => {
  //     console.log(data)
  //   })
  // }
  onSubmitRegister(){
    this.authService.createUser(this.registerForm.value).subscribe(data => {
      console.log('merde')
    })
  }

  onSubmitLogin(){

  }

  getButton(){
    return !this.logginPage ? "Se connecter" : "S'enregistrer"
  }

}
