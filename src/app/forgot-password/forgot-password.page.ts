import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(public route: Router,public authService: AuthService) { }

  ngOnInit() {
  }


  backTo(){
    this.route.navigate(['login'])
  }

  send(email: string){
    this.authService.resetPassword(email)
    this.route.navigate(['login'])
  }

}
