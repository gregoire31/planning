import { Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginForm = this.fb.group({
    email: [null],
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

  constructor(private fb: UntypedFormBuilder, private authService : AuthService, private toastService : ToastrService) { }

  toggleLogginPageButton(){
    this.logginPage = !this.logginPage
  }

  onSubmitRegister(){
    this.authService.signUp(this.registerForm.value).subscribe(() => {
      this.toastService.success('Utilisateur enregistré avec succés')
      this.toggleLogginPageButton()
    })
  }

  onSubmitLogin(){
    this.authService.signIn(this.loginForm.value)
  }

  getButton(){
    return !this.logginPage ? "Se connecter" : "S'enregistrer"
  }

}
